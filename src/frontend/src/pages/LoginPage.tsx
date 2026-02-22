import LoginButton from '../components/auth/LoginButton';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div
        className="relative flex-1 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x1080.png)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 to-primary/95" />
        
        <div className="relative z-10 text-center space-y-8 px-4 max-w-3xl">
          <div className="flex justify-center">
            <img
              src="/assets/logo-1.jpg"
              alt="Phoenix Shield Mold Removal"
              className="h-40 w-40 object-contain drop-shadow-2xl rounded-full"
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary-foreground">
              Phoenix Shield Mold Removal
            </h1>
            <p className="text-xl md:text-2xl text-accent font-semibold">
              Professional Mold Remediation Services
            </p>
            <p className="text-primary-foreground/90 max-w-2xl mx-auto text-lg">
              Don't let mold take over your home. Manage your customers, schedule appointments, 
              track jobs, and grow your mold removal business—all in one powerful platform.
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
