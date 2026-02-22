import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetAllCustomers, useCreateCustomer } from '../hooks/useQueries';
import CustomerCard from '../components/customers/CustomerCard';
import CustomerForm from '../components/customers/CustomerForm';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomersPage() {
  const navigate = useNavigate();
  const { data: customers, isLoading } = useGetAllCustomers();
  const createCustomer = useCreateCustomer();
  const [showForm, setShowForm] = useState(false);

  const handleCreateCustomer = async (data: {
    name: string;
    phoneNumber: string;
    emailAddress: string;
    physicalAddress: string;
  }) => {
    try {
      await createCustomer.mutateAsync(data);
      toast.success('Customer added successfully!');
      setShowForm(false);
    } catch (error) {
      console.error('Error creating customer:', error);
      toast.error('Failed to add customer. Please try again.');
    }
  };

  const handleCustomerClick = (customerId: bigint) => {
    navigate({ to: '/customers/$customerId', params: { customerId: customerId.toString() } });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-muted animate-pulse rounded" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground mt-1">
            Manage your customer database and view job history
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {!customers || customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <Users className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No customers yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Get started by adding your first customer to track their information and job history.
          </p>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Customer
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {customers.map((customer) => (
            <CustomerCard
              key={customer.customerId.toString()}
              customer={customer}
              onClick={() => handleCustomerClick(customer.customerId)}
            />
          ))}
        </div>
      )}

      <CustomerForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={handleCreateCustomer}
        isLoading={createCustomer.isPending}
      />
    </div>
  );
}
