'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  Shield,
  Key,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen holding-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-holding-highlight border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-holding-white text-xl">Carregando...</div>
        </div>
      </div>
    );
  }

  const estatisticas = [
    {
      titulo: 'Usuários Ativos',
      valor: '156',
      icone: Users,
      cor: 'from-blue-500 to-blue-600',
      descricao: '+12% este mês',
    },
    {
      titulo: 'Níveis de Acesso',
      valor: '6',
      icone: Key,
      cor: 'from-purple-500 to-purple-600',
      descricao: 'Configurados',
    },
    {
      titulo: 'Usuários Pendentes',
      valor: '3',
      icone: Clock,
      cor: 'from-yellow-500 to-yellow-600',
      descricao: 'Aguardando aprovação',
    },
  ];

  const atividades = [
    {
      id: 1,
      acao: 'Novo usuário cadastrado',
      usuario: 'Carlos Ferreira',
      horario: '2 horas atrás',
      status: 'pendente',
    },
    {
      id: 2,
      acao: 'Perfil atualizado',
      usuario: 'Maria Santos',
      horario: '4 horas atrás',
      status: 'concluido',
    },
    {
      id: 3,
      acao: 'Usuário aprovado',
      usuario: 'Pedro Costa',
      horario: '1 dia atrás',
      status: 'concluido',
    },
    {
      id: 4,
      acao: 'Novo perfil criado',
      usuario: 'Sistema',
      horario: '2 dias atrás',
      status: 'concluido',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'concluido':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'concluido':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <ProtectedRoute requiredLevel="visualizador">
      <Layout>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Cabeçalho */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-holding-white mb-3">
                Dashboard
              </h1>
              <p className="text-holding-accent-light text-lg">
                Bem-vindo, {user?.nome}! Aqui está o resumo do sistema.
              </p>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {estatisticas.map((stat, index) => {
                const IconComponent = stat.icone;
                return (
                  <Card
                    key={index}
                    className="bg-white border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-2xl"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm font-medium mb-1">
                            {stat.titulo}
                          </p>
                          <p className="text-3xl font-bold text-gray-900">
                            {stat.valor}
                          </p>
                          <p className="text-gray-500 text-sm mt-1">
                            {stat.descricao}
                          </p>
                        </div>
                        <div
                          className={`w-14 h-14 bg-gradient-to-br ${stat.cor} rounded-2xl flex items-center justify-center shadow-lg`}
                        >
                          <IconComponent className="w-7 h-7 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Atividades Recentes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <span>Atividades Recentes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {atividades.map(atividade => (
                      <div
                        key={atividade.id}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200">
                          {getStatusIcon(atividade.status)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {atividade.acao}
                          </p>
                          <p className="text-xs text-gray-600">
                            {atividade.usuario} • {atividade.horario}
                          </p>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(atividade.status)}`}
                        >
                          {atividade.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Resumo do Sistema */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span>Resumo do Sistema</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-800 font-medium">
                          Sistema Operacional
                        </span>
                      </div>
                      <span className="text-green-600 text-sm font-medium">
                        100%
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span className="text-blue-800 font-medium">
                          Usuários Ativos
                        </span>
                      </div>
                      <span className="text-blue-600 text-sm font-medium">
                        153/156
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-purple-600" />
                        <span className="text-purple-800 font-medium">
                          Perfis Configurados
                        </span>
                      </div>
                      <span className="text-purple-600 text-sm font-medium">
                        8/8
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-yellow-600" />
                        <span className="text-yellow-800 font-medium">
                          Pendentes
                        </span>
                      </div>
                      <span className="text-yellow-600 text-sm font-medium">
                        3
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
