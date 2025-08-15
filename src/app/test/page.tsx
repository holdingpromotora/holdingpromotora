'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';

export default function TestPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  return (
    <div className="min-h-screen holding-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl glass-effect border-holding-highlight/30">
        <CardHeader>
          <CardTitle className="text-2xl text-holding-white">
            Página de Teste
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-holding-accent/10 border border-holding-accent/30 rounded-lg p-4">
            <h3 className="text-holding-highlight font-medium mb-2">
              Status da Autenticação:
            </h3>
            <div className="space-y-2 text-holding-white">
              <p>
                <strong>Carregando:</strong> {isLoading ? 'Sim' : 'Não'}
              </p>
              <p>
                <strong>Autenticado:</strong> {isAuthenticated ? 'Sim' : 'Não'}
              </p>
              <p>
                <strong>Usuário:</strong>{' '}
                {user ? JSON.stringify(user, null, 2) : 'Nenhum'}
              </p>
            </div>
          </div>

          {isAuthenticated && (
            <div className="bg-holding-highlight/10 border border-holding-highlight/30 rounded-lg p-4">
              <h3 className="text-holding-highlight font-medium mb-2">
                Informações do Usuário:
              </h3>
              <div className="space-y-2 text-holding-white">
                <p>
                  <strong>ID:</strong> {user?.id}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p>
                  <strong>Nome:</strong> {user?.nome}
                </p>
                <p>
                  <strong>Perfil:</strong> {user?.perfil_nome || 'Não definido'}
                </p>
                <p>
                  <strong>Status:</strong> {user?.status || 'Não definido'}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => (window.location.href = '/login')}
              className="button-primary"
            >
              Ir para Login
            </Button>

            <Button
              onClick={() => (window.location.href = '/dashboard')}
              className="button-primary"
            >
              Ir para Dashboard
            </Button>

            {isAuthenticated && (
              <Button onClick={logout} className="bg-red-600 hover:bg-red-700">
                Logout
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
