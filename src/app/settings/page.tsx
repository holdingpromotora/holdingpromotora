'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Settings,
  Shield,
  Users,
  Building,
  Bell,
  Palette,
  Save,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  LogOut,
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

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
            className="w-12 h-12 p-0 text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20 rounded-lg"
            onClick={() => router.push('/dashboard')}
            title="Dashboard"
          >
            <BarChart3 className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-12 h-12 p-0 text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20 rounded-lg"
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
        className={`transition-all duration-300 ${sidebarExpanded ? 'pl-64' : 'pl-16'} p-6 space-y-6`}
      >
        {/* Header */}
        <div className="holding-fade-in">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-holding-white mb-2">
                Configurações do Sistema
              </h1>
              <p className="text-xl text-holding-blue-light">
                Gerencie as configurações e preferências do sistema
              </p>
            </div>
            <Button className="holding-btn-primary">
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </div>

        {/* Abas de Configuração */}
        <div className="holding-card p-6">
          <div className="flex space-x-1 mb-6">
            <Button
              variant={activeTab === 'general' ? 'default' : 'ghost'}
              className={`${
                activeTab === 'general'
                  ? 'bg-gradient-to-r from-holding-blue-medium to-holding-blue-light text-holding-white'
                  : 'text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20'
              }`}
              onClick={() => setActiveTab('general')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Geral
            </Button>
            <Button
              variant={activeTab === 'security' ? 'default' : 'ghost'}
              className={`${
                activeTab === 'security'
                  ? 'bg-gradient-to-r from-holding-blue-medium to-holding-blue-light text-holding-white'
                  : 'text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20'
              }`}
              onClick={() => setActiveTab('security')}
            >
              <Shield className="w-4 h-4 mr-2" />
              Segurança
            </Button>
            <Button
              variant={activeTab === 'appearance' ? 'default' : 'ghost'}
              className={`${
                activeTab === 'appearance'
                  ? 'bg-gradient-to-r from-holding-blue-medium to-holding-blue-light text-holding-white'
                  : 'text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20'
              }`}
              onClick={() => setActiveTab('appearance')}
            >
              <Palette className="w-4 h-4 mr-2" />
              Aparência
            </Button>
            <Button
              variant={activeTab === 'notifications' ? 'default' : 'ghost'}
              className={`${
                activeTab === 'notifications'
                  ? 'bg-gradient-to-r from-holding-blue-medium to-holding-blue-light text-holding-white'
                  : 'text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20'
              }`}
              onClick={() => setActiveTab('notifications')}
            >
              <Bell className="w-4 h-4 mr-2" />
              Notificações
            </Button>
          </div>

          {/* Conteúdo das Abas */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-holding-blue-light text-sm font-medium mb-2">
                    Nome da Empresa
                  </label>
                  <Input
                    type="text"
                    defaultValue="Holding Promotora"
                    className="holding-input"
                  />
                </div>
                <div>
                  <label className="block text-holding-blue-light text-sm font-medium mb-2">
                    CNPJ
                  </label>
                  <Input
                    type="text"
                    defaultValue="12.345.678/0001-90"
                    className="holding-input"
                  />
                </div>
                <div>
                  <label className="block text-holding-blue-light text-sm font-medium mb-2">
                    Email de Contato
                  </label>
                  <Input
                    type="email"
                    defaultValue="contato@holding.com"
                    className="holding-input"
                  />
                </div>
                <div>
                  <label className="block text-holding-blue-light text-sm font-medium mb-2">
                    Telefone
                  </label>
                  <Input
                    type="tel"
                    defaultValue="(11) 99999-9999"
                    className="holding-input"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-holding-blue-light text-sm font-medium mb-2">
                    Endereço
                  </label>
                  <Input
                    type="text"
                    defaultValue="Rua das Empresas, 123 - Centro"
                    className="holding-input"
                  />
                </div>
                <div>
                  <label className="block text-holding-blue-light text-sm font-medium mb-2">
                    Cidade
                  </label>
                  <Input
                    type="text"
                    defaultValue="São Paulo"
                    className="holding-input"
                  />
                </div>
                <div>
                  <label className="block text-holding-blue-light text-sm font-medium mb-2">
                    Estado
                  </label>
                  <Input
                    type="text"
                    defaultValue="SP"
                    className="holding-input"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-holding-blue-light text-sm font-medium mb-2">
                    Tempo de Sessão (minutos)
                  </label>
                  <Input
                    type="number"
                    defaultValue="30"
                    className="holding-input"
                  />
                </div>
                <div>
                  <label className="block text-holding-blue-light text-sm font-medium mb-2">
                    Tentativas de Login
                  </label>
                  <Input
                    type="number"
                    defaultValue="3"
                    className="holding-input"
                  />
                </div>
                <div>
                  <label className="block text-holding-blue-light text-sm font-medium mb-2">
                    Complexidade de Senha
                  </label>
                  <select className="holding-input" defaultValue="media">
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-holding-blue-light text-sm font-medium mb-2">
                    Autenticação em Dois Fatores
                  </label>
                  <select className="holding-input" defaultValue="opcional">
                    <option value="desabilitado">Desabilitado</option>
                    <option value="opcional">Opcional</option>
                    <option value="obrigatorio">Obrigatório</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-holding-blue-light text-sm font-medium mb-2">
                    Tema
                  </label>
                  <select className="holding-input" defaultValue="claro">
                    <option value="claro">Claro</option>
                    <option value="escuro">Escuro</option>
                    <option value="sistema">Sistema</option>
                  </select>
                </div>
                <div>
                  <label className="block text-holding-blue-light text-sm font-medium mb-2">
                    Idioma
                  </label>
                  <select className="holding-input" defaultValue="pt-br">
                    <option value="pt-br">Português (Brasil)</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                <div>
                  <label className="block text-holding-blue-light text-sm font-medium mb-2">
                    Densidade da Interface
                  </label>
                  <select className="holding-input" defaultValue="confortavel">
                    <option value="compacta">Compacta</option>
                    <option value="confortavel">Confortável</option>
                    <option value="espacosa">Espaçosa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-holding-blue-light text-sm font-medium mb-2">
                    Tamanho da Fonte
                  </label>
                  <select className="holding-input" defaultValue="medio">
                    <option value="pequeno">Pequeno</option>
                    <option value="medio">Médio</option>
                    <option value="grande">Grande</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-holding-blue-light/5">
                  <div>
                    <h3 className="font-medium text-holding-white">
                      Notificações por Email
                    </h3>
                    <p className="text-sm text-holding-blue-light">
                      Receber notificações importantes por email
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-holding-blue-light/5">
                  <div>
                    <h3 className="font-medium text-holding-white">
                      Notificações de Sistema
                    </h3>
                    <p className="text-sm text-holding-blue-light">
                      Alertas e atualizações do sistema
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-holding-blue-light/5">
                  <div>
                    <h3 className="font-medium text-holding-white">
                      Relatórios Automáticos
                    </h3>
                    <p className="text-sm text-holding-blue-light">
                      Envio automático de relatórios
                    </p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-holding-blue-light/5">
                  <div>
                    <h3 className="font-medium text-holding-white">
                      Backup Automático
                    </h3>
                    <p className="text-sm text-holding-blue-light">
                      Notificações de backup do banco de dados
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
