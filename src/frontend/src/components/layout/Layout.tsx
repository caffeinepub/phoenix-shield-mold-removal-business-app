import { ReactNode } from 'react';
import Header from './Header';
import { SiCaffeine } from 'react-icons/si';
import { Heart } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'phoenix-shield'
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-6">{children}</main>
      <footer className="border-t py-6 mt-auto">
        <div className="container text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            Built with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline font-medium"
            >
              <SiCaffeine className="h-4 w-4" />
              caffeine.ai
            </a>
          </p>
          <p className="mt-2">© {new Date().getFullYear()} Phoenix Shield Mold Removal</p>
        </div>
      </footer>
    </div>
  );
}
