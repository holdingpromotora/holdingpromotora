'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, hasApprovedProfile, isLoading } = useAuth();
  const [redirecting, setRedirecting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isLoading && isClient) {
      if (isAuthenticated) {
        if (hasApprovedProfile) {
          console.log(
            '✅ Usuário autenticado com perfil aprovado, redirecionando para dashboard...'
          );
          setRedirecting(true);
          router.replace('/dashboard');
        } else {
          console.log(
            '⚠️ Usuário autenticado sem perfil aprovado, redirecionando para página de aprovação...'
          );
          setRedirecting(true);
          router.replace('/aguardando-aprovacao');
        }
      } else {
        console.log('❌ Usuário não autenticado, redirecionando para login...');
        setRedirecting(true);
        router.replace('/login');
      }
    }
  }, [isAuthenticated, hasApprovedProfile, isLoading, router, isClient]);

  if (isLoading || redirecting || !isClient) {
    return (
      <div className="min-h-screen holding-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-holding-highlight border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-holding-white text-xl">
            {isLoading ? 'Verificando autenticação...' : 'Redirecionando...'}
          </p>
        </div>
      </div>
    );
  }

  return null;
}
