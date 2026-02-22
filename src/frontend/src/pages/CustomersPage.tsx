import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetAllCustomers, useCreateCustomer } from '../hooks/useQueries';
import CustomerCard from '../components/customers/CustomerCard';
import CustomerForm from '../components/customers/CustomerForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Users, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomersPage() {
  const navigate = useNavigate();
  const { data: customers, isLoading } = useGetAllCustomers();
  const createCustomer = useCreateCustomer();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateCustomer = async (data: {
    name: string;
    phoneNumber: string;
    emailAddress: string;
    physicalAddress: string;
  }) => {
    try {
      const customerId = await createCustomer.mutateAsync(data);
      console.log('Customer created successfully with ID:', customerId);
      toast.success('Customer added successfully!');
      setShowForm(false);
    } catch (error: any) {
      console.error('Error creating customer:', error);
      const errorMessage = error?.message || 'Failed to add customer. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleCustomerClick = (customerId: bigint) => {
    navigate({ to: '/customers/$customerId', params: { customerId: customerId.toString() } });
  };

  // Filter customers based on search query
  const filteredCustomers = useMemo(() => {
    if (!customers || !searchQuery.trim()) return customers || [];
    
    const query = searchQuery.toLowerCase();
    return customers.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(query) ||
        customer.phoneNumber.toLowerCase().includes(query) ||
        customer.emailAddress.toLowerCase().includes(query) ||
        customer.physicalAddress.toLowerCase().includes(query)
      );
    });
  }, [customers, searchQuery]);

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
        <>
          {/* Search Input */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, phone, email, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Customer Grid */}
          {filteredCustomers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">No customers found</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                No customers match your search criteria. Try a different search term.
              </p>
              <Button onClick={() => setSearchQuery('')} variant="outline">
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCustomers.map((customer) => (
                <CustomerCard
                  key={customer.customerId.toString()}
                  customer={customer}
                  onClick={() => handleCustomerClick(customer.customerId)}
                />
              ))}
            </div>
          )}
        </>
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
