import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, ChevronRight } from 'lucide-react';
import type { Customer } from '../../backend';

interface CustomerCardProps {
  customer: Customer;
  onClick: () => void;
}

export default function CustomerCard({ customer, onClick }: CustomerCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <h3 className="font-semibold text-lg">{customer.name}</h3>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>{customer.phoneNumber}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{customer.emailAddress}</span>
              </div>
              
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2">{customer.physicalAddress}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs text-muted-foreground">
                {customer.jobHistory.length} {customer.jobHistory.length === 1 ? 'job' : 'jobs'} completed
              </span>
            </div>
          </div>

          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
