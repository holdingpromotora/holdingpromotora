'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Building,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Calculator,
  FileText,
  FileSpreadsheet,
  UserPlus,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GerenciarUsuariosPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    console.log('🔄 Toggle sidebar chamado, estado atual:', sidebarExpanded);
    setSidebarExpanded(!sidebarExpanded);
    console.log('🔄 Novo estado:', !sidebarExpanded);
  };

  return (
    <div className="min-h-screen holding-layout">
      {/* Indicador de Debug */}
      <div className="fixed top-4 right-4 bg-red-500 text-white p-2 rounded z-50">
        Sidebar: {sidebarExpanded ? 'Expandido' : 'Recolhido'}
      </div>

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
            className="w-12 h-12 p-0 text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20 rounded-lg"
            onClick={() => router.push('/dashboard')}
            title="Dashboard"
          >
            <BarChart3 className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-12 h-12 p-0 text-holding-white hover:text-holding-white hover:bg-holding-blue-light/20 rounded-lg bg-holding-blue-light/20"
            onClick={() => router.push('/usuarios')}
            title="Usuários"
          >
            <Users className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-12 h-12 p-0 text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20 rounded-lg"
            onClick={() => router.push('/clientes')}
            title="Clientes"
          >
            <Building className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-12 h-12 p-0 text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20 rounded-lg"
            onClick={() => router.push('/settings')}
            title="Configurações"
          >
            <Settings className="w-5 h-5" />
          </Button>

          {/* Logout */}
          <div className="pt-8 border-t border-holding-blue-light/30 w-8">
            <Button
              variant="ghost"
              size="sm"
              className="w-12 h-12 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg"
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
            </Button>
          </div>
        </nav>
      </div>

      {/* Conteúdo Principal */}
      <div
        className={`transition-all duration-300 ${sidebarExpanded ? 'pl-64' : 'pl-16'} p-6`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Cabeçalho */}
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold mb-4">🎯 Menu Dashboard Teste</h1>
            <p className="text-xl">
              Se você está vendo isso, a página está funcionando!
            </p>
          </div>

          {/* Botão de Teste */}
          <div className="text-center">
            <button
              onClick={toggleSidebar}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl text-lg"
            >
              {sidebarExpanded ? 'Recolher Menu' : 'Expandir Menu'}
            </button>
          </div>

          {/* Status */}
          <div className="mt-8 text-center">
            <p className="text-lg">
              Estado atual:{' '}
              <span className="font-bold">
                {sidebarExpanded ? 'EXPANDIDO' : 'RECOLHIDO'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
