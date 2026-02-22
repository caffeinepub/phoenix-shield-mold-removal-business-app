import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Edit, Trash2, Copy, FileText, FileDown, Loader2 } from 'lucide-react';
import { useGetAllEstimates, useDeleteEstimate } from '../hooks/useQueries';
import { copyEstimateToClipboard } from '../utils/copyEstimate';
import { generateEstimatePDF } from '../utils/generateEstimatePDF';
import { toast } from 'sonner';
import type { Estimate } from '../backend';

export default function SavedEstimatesPage() {
  const navigate = useNavigate();
  const { data: estimates = [], isLoading } = useGetAllEstimates();
  const deleteEstimate = useDeleteEstimate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [estimateToDelete, setEstimateToDelete] = useState<bigint | null>(null);
  const [generatingPDFId, setGeneratingPDFId] = useState<bigint | null>(null);

  const handleEdit = (estimateId: bigint) => {
    navigate({ to: '/estimates', search: { estimateId: estimateId.toString() } });
  };

  const handleDeleteClick = (estimateId: bigint) => {
    setEstimateToDelete(estimateId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!estimateToDelete) return;

    try {
      await deleteEstimate.mutateAsync(estimateToDelete);
      toast.success('Estimate deleted successfully');
      setDeleteDialogOpen(false);
      setEstimateToDelete(null);
    } catch (error) {
      console.error('Error deleting estimate:', error);
      toast.error('Failed to delete estimate');
    }
  };

  const handleCopy = async (estimate: Estimate) => {
    try {
      await copyEstimateToClipboard(estimate);
      toast.success('Estimate copied to clipboard');
    } catch (error) {
      console.error('Error copying estimate:', error);
      toast.error('Failed to copy estimate');
    }
  };

  const handleDownloadPDF = async (estimate: Estimate) => {
    try {
      setGeneratingPDFId(estimate.estimateId);
      await generateEstimatePDF({ estimate });
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    } finally {
      setGeneratingPDFId(null);
    }
  };

  const formatCurrency = (value: bigint) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(Number(value) / 100);
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <div className="h-10 w-64 bg-muted animate-pulse rounded mb-2" />
          <div className="h-6 w-96 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Saved Estimates</h1>
        <p className="text-muted-foreground">
          View, edit, and manage all your saved estimates
        </p>
      </div>

      {estimates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No saved estimates yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Create your first estimate using the calculator
            </p>
            <Button onClick={() => navigate({ to: '/estimates' })}>
              Go to Estimate Calculator
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {estimates.map((estimate) => (
            <Card key={estimate.estimateId.toString()} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">
                  Estimate #{estimate.estimateId.toString()}
                </CardTitle>
                <CardDescription>{formatDate(estimate.creationDate)}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Square Footage:</span>
                    <span className="font-medium">{estimate.squareFootage.toString()} sq ft</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Materials:</span>
                    <span className="font-medium">{formatCurrency(estimate.totalMaterialCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Labor:</span>
                    <span className="font-medium">{formatCurrency(estimate.totalLaborCost)}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold text-primary text-lg">
                        {formatCurrency(estimate.totalEstimate)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(estimate.estimateId)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadPDF(estimate)}
                    disabled={generatingPDFId === estimate.estimateId}
                  >
                    {generatingPDFId === estimate.estimateId ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileDown className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(estimate)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(estimate.estimateId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Estimate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this estimate? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
