'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, User, Shield, LogOut, RefreshCw } from 'lucide-react';

export default function AguardandoAprovacaoPage() {
  const { user, hasApprovedProfile, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se o usuário já tem perfil aprovado, redirecionar para dashboard
    if (hasApprovedProfile) {
      router.push('/dashboard');
    }
  }, [hasApprovedProfile, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen holding-gradient flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <Card className="bg-white border-gray-200 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Aguardando Aprovação
            </CardTitle>
            <p className="text-gray-600 text-lg">
              Seu cadastro está sendo analisado pelo administrador
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Informações do Usuário */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user.nome}
                  </h3>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Status</p>
                  <p className="text-lg font-bold text-yellow-600 capitalize">
                    {user.status || 'pendente'}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-4 h-4 text-gray-600" />
                  </div>
                  <p className="text-sm text-gray-600 font-medium">Perfil</p>
                  <p className="text-lg font-bold text-gray-900">
                    {user.perfil_nome || 'Sem perfil'}
                  </p>
                </div>
              </div>
            </div>

            {/* Mensagem de Aprovação */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Shield className="w-3 h-3 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">
                    O que acontece agora?
                  </h4>
                  <ul className="text-blue-800 space-y-2 text-sm">
                    <li>• Seu cadastro foi enviado para análise</li>
                    <li>• Um administrador irá revisar suas informações</li>
                    <li>• Você receberá uma notificação quando for aprovado</li>
                    <li>• Após aprovação, você terá acesso ao sistema</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Verificar Status
              </Button>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>

            {/* Contato */}
            <div className="text-center text-sm text-gray-500">
              <p>
                Em caso de dúvidas, entre em contato com o administrador do sistema
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
