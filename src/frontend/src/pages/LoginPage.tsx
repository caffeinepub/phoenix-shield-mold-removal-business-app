import LoginButton from '../components/auth/LoginButton';
import { Shield } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div
        className="relative flex-1 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/generated/hero-background.dim_1920x600.png)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/95" />
        
        <div className="relative z-10 text-center space-y-8 px-4 max-w-2xl">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-12 w-12 text-primary" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Phoenix Shield
            </h1>
            <p className="text-xl text-muted-foreground">
              Mold Removal Business Management
            </p>
            <p className="text-muted-foreground max-w-md mx-auto">
              Manage your customers, schedule appointments, and track jobs all in one place.
            </p>
          </div>

          <div className="pt-4">
            <LoginButton />
          </div>
        </div>
      </div>
    </div>
  );
}
