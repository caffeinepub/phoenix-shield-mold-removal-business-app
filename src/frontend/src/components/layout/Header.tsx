import { Link, useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import LoginButton from '../auth/LoginButton';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Users, Calendar, Briefcase, BarChart3, Share2, Calculator, FileText, Bell } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { data: userProfile } = useGetCallerUserProfile();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: 'Customers', path: '/customers', icon: Users },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    { label: 'Jobs', path: '/jobs', icon: Briefcase },
    { label: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { label: 'Social Media', path: '/social-media', icon: Share2 },
    { label: 'Estimates', path: '/estimates', icon: Calculator },
    { label: 'Saved Estimates', path: '/saved-estimates', icon: FileText },
    { label: 'Follow-Ups', path: '/follow-ups', icon: Bell },
  ];

  const handleNavClick = (path: string) => {
    navigate({ to: path });
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/assets/generated/shield-logo.dim_128x128.png"
              alt="Phoenix Shield"
              className="h-10 w-10"
            />
            <span className="hidden font-semibold text-lg sm:inline-block">Phoenix Shield</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => handleNavClick(item.path)}
                className="gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {userProfile && (
            <span className="hidden sm:inline-block text-sm text-muted-foreground">
              {userProfile.name}
            </span>
          )}
          <LoginButton />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    variant="ghost"
                    onClick={() => handleNavClick(item.path)}
                    className="justify-start gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
