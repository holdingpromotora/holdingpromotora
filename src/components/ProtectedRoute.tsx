'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredLevel?: string;
  requiredPermissions?: string[];
}

export function ProtectedRoute({
  children,
  requiredLevel = 'visualizador',
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, hasApprovedProfile, isLoading, user } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isLoading && isClient) {
      // PROTEÇÃO CRÍTICA: Não redirecionar usuário master durante operações
      if (user?.id === 0) {
        console.log('🔒 Usuário master detectado, protegendo contra redirecionamento automático');
        return;
      }
      
      if (!isAuthenticated) {
        console.log('❌ Usuário não autenticado, redirecionando para login...');
        router.replace('/login');
      } else if (!hasApprovedProfile) {
        console.log(
          '⚠️ Usuário sem perfil aprovado, redirecionando para página de aprovação...'
        );
        router.replace('/aguardando-aprovacao');
      }
    }
  }, [isAuthenticated, hasApprovedProfile, isLoading, router, isClient, user]);

  if (isLoading || !isClient) {
    return (
      <div className="min-h-screen holding-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-holding-highlight border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-holding-white text-xl">Carregando...</div>
        </div>
      </div>
    );
  }

  // PROTEÇÃO CRÍTICA: Usuário master sempre tem acesso, mesmo se isAuthenticated for false temporariamente
  if (user?.id === 0) {
    console.log('🔒 Usuário master detectado, permitindo acesso total');
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!hasApprovedProfile) {
    return null;
  }

  // Verificar nível de acesso
  const userLevel = user?.perfil_nome?.toLowerCase() || '';
  const levelHierarchy = {
    master: 5,
    admin: 4,
    gerente: 3,
    supervisor: 2,
    operador: 1,
    visualizador: 0,
    convidado: 0,
  };

  const userLevelValue =
    levelHierarchy[userLevel as keyof typeof levelHierarchy] || 0;
  const requiredLevelValue =
    levelHierarchy[requiredLevel as keyof typeof levelHierarchy] || 0;

  if (userLevelValue < requiredLevelValue) {
    console.log(
      `❌ Nível de acesso insuficiente. Usuário: ${userLevel}, Requerido: ${requiredLevel}`
    );
    return (
      <div className="min-h-screen holding-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-holding-white mb-2">
            Acesso Negado
          </h3>
          <p className="text-holding-accent-light">
            Você não tem permissão para acessar esta página.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
