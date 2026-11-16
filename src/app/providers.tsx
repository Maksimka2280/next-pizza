'use client';

import { SessionProvider } from 'next-auth/react';
import { SitePreferencesProvider } from '../../shared/components/shared/SitePreferencesProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SitePreferencesProvider>
      <SessionProvider>{children}</SessionProvider>
    </SitePreferencesProvider>
  );
}