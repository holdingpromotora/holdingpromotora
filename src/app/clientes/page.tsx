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
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
        .select('*')
        .eq('ativo', true);

      if (pfError) {
        console.error('Erro ao carregar pessoas físicas:', pfError);
      }

      // Buscar pessoas jurídicas
      const { data: pjData, error: pjError } = await supabase
        .from('pessoas_juridicas')
        .select('*')
        .eq('ativo', true);

      if (pjError) {
        console.error('Erro ao carregar pessoas jurídicas:', pjError);
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
        email: cliente.email,
        telefone: cliente.telefone || '',
        endereco: cliente.endereco || '',
        cidade: cliente.cidade || '',
        estado: cliente.estado || '',
        status: cliente.ativo ? 'Ativo' : 'Inativo',
        dataCadastro: cliente.created_at || new Date().toISOString(),
      }));

      setClientes([...clientesPF, ...clientesPJ]);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <Button
                onClick={() => router.push('/clientes/cadastro-pf')}
                className="holding-btn-primary w-full sm:w-auto"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Novo Cliente PF
              </Button>
              <Button
                onClick={() => router.push('/clientes/cadastro-pj')}
                className="holding-btn-primary w-full sm:w-auto"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Novo Cliente PJ
              </Button>
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
                className="holding-btn-primary w-full sm:w-auto mobile-action-button"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Novo Cliente PF
              </Button>
              <Button
                onClick={() => router.push('/clientes/cadastro-pj')}
                className="holding-btn-primary w-full sm:w-auto mobile-action-button"
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
                <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os Tipos</SelectItem>
                    <SelectItem value="PF">Pessoa Física</SelectItem>
                    <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFiltro} onValueChange={setStatusFiltro}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os Status</SelectItem>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="holding-card stats-card">
              <div className="stats-card-icon">
                <Users className="w-8 h-8 text-holding-blue-light" />
              </div>
              <div className="stats-card-text">
                <div className="text-2xl font-bold text-holding-white">
                  {totalClientes}
                </div>
                <div className="text-holding-blue-light">Total de Clientes</div>
              </div>
            </Card>
            <Card className="holding-card stats-card">
              <div className="stats-card-icon">
                <User className="w-8 h-8 text-holding-blue-light" />
              </div>
              <div className="stats-card-text">
                <div className="text-2xl font-bold text-holding-white">
                  {clientesPF}
                </div>
                <div className="text-holding-blue-light">Pessoas Físicas</div>
              </div>
            </Card>
            <Card className="holding-card stats-card">
              <div className="stats-card-icon">
                <Building2 className="w-8 h-8 text-holding-blue-light" />
              </div>
              <div className="stats-card-text">
                <div className="text-2xl font-bold text-holding-white">
                  {clientesPJ}
                </div>
                <div className="text-holding-blue-light">Pessoas Jurídicas</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Lista de Clientes */}
        <Card className="holding-card">
          <CardHeader>
            <CardTitle className="text-holding-white flex items-center space-x-2">
              <Building className="w-5 h-5 text-holding-blue-light" />
              <span>Lista de Clientes</span>
              <span className="text-holding-blue-light text-sm font-normal">
                ({filteredClientes.length} cliente
                {filteredClientes.length !== 1 ? 's' : ''})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="holding-table">
                <thead>
                  <tr>
                    <th>Nome/Razão Social</th>
                    <th>Tipo</th>
                    <th>Documento</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Endereço</th>
                    <th>Status</th>
                    <th>Data de Cadastro</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="text-center py-8">
                        <RefreshCw className="w-8 h-8 text-holding-blue-light animate-spin mx-auto" />
                        <p className="text-holding-blue-light text-lg mt-2">
                          Carregando clientes...
                        </p>
                      </td>
                    </tr>
                  ) : filteredClientes.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-8">
                        <Building className="w-16 h-16 text-holding-blue-light/50 mx-auto mb-4" />
                        <p className="text-holding-blue-light text-lg mb-2">
                          Nenhum cliente encontrado
                        </p>
                        <p className="text-holding-blue-light/70 text-sm">
                          Tente ajustar os filtros de busca
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredClientes.map(cliente => (
                      <tr
                        key={cliente.id}
                        className="hover:bg-holding-blue-light/5 transition-colors"
                      >
                        <td className="font-medium text-holding-white">
                          {cliente.nome}
                        </td>
                        <td>{getTipoBadge(cliente.tipo)}</td>
                        <td className="text-holding-blue-light">
                          {cliente.documento}
                        </td>
                        <td className="text-holding-blue-light">
                          {cliente.email}
                        </td>
                        <td className="text-holding-blue-light">
                          {cliente.telefone}
                        </td>
                        <td className="text-holding-blue-light">
                          {cliente.endereco}, {cliente.cidade}/{cliente.estado}
                        </td>
                        <td>{getStatusBadge(cliente.status)}</td>
                        <td className="text-holding-blue-light">
                          {new Date(cliente.dataCadastro).toLocaleDateString(
                            'pt-BR'
                          )}
                        </td>
                        <td>
                          <div className="flex items-center space-x-2 md:space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-10 h-10 md:w-8 md:h-8 p-0 text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20 transition-all duration-200"
                              title="Visualizar"
                            >
                              <Eye className="w-5 h-5 md:w-4 md:h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-10 h-10 md:w-8 md:h-8 p-0 text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20 transition-all duration-200"
                              title="Editar"
                            >
                              <Edit className="w-5 h-5 md:w-4 md:h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-10 h-10 md:w-8 md:h-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-200"
                              title="Excluir"
                            >
                              <Trash2 className="w-5 h-5 md:w-4 md:h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
