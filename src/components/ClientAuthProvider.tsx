'use client';

import { AuthProvider } from '@/contexts/AuthContext';

interface ClientAuthProviderProps {
  children: React.ReactNode;
}

export default function ClientAuthProvider({
  children,
}: ClientAuthProviderProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
