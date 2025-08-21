'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { User, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const isAuthenticated = !!user;
  const hasApprovedProfile = !!(
    user?.aprovado &&
    user?.ativo &&
    user?.perfil_id
  );

  // Carregar dados do localStorage apenas no lado do cliente
  useEffect(() => {
    // Usar uma função para evitar problemas de hidratação
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem('holding_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error);
        localStorage.removeItem('holding_user');
      } finally {
        setIsInitialized(true);
      }
    };

    // Aguardar o próximo tick para garantir que estamos no cliente
    const timer = setTimeout(initializeAuth, 0);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      // Chamar API de autenticação real
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success && result.user) {
        const userData: User = {
          id: result.user.id,
          email: result.user.email,
          nome: result.user.nome,
          perfil_id: result.user.perfil_id,
          perfil_nome: result.user.perfil_nome,
          nivel_acesso: result.user.nivel_acesso,
          aprovado: result.user.aprovado,
          ativo: result.user.ativo,
          status: result.user.status,
          permissoes: result.user.permissoes,
        };

        setUser(userData);

        // Usar try-catch para evitar erros de SSR
        try {
          localStorage.setItem('holding_user', JSON.stringify(userData));
        } catch (error) {
          console.warn('localStorage não disponível:', error);
        }

        return { success: true, user: userData };
      }

      return { success: false, error: result.error || 'Credenciais inválidas' };
    } catch (error) {
      console.error('Erro durante login:', error);
      return { success: false, error: 'Erro interno do servidor' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('holding_user');
    } catch (error) {
      console.warn('localStorage não disponível:', error);
    }
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      hasApprovedProfile,
      isLoading,
      isInitialized,
      login,
      logout,
    }),
    [user, isAuthenticated, hasApprovedProfile, isLoading, isInitialized]
  );

  // Renderizar um estado de carregamento consistente
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-holding-blue-profound via-holding-blue-deep to-holding-blue-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-holding-highlight border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <div className="w-32 h-2 bg-gradient-to-r from-holding-highlight to-holding-highlight-light rounded-full mx-auto mb-4 animate-pulse"></div>
          <p className="text-holding-blue-light text-xl font-medium">
            Inicializando sistema...
          </p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
