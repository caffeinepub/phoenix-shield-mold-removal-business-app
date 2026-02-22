import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetAllCustomers, useCreateJob } from '../../hooks/useQueries';
import { JobStatus } from '../../backend';
import { toast } from 'sonner';

interface JobFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function JobForm({ open, onOpenChange, onSuccess }: JobFormProps) {
  const { data: customers } = useGetAllCustomers();
  const createJobMutation = useCreateJob();

  const [formData, setFormData] = useState({
    customerId: '',
    serviceDate: '',
    serviceType: '',
    issuesFound: '',
    status: JobStatus.scheduled,
  });

  useEffect(() => {
    if (!open) {
      setFormData({
        customerId: '',
        serviceDate: '',
        serviceType: '',
        issuesFound: '',
        status: JobStatus.scheduled,
      });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const serviceDateTime = new Date(formData.serviceDate);
      const serviceDateBigInt = BigInt(serviceDateTime.getTime() * 1000000);

      await createJobMutation.mutateAsync({
        customerId: BigInt(formData.customerId),
        serviceDate: serviceDateBigInt,
        serviceType: formData.serviceType,
        issuesFound: formData.issuesFound,
      });

      toast.success('Job created successfully!');
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to create job. Please try again.');
    }
  };

  const isLoading = createJobMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer *</Label>
            <Select
              value={formData.customerId}
              onValueChange={(value) => setFormData({ ...formData, customerId: value })}
              disabled={isLoading}
              required
            >
              <SelectTrigger id="customer">
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers?.map((customer) => (
                  <SelectItem key={customer.customerId.toString()} value={customer.customerId.toString()}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceDate">Scheduled Date *</Label>
            <Input
              id="serviceDate"
              type="datetime-local"
              value={formData.serviceDate}
              onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceType">Service Type *</Label>
            <Input
              id="serviceType"
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              placeholder="e.g., Mold Inspection, Remediation, Prevention"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issuesFound">Description / Issues Found *</Label>
            <Textarea
              id="issuesFound"
              value={formData.issuesFound}
              onChange={(e) => setFormData({ ...formData, issuesFound: e.target.value })}
              placeholder="Describe the job details or issues found..."
              required
              disabled={isLoading}
              rows={4}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating...
                </>
              ) : (
                'Create Job'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
