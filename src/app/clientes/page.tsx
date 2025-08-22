'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  Building,
  Search,
  Filter,
  Eye,
  Edit,
  RefreshCw,
  Trash2,
  FileText,
  BarChart3,
  Upload,
  Shield,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Calculator,
  FileSpreadsheet,
  Building2,
  User,
  XCircle,
  Calendar,
  Pencil,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

import { Badge } from '@/components/ui/badge';

interface Cliente {
  id: string; // Mudado de number para string para aceitar prefixos pf_ e pj_
  nome: string;
  tipo: 'PF' | 'PJ';
  documento: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  status: string;
  dataCadastro: string;
}

export default function ClientesPage() {
  const router = useRouter();
  const [sidebarExpanded, setSidebarExpanded] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('overview');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [tipoFiltro, setTipoFiltro] = React.useState('');
  const [statusFiltro, setStatusFiltro] = React.useState('');
  const [clientes, setClientes] = React.useState<Cliente[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Carregar clientes do banco de dados
  const carregarClientes = async () => {
    try {
      setLoading(true);

      // Buscar pessoas físicas
      const { data: pfData, error: pfError } = await supabase
        .from('pessoas_fisicas')
        .select(
          'id, nome, cpf, email, telefone, endereco, cidade, estado, ativo, created_at'
        )
        .eq('ativo', true);

      if (pfError) {
        console.error('❌ Erro ao carregar pessoas físicas:', pfError);
      }

      // Buscar pessoas jurídicas
      const { data: pjData, error: pjError } = await supabase
        .from('pessoas_juridicas')
        .select(
          'id, razao_social, cnpj, proprietario_email, proprietario_telefone, endereco, cidade, estado, ativo, created_at'
        )
        .eq('ativo', true);

      if (pjError) {
        console.error('❌ Erro ao carregar pessoas jurídicas:', pjError);
      }

      // Combinar e formatar dados
      const clientesPF = (pfData || []).map(cliente => ({
        id: `pf_${cliente.id}`, // Prefixo único para PF
        nome: cliente.nome,
        tipo: 'PF' as const,
        documento: cliente.cpf,
        email: cliente.email,
        telefone: cliente.telefone || '',
        endereco: cliente.endereco || '',
        cidade: cliente.cidade || '',
        estado: cliente.estado || '',
        status: cliente.ativo ? 'Ativo' : 'Inativo',
        dataCadastro: cliente.created_at || new Date().toISOString(),
      }));

      const clientesPJ = (pjData || []).map(cliente => ({
        id: `pj_${cliente.id}`, // Prefixo único para PJ
        nome: cliente.razao_social,
        tipo: 'PJ' as const,
        documento: cliente.cnpj,
        email: cliente.proprietario_email,
        telefone: cliente.proprietario_telefone || '',
        endereco: cliente.endereco || '',
        cidade: cliente.cidade || '',
        estado: cliente.estado || '',
        status: cliente.ativo ? 'Ativo' : 'Inativo',
        dataCadastro: cliente.created_at || new Date().toISOString(),
      }));

      const todosClientes = [...clientesPF, ...clientesPJ];
      setClientes(todosClientes);
    } catch (error) {
      console.error('❌ Erro geral ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar clientes ao montar o componente
  React.useEffect(() => {
    carregarClientes();
  }, []);

  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch =
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.documento.includes(searchTerm) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = tipoFiltro === '' || cliente.tipo === tipoFiltro;
    const matchesStatus =
      statusFiltro === '' || cliente.status === statusFiltro;
    return matchesSearch && matchesTipo && matchesStatus;
  });

  const totalClientes = clientes.length;
  const clientesPF = clientes.filter(c => c.tipo === 'PF').length;
  const clientesPJ = clientes.filter(c => c.tipo === 'PJ').length;

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Ativo') {
      return <span className="holding-badge holding-badge-success">Ativo</span>;
    } else {
      return <span className="holding-badge holding-badge-error">Inativo</span>;
    }
  };

  const getTipoBadge = (tipo: string) => {
    if (tipo === 'PF') {
      return (
        <span className="holding-badge holding-badge-info">Pessoa Física</span>
      );
    } else {
      return (
        <span className="holding-badge holding-badge-warning">
          Pessoa Jurídica
        </span>
      );
    }
  };

  const handleEditarCliente = (cliente: Cliente) => {
    if (cliente.tipo === 'PF') {
      router.push(
        `/clientes/cadastro-pf?edit=${cliente.id.replace('pf_', '')}`
      );
    } else {
      router.push(
        `/clientes/cadastro-pj?edit=${cliente.id.replace('pj_', '')}`
      );
    }
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
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
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
            } h-12 p-0 text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20 rounded-lg`}
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
            } h-12 p-0 text-holding-white hover:text-holding-white hover:bg-holding-blue-light/20 rounded-lg bg-holding-blue-light/20`}
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-holding-white mb-2">
                Gerenciamento de Clientes
              </h1>
              <p className="text-xl text-holding-blue-light">
                Cadastro, edição e controle de clientes do sistema
              </p>
            </div>
          </div>
        </div>

        {/* Barra de Pesquisa e Filtros */}
        <div className="space-y-6">
          {/* Botões de ação - ACIMA do filtro para mobile */}
          <div className="action-buttons-container">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mobile-stacked-buttons">
              <Button
                onClick={() => router.push('/clientes/cadastro-pf')}
                className="holding-btn-primary w-full sm:w-auto mobile-action-button rounded-xl"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Novo Cliente PF
              </Button>
              <Button
                onClick={() => router.push('/clientes/cadastro-pj')}
                className="holding-btn-primary w-full sm:w-auto mobile-action-button rounded-xl"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Novo Cliente PJ
              </Button>
            </div>
          </div>

          {/* Filtros */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar clientes por nome, documento ou email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="holding-input"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={tipoFiltro}
                  onChange={e => setTipoFiltro(e.target.value)}
                  className="w-40 px-3 py-2 bg-holding-blue-profound/60 border border-holding-blue-light/30 text-holding-white rounded-lg focus:outline-none focus:ring-2 focus:ring-holding-blue-light/50 focus:border-holding-blue-light"
                >
                  <option value="">Todos os Tipos</option>
                  <option value="PF">Pessoa Física</option>
                  <option value="PJ">Pessoa Jurídica</option>
                </select>
                <select
                  value={statusFiltro}
                  onChange={e => setStatusFiltro(e.target.value)}
                  className="w-40 px-3 py-2 bg-holding-blue-profound/60 border border-holding-blue-light/30 text-holding-white rounded-lg focus:outline-none focus:ring-2 focus:ring-holding-blue-light/50 focus:border-holding-blue-light"
                >
                  <option value="">Todos os Status</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-holding-blue-profound/80 to-holding-blue-profound/60 border border-holding-blue-light/40 hover:border-holding-blue-light/60 transition-all duration-300 hover:shadow-xl hover:shadow-holding-blue-light/20 group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-holding-blue-light/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-holding-blue-light/20 to-holding-blue-light/10 rounded-2xl flex items-center justify-center">
                    <Users className="w-8 h-8 text-holding-blue-light" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-holding-white mb-1">
                      {totalClientes}
                    </div>
                    <div className="text-holding-blue-light/80 text-sm font-medium">
                      Total
                    </div>
                  </div>
                </div>
                <div className="text-holding-blue-light text-lg font-semibold">
                  Total de Clientes
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-holding-blue-profound/80 to-holding-blue-profound/60 border border-holding-blue-light/40 hover:border-holding-blue-light/60 transition-all duration-300 hover:shadow-xl hover:shadow-holding-blue-light/20 group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-holding-blue-light/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 rounded-2xl flex items-center justify-center">
                    <User className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-holding-white mb-1">
                      {clientesPF}
                    </div>
                    <div className="text-emerald-400/80 text-sm font-medium">
                      PF
                    </div>
                  </div>
                </div>
                <div className="text-holding-blue-light text-lg font-semibold">
                  Pessoas Físicas
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-holding-blue-profound/80 to-holding-blue-profound/60 border border-holding-blue-light/40 hover:border-holding-blue-light/60 transition-all duration-300 hover:shadow-xl hover:shadow-holding-blue-light/20 group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-holding-blue-light/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-2xl flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-holding-white mb-1">
                      {clientesPJ}
                    </div>
                    <div className="text-purple-400/80 text-sm font-medium">
                      PJ
                    </div>
                  </div>
                </div>
                <div className="text-holding-blue-light text-lg font-semibold">
                  Pessoas Jurídicas
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Lista de Clientes */}
        <Card className="holding-card">
          <CardHeader className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-holding-white flex items-center space-x-3">
                <div className="w-6 h-6 text-holding-blue-light">
                  <Users size={24} />
                </div>
                <span>
                  Lista de Clientes ({filteredClientes.length} clientes)
                </span>
              </h3>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-6">
              {loading ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-holding-blue-light/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-holding-blue-light animate-spin">
                      <RefreshCw size={40} />
                    </div>
                  </div>
                  <p className="text-holding-blue-light text-lg font-medium mb-2">
                    Carregando clientes...
                  </p>
                  <p className="text-holding-blue-light/70 text-sm">
                    Aguarde um momento.
                  </p>
                </div>
              ) : filteredClientes.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-holding-blue-light/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-holding-blue-light">
                      <XCircle size={40} />
                    </div>
                  </div>
                  <p className="text-holding-blue-light text-lg font-medium mb-2">
                    Nenhum cliente encontrado
                  </p>
                  <p className="text-holding-blue-light/70 text-sm">
                    Tente ajustar os filtros de busca
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                  {filteredClientes.map(cliente => (
                    <Card
                      key={cliente.id}
                      className="bg-gradient-to-br from-holding-blue-profound/70 to-holding-blue-profound/50 border border-holding-blue-light/40 hover:border-holding-blue-light/60 transition-all duration-300 hover:shadow-xl hover:shadow-holding-blue-light/15 group overflow-hidden relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-holding-blue-light/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="p-5 relative z-10">
                        {/* Header do Card */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-holding-blue-light/25 to-holding-blue-light/15 rounded-xl flex items-center justify-center">
                            {cliente.tipo === 'PF' ? (
                              <User className="w-6 h-6 text-holding-blue-light" />
                            ) : (
                              <Building2 className="w-6 h-6 text-holding-blue-light" />
                            )}
                          </div>
                          <div className="flex flex-col gap-2 items-end">
                            <Badge
                              variant="secondary"
                              className={`px-3 py-1 text-xs font-medium rounded-full ${
                                cliente.tipo === 'PF'
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                  : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                              }`}
                            >
                              {cliente.tipo === 'PF'
                                ? 'Pessoa Física'
                                : 'Pessoa Jurídica'}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="px-3 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400 border-green-500/30"
                            >
                              Ativo
                            </Badge>
                          </div>
                        </div>

                        {/* Informações do Cliente */}
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold text-holding-white text-base mb-1 line-clamp-2 leading-tight">
                              {cliente.nome}
                            </h4>
                            <p className="text-holding-blue-light/80 text-sm line-clamp-1">
                              {cliente.email}
                            </p>
                          </div>

                          {/* Detalhes do Cliente */}
                          <div className="space-y-2.5">
                            <div className="flex items-center gap-2.5">
                              <FileText className="w-4 h-4 text-holding-blue-light/60" />
                              <span className="text-holding-blue-light/90 text-sm">
                                Doc: {cliente.documento}
                              </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <Phone className="w-4 h-4 text-holding-blue-light/60" />
                              <span className="text-holding-blue-light/90 text-sm">
                                Tel: {cliente.telefone}
                              </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <MapPin className="w-4 h-4 text-holding-blue-light/60" />
                              <span className="text-holding-blue-light/90 text-sm">
                                Local: {cliente.cidade}/{cliente.estado}
                              </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <Calendar className="w-4 h-4 text-holding-blue-light/60" />
                              <span className="text-holding-blue-light/90 text-sm">
                                Cadastro:{' '}
                                {new Date(
                                  cliente.dataCadastro
                                ).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Ações */}
                        <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-holding-blue-light/20">
                          <button className="p-2 text-holding-blue-light/70 hover:text-holding-blue-light hover:bg-holding-blue-light/10 rounded-lg transition-colors duration-200">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditarCliente(cliente)}
                            className="p-2 text-holding-blue-light/70 hover:text-holding-blue-light hover:bg-holding-blue-light/10 rounded-lg transition-colors duration-200"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-holding-blue-light/70 hover:text-holding-blue-light hover:bg-holding-blue-light/10 rounded-lg transition-colors duration-200">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
