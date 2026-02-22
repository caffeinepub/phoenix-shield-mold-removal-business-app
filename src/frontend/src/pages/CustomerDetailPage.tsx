import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetCustomer, useGetAllEstimates } from '../hooks/useQueries';
import JobHistoryTimeline from '../components/jobs/JobHistoryTimeline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail, Phone, MapPin, Copy, FileText, FileDown, Loader2 } from 'lucide-react';
import { copyEstimateToClipboard } from '../utils/copyEstimate';
import { generateEstimatePDF } from '../utils/generateEstimatePDF';
import { toast } from 'sonner';
import type { Estimate } from '../backend';

export default function CustomerDetailPage() {
  const { customerId } = useParams({ from: '/customers/$customerId' });
  const navigate = useNavigate();
  const { data: customer, isLoading } = useGetCustomer(BigInt(customerId));
  const { data: estimates = [] } = useGetAllEstimates();
  const [generatingPDFId, setGeneratingPDFId] = useState<bigint | null>(null);

  const handleCopyEstimate = async (estimate: Estimate) => {
    try {
      await copyEstimateToClipboard(estimate);
      toast.success('Estimate copied to clipboard');
    } catch (error) {
      console.error('Error copying estimate:', error);
      toast.error('Failed to copy estimate');
    }
  };

  const handleDownloadPDF = async (estimate: Estimate) => {
    if (!customer) return;
    
    try {
      setGeneratingPDFId(estimate.estimateId);
      await generateEstimatePDF({ estimate, customer });
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
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold mb-2">Customer not found</h2>
        <p className="text-muted-foreground mb-6">
          The customer you're looking for doesn't exist.
        </p>
        <Button onClick={() => navigate({ to: '/customers' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/customers' })}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Customers
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{customer.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">{customer.phoneNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{customer.emailAddress}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Address</p>
              <p className="text-sm text-muted-foreground">{customer.physicalAddress}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">Job History</h2>
        <JobHistoryTimeline customerId={customer.customerId} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Estimates</h2>
        {estimates.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-center">
                No estimates available yet. Create estimates from the Estimates page.
              </p>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Note: Estimates are currently standalone and can be associated with customers in future versions.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              All saved estimates (future versions will allow customer-specific estimates)
            </p>
            {estimates.map((estimate) => (
              <Card key={estimate.estimateId.toString()}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">
                        Estimate #{estimate.estimateId.toString()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(estimate.creationDate)}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{estimate.squareFootage.toString()} sq ft</span>
                      <span>•</span>
                      <span className="font-semibold text-primary">
                        {formatCurrency(estimate.totalEstimate)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadPDF(estimate)}
                      disabled={generatingPDFId === estimate.estimateId}
                    >
                      {generatingPDFId === estimate.estimateId ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FileDown className="h-4 w-4 mr-2" />
                          PDF
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyEstimate(estimate)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
