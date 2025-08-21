'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Building,
  CreditCard,
  TrendingUp,
  Building as BuildingIcon,
  Settings,
  LogOut,
  UserPlus,
  FileText,
  BarChart3,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState('overview');
  const [sidebarExpanded, setSidebarExpanded] = React.useState(false);

  // Dados mockados para demonstração
  const dashboardData = {
    totalUsers: 156,
    totalClients: 2847,
    totalOperations: 15420,
    approvalRate: 94.2,
    monthlyGrowth: 12.5,
    revenue: 2847500,
    pendingApprovals: 23,
    recentActivities: [
      {
        type: 'user',
        action: 'Novo usuário cadastrado',
        time: '2 min atrás',
        status: 'success',
      },
      {
        type: 'client',
        action: 'Cliente PJ aprovado',
        time: '15 min atrás',
        status: 'success',
      },
      {
        type: 'operation',
        action: 'Operação de crédito finalizada',
        time: '1 hora atrás',
        status: 'success',
      },
      {
        type: 'system',
        action: 'Backup automático realizado',
        time: '2 horas atrás',
        status: 'info',
      },
    ],
  };

  const quickActions = [
    {
      title: 'Novo Usuário',
      icon: UserPlus,
      action: () => router.push('/usuarios/cadastro-pf'),
      color: 'from-holding-blue-medium to-holding-blue-light',
    },
    {
      title: 'Novo Cliente PF',
      icon: Users,
      action: () => router.push('/clientes/cadastro-pf'),
      color: 'from-holding-blue-medium to-holding-blue-light',
    },
    {
      title: 'Novo Cliente PJ',
      icon: Building,
      action: () => router.push('/clientes/cadastro-pj'),
      color: 'from-holding-blue-medium to-holding-blue-light',
    },
    {
      title: 'Relatórios',
      icon: FileText,
      action: () => router.push('/clientes'),
      color: 'from-holding-blue-medium to-holding-blue-light',
    },
  ];

  const metrics = [
    {
      title: 'Usuários Ativos',
      value: dashboardData.totalUsers,
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'from-holding-blue-medium/20 to-holding-blue-light/20',
      bgColor: 'from-holding-blue-medium/20 to-holding-blue-light/20',
    },
    {
      title: 'Clientes Cadastrados',
      value: dashboardData.totalClients,
      change: '+8%',
      trend: 'up',
      icon: Building,
      color: 'from-holding-blue-light/20 to-holding-blue-medium/20',
      bgColor: 'from-holding-blue-light/20 to-holding-blue-medium/20',
    },
    {
      title: 'Operações Realizadas',
      value: dashboardData.totalOperations,
      change: '+15%',
      trend: 'up',
      icon: CreditCard,
      color: 'from-holding-blue-dark/20 to-holding-blue-deep/20',
      bgColor: 'from-holding-blue-dark/20 to-holding-blue-deep/20',
    },
    {
      title: 'Taxa de Aprovação',
      value: `${dashboardData.approvalRate}%`,
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-holding-blue-deep/20 to-holding-blue-profound/20',
      bgColor: 'from-holding-blue-deep/20 to-holding-blue-profound/20',
    },
  ];

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <div className="min-h-screen holding-layout">
      {/* Sidebar Recolhível */}
      <div
        className={`holding-sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`}
      >
        <nav className="flex flex-col items-center py-8 space-y-6">
          {/* Botão Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="w-12 h-12 p-0 text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20 rounded-lg mb-8"
            onClick={toggleSidebar}
            title={sidebarExpanded ? 'Recolher Menu' : 'Expandir Menu'}
          >
            {sidebarExpanded ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </Button>

          {/* Logo */}
          <div className="w-12 h-12 bg-gradient-to-br from-holding-blue-medium to-holding-blue-light rounded-xl flex items-center justify-center mb-8">
            <Shield className="w-6 h-6 text-holding-white" />
          </div>

          {/* Navegação Principal */}
          <Button
            variant="ghost"
            size="sm"
            className={`${
              sidebarExpanded
                ? 'w-full justify-start px-4'
                : 'w-12 justify-center'
            } h-12 p-0 text-holding-white hover:text-holding-white hover:bg-holding-blue-light/20 rounded-lg bg-holding-blue-light/20`}
            onClick={() => router.push('/dashboard')}
            title="Dashboard"
          >
            <BarChart3 className="w-5 h-5" />
            {sidebarExpanded && (
              <span className="ml-3 text-sm font-medium">Dashboard</span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`${
              sidebarExpanded
                ? 'w-full justify-start px-4'
                : 'w-12 justify-center'
            } h-12 p-0 text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20 rounded-lg`}
            onClick={() => router.push('/usuarios')}
            title="Usuários"
          >
            <Users className="w-5 h-5" />
            {sidebarExpanded && (
              <span className="ml-3 text-sm font-medium">Usuários</span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`${
              sidebarExpanded
                ? 'w-full justify-start px-4'
                : 'w-12 justify-center'
            } h-12 p-0 text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20 rounded-lg`}
            onClick={() => router.push('/clientes')}
            title="Clientes"
          >
            <Building className="w-5 h-5" />
            {sidebarExpanded && (
              <span className="ml-3 text-sm font-medium">Clientes</span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`${
              sidebarExpanded
                ? 'w-full justify-start px-4'
                : 'w-12 justify-center'
            } h-12 p-0 text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20 rounded-lg`}
            onClick={() => router.push('/settings')}
            title="Configurações"
          >
            <Settings className="w-5 h-5" />
            {sidebarExpanded && (
              <span className="ml-3 text-sm font-medium">Configurações</span>
            )}
          </Button>

          {/* Logout */}
          <div
            className={`pt-8 border-t border-holding-blue-light/30 ${
              sidebarExpanded ? 'w-full' : 'w-8'
            }`}
          >
            <Button
              variant="ghost"
              size="sm"
              className={`${
                sidebarExpanded
                  ? 'w-full justify-start px-4'
                  : 'w-12 justify-center'
              } h-12 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg`}
              onClick={() => {
                console.log('Logout solicitado');
                if (confirm('Tem certeza que deseja sair do sistema?')) {
                  localStorage.removeItem('holding_user');
                  window.location.href = '/login';
                }
              }}
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
              {sidebarExpanded && (
                <span className="ml-3 text-sm font-medium">Sair</span>
              )}
            </Button>
          </div>
        </nav>
      </div>

      {/* Conteúdo Principal */}
      <div
        className={`transition-all duration-300 ${sidebarExpanded ? 'pl-80' : 'pl-24'} p-8 space-y-8`}
      >
        {/* Header */}
        <div className="holding-fade-in">
          <h1 className="text-4xl font-bold text-holding-white mb-2">
            Dashboard
          </h1>
          <p className="text-xl text-holding-blue-light">
            Visão geral do sistema e métricas principais
          </p>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="holding-stat-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${metric.bgColor} rounded-xl flex items-center justify-center`}
                  >
                    <metric.icon className="w-6 h-6 text-holding-blue-light" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-holding-white">
                      {metric.value}
                    </p>
                    <p className="text-holding-blue-light text-sm">
                      {metric.title}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end">
                  <span className="text-green-400 text-sm font-medium">
                    {metric.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ações Rápidas */}
        <Card className="holding-card">
          <CardHeader>
            <CardTitle className="text-holding-white flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-holding-blue-light" />
              <span>Ações Rápidas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  onClick={action.action}
                  className={`h-24 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br ${action.color} hover:scale-105 transition-all duration-200`}
                >
                  <action.icon className="w-8 h-8 text-holding-white" />
                  <span className="text-holding-white font-semibold text-center">
                    {action.title}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Atividades Recentes */}
        <Card className="holding-card">
          <CardHeader>
            <CardTitle className="text-holding-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-holding-blue-light" />
              <span>Atividades Recentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-holding-blue-light/5 rounded-lg border border-holding-blue-light/10"
                >
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-holding-white font-medium">
                      {activity.action}
                    </p>
                    <p className="text-holding-blue-light text-sm">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
