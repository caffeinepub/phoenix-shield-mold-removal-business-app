import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Copy, Save, Loader2, FileDown } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useGetAllEstimates, useCreateEstimate, useUpdateEstimate } from '../hooks/useQueries';
import { copyEstimateToClipboard } from '../utils/copyEstimate';
import { generateEstimatePDF } from '../utils/generateEstimatePDF';
import { toast } from 'sonner';
import type { Estimate } from '../backend';

interface MaterialLineItem {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
}

export default function EstimatesPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/estimates' });
  const estimateIdParam = (search as any)?.estimateId;

  const [currentEstimateId, setCurrentEstimateId] = useState<bigint | null>(null);
  const [squareFootage, setSquareFootage] = useState<number>(0);
  const [pricePerSquareFoot, setPricePerSquareFoot] = useState<number>(0);
  const [materials, setMaterials] = useState<MaterialLineItem[]>([]);
  const [hoursWorked, setHoursWorked] = useState<number>(0);
  const [hourlyRate, setHourlyRate] = useState<number>(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const { data: estimates = [], isLoading: estimatesLoading } = useGetAllEstimates();
  const createEstimate = useCreateEstimate();
  const updateEstimate = useUpdateEstimate();

  const squareFootageSubtotal = useMemo(() => {
    return squareFootage * pricePerSquareFoot;
  }, [squareFootage, pricePerSquareFoot]);

  const materialsTotal = useMemo(() => {
    return materials.reduce((total, item) => total + (item.quantity * item.unitCost), 0);
  }, [materials]);

  const laborSubtotal = useMemo(() => {
    return hoursWorked * hourlyRate;
  }, [hoursWorked, hourlyRate]);

  const grandTotal = useMemo(() => {
    return squareFootageSubtotal + materialsTotal + laborSubtotal;
  }, [squareFootageSubtotal, materialsTotal, laborSubtotal]);

  // Load estimate from URL parameter on mount
  useEffect(() => {
    if (estimateIdParam && estimates.length > 0) {
      const estimate = estimates.find(e => e.estimateId.toString() === estimateIdParam);
      if (estimate) {
        loadEstimate(estimate);
      }
    }
  }, [estimateIdParam, estimates]);

  const loadEstimate = (estimate: Estimate) => {
    setCurrentEstimateId(estimate.estimateId);
    setSquareFootage(Number(estimate.squareFootage));
    setPricePerSquareFoot(Number(estimate.pricePerSquareFoot));
    setMaterials(estimate.materials.map((m, idx) => ({
      id: `${estimate.estimateId}-${idx}`,
      name: m.name,
      quantity: Number(m.quantity),
      unitCost: Number(m.unitCost),
    })));
    setHoursWorked(Number(estimate.laborHours));
    setHourlyRate(Number(estimate.laborHourlyRate));
    
    // Clear URL parameter after loading
    navigate({ to: '/estimates', search: {} });
  };

  const handleLoadEstimate = (estimateId: string) => {
    const estimate = estimates.find(e => e.estimateId.toString() === estimateId);
    if (estimate) {
      loadEstimate(estimate);
      toast.success('Estimate loaded');
    }
  };

  const handleSaveEstimate = async () => {
    try {
      const materialsData = materials.map(m => ({
        name: m.name,
        quantity: BigInt(Math.floor(m.quantity)),
        unitCost: BigInt(Math.floor(m.unitCost * 100)),
      }));

      const data = {
        squareFootage: BigInt(Math.floor(squareFootage)),
        pricePerSquareFoot: BigInt(Math.floor(pricePerSquareFoot * 100)),
        materials: materialsData,
        laborHours: BigInt(Math.floor(hoursWorked)),
        laborHourlyRate: BigInt(Math.floor(hourlyRate * 100)),
      };

      if (currentEstimateId) {
        await updateEstimate.mutateAsync({
          estimateId: currentEstimateId,
          ...data,
        });
        toast.success('Estimate updated successfully');
      } else {
        const newId = await createEstimate.mutateAsync(data);
        setCurrentEstimateId(newId);
        toast.success('Estimate saved successfully');
      }
    } catch (error) {
      console.error('Error saving estimate:', error);
      toast.error('Failed to save estimate');
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      const materialsData = materials.map(m => ({
        name: m.name,
        quantity: BigInt(Math.floor(m.quantity)),
        unitCost: BigInt(Math.floor(m.unitCost * 100)),
      }));

      const estimateData: Estimate = {
        estimateId: currentEstimateId || BigInt(0),
        creationDate: BigInt(Date.now() * 1000000),
        squareFootage: BigInt(Math.floor(squareFootage)),
        pricePerSquareFoot: BigInt(Math.floor(pricePerSquareFoot * 100)),
        materials: materialsData,
        laborHours: BigInt(Math.floor(hoursWorked)),
        laborHourlyRate: BigInt(Math.floor(hourlyRate * 100)),
        totalMaterialCost: BigInt(Math.floor(materialsTotal * 100)),
        totalLaborCost: BigInt(Math.floor(laborSubtotal * 100)),
        totalEstimate: BigInt(Math.floor(grandTotal * 100)),
      };

      await copyEstimateToClipboard(estimateData);
      toast.success('Estimate copied to clipboard');
    } catch (error) {
      console.error('Error copying estimate:', error);
      toast.error('Failed to copy estimate');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      
      const materialsData = materials.map(m => ({
        name: m.name,
        quantity: BigInt(Math.floor(m.quantity)),
        unitCost: BigInt(Math.floor(m.unitCost * 100)),
      }));

      const estimateData: Estimate = {
        estimateId: currentEstimateId || BigInt(0),
        creationDate: BigInt(Date.now() * 1000000),
        squareFootage: BigInt(Math.floor(squareFootage)),
        pricePerSquareFoot: BigInt(Math.floor(pricePerSquareFoot * 100)),
        materials: materialsData,
        laborHours: BigInt(Math.floor(hoursWorked)),
        laborHourlyRate: BigInt(Math.floor(hourlyRate * 100)),
        totalMaterialCost: BigInt(Math.floor(materialsTotal * 100)),
        totalLaborCost: BigInt(Math.floor(laborSubtotal * 100)),
        totalEstimate: BigInt(Math.floor(grandTotal * 100)),
      };

      await generateEstimatePDF({ estimate: estimateData });
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleNewEstimate = () => {
    setCurrentEstimateId(null);
    setSquareFootage(0);
    setPricePerSquareFoot(0);
    setMaterials([]);
    setHoursWorked(0);
    setHourlyRate(0);
    toast.success('Ready for new estimate');
  };

  const addMaterial = () => {
    const newMaterial: MaterialLineItem = {
      id: Date.now().toString(),
      name: '',
      quantity: 0,
      unitCost: 0,
    };
    setMaterials([...materials, newMaterial]);
  };

  const removeMaterial = (id: string) => {
    setMaterials(materials.filter((item) => item.id !== id));
  };

  const updateMaterial = (id: string, field: keyof MaterialLineItem, value: string | number) => {
    setMaterials(materials.map((item) => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const hasValues = squareFootage > 0 || materials.length > 0 || hoursWorked > 0;
  const isSaving = createEstimate.isPending || updateEstimate.isPending;

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Estimate Calculator</h1>
        <p className="text-muted-foreground">
          Create itemized estimates with automatic calculations
        </p>
      </div>

      {/* Load and Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Select onValueChange={handleLoadEstimate} disabled={estimatesLoading}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Load saved estimate..." />
          </SelectTrigger>
          <SelectContent>
            {estimates.length === 0 ? (
              <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                No saved estimates yet
              </div>
            ) : (
              estimates.map((estimate) => (
                <SelectItem key={estimate.estimateId.toString()} value={estimate.estimateId.toString()}>
                  {new Date(Number(estimate.creationDate) / 1000000).toLocaleDateString()} - {formatCurrency(Number(estimate.totalEstimate) / 100)}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        <Button onClick={handleSaveEstimate} disabled={!hasValues || isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {currentEstimateId ? 'Update Estimate' : 'Save Estimate'}
            </>
          )}
        </Button>

        <Button onClick={handleDownloadPDF} variant="outline" disabled={!hasValues || isGeneratingPDF}>
          {isGeneratingPDF ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileDown className="h-4 w-4 mr-2" />
              Download PDF
            </>
          )}
        </Button>

        <Button onClick={handleCopyToClipboard} variant="outline" disabled={!hasValues}>
          <Copy className="h-4 w-4 mr-2" />
          Copy to Clipboard
        </Button>

        {currentEstimateId && (
          <Button onClick={handleNewEstimate} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Estimate
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Square Footage Section */}
        <Card>
          <CardHeader>
            <CardTitle>Square Footage</CardTitle>
            <CardDescription>Calculate costs based on area</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="squareFootage">Square Footage</Label>
                <Input
                  id="squareFootage"
                  type="number"
                  min="0"
                  step="1"
                  value={squareFootage || ''}
                  onChange={(e) => setSquareFootage(Number(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricePerSquareFoot">Price per Sq Ft</Label>
                <Input
                  id="pricePerSquareFoot"
                  type="number"
                  min="0"
                  step="0.01"
                  value={pricePerSquareFoot || ''}
                  onChange={(e) => setPricePerSquareFoot(Number(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="font-semibold">Subtotal:</span>
              <span className="text-lg font-bold">{formatCurrency(squareFootageSubtotal)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Materials Section */}
        <Card>
          <CardHeader>
            <CardTitle>Materials</CardTitle>
            <CardDescription>Add line items for materials and supplies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {materials.map((material) => (
              <div key={material.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                <div className="md:col-span-5 space-y-2">
                  <Label htmlFor={`material-name-${material.id}`}>Material Name</Label>
                  <Input
                    id={`material-name-${material.id}`}
                    type="text"
                    value={material.name}
                    onChange={(e) => updateMaterial(material.id, 'name', e.target.value)}
                    placeholder="e.g., HEPA Filter"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor={`material-quantity-${material.id}`}>Quantity</Label>
                  <Input
                    id={`material-quantity-${material.id}`}
                    type="number"
                    min="0"
                    step="1"
                    value={material.quantity || ''}
                    onChange={(e) => updateMaterial(material.id, 'quantity', Number(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor={`material-cost-${material.id}`}>Unit Cost</Label>
                  <Input
                    id={`material-cost-${material.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={material.unitCost || ''}
                    onChange={(e) => updateMaterial(material.id, 'unitCost', Number(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Total</Label>
                  <div className="h-10 flex items-center font-semibold">
                    {formatCurrency(material.quantity * material.unitCost)}
                  </div>
                </div>
                <div className="md:col-span-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMaterial(material.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button onClick={addMaterial} variant="outline" className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add Material
            </Button>

            {materials.length > 0 && (
              <>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Materials Total:</span>
                  <span className="text-lg font-bold">{formatCurrency(materialsTotal)}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Labor Section */}
        <Card>
          <CardHeader>
            <CardTitle>Labor</CardTitle>
            <CardDescription>Calculate labor costs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hoursWorked">Hours Worked</Label>
                <Input
                  id="hoursWorked"
                  type="number"
                  min="0"
                  step="0.5"
                  value={hoursWorked || ''}
                  onChange={(e) => setHoursWorked(Number(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={hourlyRate || ''}
                  onChange={(e) => setHourlyRate(Number(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="font-semibold">Labor Subtotal:</span>
              <span className="text-lg font-bold">{formatCurrency(laborSubtotal)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Grand Total */}
        <Card className="border-primary">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">Grand Total:</span>
              <span className="text-3xl font-bold text-primary">{formatCurrency(grandTotal)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
