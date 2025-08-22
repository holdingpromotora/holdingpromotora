'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Building,
  Shield,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  FileText,
  TrendingUp,
  User,
  Building2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  UserCheck,
} from 'lucide-react';
import {
  UsuariosService,
  Usuario,
  FiltroUsuarios,
} from '@/lib/usuarios-service';

export default function UsuariosPage() {
  const router = useRouter();
  const [sidebarExpanded, setSidebarExpanded] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('todos');
  const [filterPerfil, setFilterPerfil] = React.useState('todos');
  const [showTipoUsuarioDialog, setShowTipoUsuarioDialog] =
    React.useState(false);
  const [showUserDetailsDialog, setShowUserDetailsDialog] =
    React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<Usuario | null>(null);
  const [usuarios, setUsuarios] = React.useState<Usuario[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [estatisticas, setEstatisticas] = React.useState({
    total: 0,
    aprovados: 0,
    pendentes: 0,
    rejeitados: 0,
    ativos: 0,
    inativos: 0,
  });

  // Carregar usuários do banco
  const carregarUsuarios = React.useCallback(async () => {
    try {
      console.log('🔄 [UsuariosPage] Iniciando carregamento de usuários...');
      setLoading(true);
      setError(null);

      const filtros: FiltroUsuarios = {
        searchTerm,
        status: filterStatus !== 'todos' ? filterStatus : undefined,
        perfil: filterPerfil !== 'todos' ? filterPerfil : undefined,
        // Mostrar apenas usuários aprovados e ativos (que têm acesso ao aplicativo)
        aprovado: true,
        ativo: true,
      };

      console.log(
        '🔄 [UsuariosPage] Chamando UsuariosService.buscarUsuarios...'
      );
      const usuariosData = await UsuariosService.buscarUsuarios(filtros);
      console.log('✅ [UsuariosPage] Usuários recebidos:', usuariosData);
      setUsuarios(usuariosData);

      // Carregar estatísticas apenas dos usuários com acesso
      console.log('🔄 [UsuariosPage] Carregando estatísticas...');
      const stats = await UsuariosService.buscarEstatisticas();
      console.log('✅ [UsuariosPage] Estatísticas recebidas:', stats);
      setEstatisticas(stats);
    } catch (err) {
      console.error('❌ Erro ao carregar usuários:', err);
      setError('Erro ao carregar usuários do banco de dados');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterStatus, filterPerfil]);

  // Carregar usuários na montagem do componente
  React.useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const getStatusBadge = (
    status: string,
    aprovado: boolean,
    ativo: boolean
  ) => {
    if (status === 'pendente') {
      return (
        <span className="holding-badge holding-badge-warning">Pendente</span>
      );
    } else if (status === 'aprovado' && aprovado) {
      return (
        <span className="holding-badge holding-badge-success">Aprovado</span>
      );
    } else if (status === 'rejeitado') {
      return (
        <span className="holding-badge holding-badge-error">Rejeitado</span>
      );
    } else if (ativo) {
      return <span className="holding-badge holding-badge-success">Ativo</span>;
    } else {
      return <span className="holding-badge holding-badge-error">Inativo</span>;
    }
  };

  const getPerfilIcon = (perfilNome?: string) => {
    if (!perfilNome)
      return (
        <div className="w-4 h-4">
          <User size={16} />
        </div>
      );

    if (perfilNome.toLowerCase().includes('admin'))
      return (
        <div className="w-4 h-4">
          <Shield size={16} />
        </div>
      );
    if (perfilNome.toLowerCase().includes('gerente'))
      return (
        <div className="w-4 h-4">
          <Settings size={16} />
        </div>
      );
    if (perfilNome.toLowerCase().includes('operador'))
      return (
        <div className="w-4 h-4">
          <Users size={16} />
        </div>
      );
    if (perfilNome.toLowerCase().includes('visualizador'))
      return (
        <div className="w-4 h-4">
          <Eye size={16} />
        </div>
      );

    return (
      <div className="w-4 h-4">
        <User size={16} />
      </div>
    );
  };

  const formatarData = (data?: string) => {
    if (!data) return 'N/A';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const handleAprovarUsuario = async (id: number) => {
    try {
      await UsuariosService.aprovarUsuario(id, 'Sistema');
      await carregarUsuarios(); // Recarregar lista
    } catch (err) {
      console.error('❌ Erro ao aprovar usuário:', err);
      setError('Erro ao aprovar usuário');
    }
  };

  const handleRejeitarUsuario = async (id: number) => {
    try {
      await UsuariosService.rejeitarUsuario(id, 'Sistema');
      await carregarUsuarios(); // Recarregar lista
    } catch (err) {
      console.error('❌ Erro ao rejeitar usuário:', err);
      setError('Erro ao rejeitar usuário');
    }
  };

  const handleExcluirUsuario = async (id: number) => {
    try {
      await UsuariosService.excluirUsuario(id);
      await carregarUsuarios(); // Recarregar lista
    } catch (err) {
      console.error('❌ Erro ao excluir usuário:', err);
      setError('Erro ao excluir usuário');
    }
  };

  const handleVisualizarUsuario = (user: Usuario) => {
    setSelectedUser(user);
    setShowUserDetailsDialog(true);
  };

  const handleEditarUsuario = (user: Usuario) => {
    // Verificar se é pessoa física ou jurídica baseado no email ou outros campos
    // Por padrão, vamos assumir que se tem CPF é PF, se tem CNPJ é PJ
    const isPessoaJuridica = (user as any).cnpj || (user as any).razao_social;

    // Redirecionar para o formulário apropriado com o ID do usuário
    if (isPessoaJuridica) {
      router.push(`/usuarios/cadastro-pj?edit=${user.id}`);
    } else {
      router.push(`/usuarios/cadastro-pf?edit=${user.id}`);
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
            onClick={toggleSidebar}
            title={sidebarExpanded ? 'Recolher Menu' : 'Expandir Menu'}
          >
            {sidebarExpanded ? (
              <div className="w-5 h-5">
                <ChevronLeft size={20} />
              </div>
            ) : (
              <div className="w-5 h-5">
                <ChevronRight size={20} />
              </div>
            )}
          </Button>

          {/* Logo */}
          <div className="w-12 h-12 bg-gradient-to-br from-holding-blue-medium to-holding-blue-light rounded-xl flex items-center justify-center mb-8">
            <div className="w-6 h-6 text-holding-white">
              <Shield size={24} />
            </div>
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
            <div className="w-5 h-5">
              <BarChart3 size={20} />
            </div>
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
            <div className="w-5 h-5">
              <Users size={20} />
            </div>
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
            <div className="w-5 h-5">
              <Building size={20} />
            </div>
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
            <div className="w-5 h-5">
              <Settings size={20} />
            </div>
            {sidebarExpanded && (
              <span className="ml-3 text-sm font-medium">Configurações</span>
            )}
          </Button>

          {/* Logout */}
          <div
            className={`pt-8 border-t border-holding-blue-light/30 ${sidebarExpanded ? 'w-full' : 'w-8'}`}
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
              <div className="w-5 h-5">
                <LogOut size={20} />
              </div>
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
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold text-holding-white mb-4">
                Gerenciamento de Usuários
              </h1>
              <p className="text-xl text-holding-blue-light">
                Usuários aprovados e ativos com acesso ao aplicativo
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Button
                onClick={() => router.push('/usuarios/aprovacao')}
                className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
              >
                <div className="w-4 h-4 mr-2">
                  <UserCheck size={16} />
                </div>
                Aprovação
              </Button>
              <Button
                onClick={() => router.push('/usuarios/niveis-acesso')}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
              >
                <div className="w-4 h-4 mr-2">
                  <Shield size={16} />
                </div>
                Níveis de Acesso
              </Button>
              <Button
                onClick={() => setShowTipoUsuarioDialog(true)}
                className="holding-btn-primary w-full sm:w-auto"
              >
                <div className="w-4 h-4 mr-2">
                  <UserPlus size={16} />
                </div>
                Novo Usuário
              </Button>
            </div>
          </div>
        </div>

        {/* Barra de Pesquisa e Filtros */}
        <div className="holding-card p-8">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-holding-blue-light w-4 h-4">
                <Search size={16} />
              </div>
              <Input
                type="text"
                placeholder="Buscar usuários por nome ou email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="holding-input pl-12 py-3"
              />
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 text-holding-blue-light">
                <Filter size={16} />
              </div>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="holding-input py-3 px-4"
              >
                <option value="todos">Todos os Status</option>
                <option value="pendente">Pendente</option>
                <option value="aprovado">Aprovado</option>
                <option value="rejeitado">Rejeitado</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-12">
          <Card className="holding-stat-card">
            <CardContent className="p-4 md:p-8">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-holding-blue-medium/20 to-holding-blue-light/20 rounded-xl flex items-center justify-center">
                  <div className="w-6 h-6 md:w-8 md:h-8 text-holding-blue-light">
                    <Users size={24} className="md:w-8 md:h-8" />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl md:text-3xl font-bold text-holding-white">
                    {estatisticas.total}
                  </p>
                  <p className="text-holding-blue-light text-xs md:text-sm">
                    Total de Usuários
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="holding-stat-card">
            <CardContent className="p-4 md:p-8">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-holding-blue-light/20 to-holding-blue-medium/20 rounded-xl flex items-center justify-center">
                  <div className="w-6 h-6 md:w-8 md:h-8 text-holding-blue-light">
                    <Shield size={24} className="md:w-8 md:h-8" />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl md:text-3xl font-bold text-holding-white">
                    {estatisticas.ativos}
                  </p>
                  <p className="text-holding-blue-light text-xs md:text-sm">
                    Usuários Ativos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="holding-stat-card">
            <CardContent className="p-4 md:p-8">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-holding-blue-dark/20 to-holding-blue-deep/20 rounded-xl flex items-center justify-center">
                  <div className="w-6 h-6 md:w-8 md:h-8 text-holding-blue-light">
                    <UserPlus size={24} className="md:w-8 md:h-8" />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl md:text-3xl font-bold text-holding-white">
                    {estatisticas.aprovados}
                  </p>
                  <p className="text-holding-blue-light text-xs md:text-sm">
                    Usuários Aprovados
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="holding-stat-card">
            <CardContent className="p-4 md:p-8">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-holding-blue-deep/20 to-holding-blue-profound/20 rounded-xl flex items-center justify-center">
                  <div className="w-6 h-6 md:w-8 md:h-8 text-holding-blue-light">
                    <AlertCircle size={24} className="md:w-8 md:h-8" />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl md:text-3xl font-bold text-holding-white">
                    {estatisticas.pendentes}
                  </p>
                  <p className="text-holding-blue-light text-xs md:text-sm">
                    Usuários Pendentes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Usuários */}
        <Card className="holding-card">
          <CardHeader className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-6">
                <h3 className="text-xl font-semibold text-holding-white flex items-center space-x-4">
                  <div className="w-6 h-6 text-holding-blue-light">
                    <Users size={24} />
                  </div>
                  Usuários com Acesso ao Aplicativo
                </h3>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={carregarUsuarios}
                  disabled={loading}
                  className="text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20 px-4 py-2"
                >
                  <div
                    className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`}
                  >
                    <RefreshCw size={16} />
                  </div>
                  Atualizar
                </Button>
              </div>
            </div>
            <CardTitle className="text-holding-white"></CardTitle>
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
                    Carregando usuários...
                  </p>
                  <p className="text-holding-blue-light/70 text-sm">
                    Aguarde um momento.
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-red-400">
                      <AlertCircle size={40} />
                    </div>
                  </div>
                  <p className="text-red-400 text-lg font-medium mb-2">
                    {error}
                  </p>
                  <p className="text-red-400/70 text-sm">
                    Tente recarregar a página.
                  </p>
                </div>
              ) : usuarios.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-holding-blue-light/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-holding-blue-light">
                      <XCircle size={40} />
                    </div>
                  </div>
                  <p className="text-holding-blue-light text-lg font-medium mb-2">
                    Nenhum usuário encontrado
                  </p>
                  <p className="text-holding-blue-light/70 text-sm">
                    Tente ajustar os filtros de busca
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                  {usuarios.map(user => (
                    <Card
                      key={user.id}
                      className="bg-gradient-to-br from-holding-blue-profound/60 to-holding-blue-profound/40 border border-holding-blue-light/30 hover:border-holding-blue-light/50 transition-all duration-300 hover:shadow-lg hover:shadow-holding-blue-light/10 group"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-holding-blue-light/20 to-holding-blue-light/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            {getPerfilIcon(user.perfil_nome)}
                          </div>
                          {getStatusBadge(
                            user.status,
                            user.aprovado,
                            user.ativo
                          )}
                        </div>

                        <div className="mb-3">
                          <h4 className="font-semibold text-holding-white text-lg mb-1">
                            {user.nome}
                          </h4>
                          <p className="text-holding-blue-light text-sm">
                            {user.email}
                          </p>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="w-4 h-4 bg-holding-blue-light/20 rounded flex items-center justify-center">
                              <div className="text-holding-blue-light">
                                <UserCheck size={12} />
                              </div>
                            </div>
                            <span className="text-holding-blue-light">
                              Perfil:
                            </span>
                            <span className="text-holding-white font-medium">
                              {user.perfil_nome || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="w-4 h-4 bg-holding-blue-light/20 rounded flex items-center justify-center">
                              <div className="text-holding-blue-light">
                                <Clock size={12} />
                              </div>
                            </div>
                            <span className="text-holding-blue-light">
                              Cadastro:
                            </span>
                            <span className="text-holding-white font-medium">
                              {formatarData(user.data_cadastro)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-holding-blue-light/20">
                          <div className="flex items-center space-x-2 md:space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVisualizarUsuario(user)}
                              className="w-10 h-10 md:w-8 md:h-8 p-0 border-holding-blue-light/30 text-holding-blue-light hover:bg-holding-blue-light/20 hover:border-holding-blue-light/50 hover:scale-110 transition-all duration-200 rounded-lg"
                              title="Visualizar"
                            >
                              <div className="text-holding-blue-light">
                                <Eye size={20} className="md:w-4 md:h-4" />
                              </div>
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditarUsuario(user)}
                              className="w-10 h-10 md:w-8 md:h-8 p-0 border-blue-400/30 text-blue-400 hover:bg-blue-400/20 hover:border-blue-400/50 hover:scale-110 transition-all duration-200 rounded-lg"
                              title="Editar Usuário"
                            >
                              <div className="text-blue-400">
                                <Edit size={20} className="md:w-4 md:h-4" />
                              </div>
                            </Button>
                          </div>

                          <div className="flex items-center space-x-2 md:space-x-1">
                            {user.status === 'pendente' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-10 h-10 md:w-8 md:h-8 p-0 border-green-400/30 text-green-400 hover:bg-green-400/20 hover:border-green-400/50 hover:scale-110 transition-all duration-200 rounded-lg"
                                  title="Aprovar Usuário"
                                  onClick={() => handleAprovarUsuario(user.id)}
                                >
                                  <div className="text-green-400">
                                    <CheckCircle size={20} className="md:w-4 md:h-4" />
                                  </div>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-10 h-10 md:w-8 md:h-8 p-0 border-red-400/30 text-red-400 hover:bg-red-400/20 hover:border-red-400/50 hover:scale-110 transition-all duration-200 rounded-lg"
                                  title="Rejeitar Usuário"
                                  onClick={() => handleRejeitarUsuario(user.id)}
                                >
                                  <div className="text-red-400">
                                    <XCircle size={20} className="md:w-4 md:h-4" />
                                  </div>
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-10 h-10 md:w-8 md:h-8 p-0 border-red-400/30 text-red-400 hover:bg-red-400/20 hover:border-red-400/50 hover:scale-110 transition-all duration-200 rounded-lg"
                              title="Excluir Usuário"
                              onClick={() => handleExcluirUsuario(user.id)}
                            >
                              <div className="text-red-400">
                                <Trash2 size={20} className="md:w-4 md:h-4" />
                              </div>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Popup de Detalhes do Usuário */}
        <AlertDialog
          open={showUserDetailsDialog}
          onOpenChange={setShowUserDetailsDialog}
        >
          <AlertDialogContent className="bg-holding-dark border border-holding-accent/30 max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-holding-white text-xl flex items-center space-x-3">
                <div className="w-6 h-6 text-holding-blue-light">
                  <User size={24} />
                </div>
                Detalhes do Usuário
              </AlertDialogTitle>
            </AlertDialogHeader>

            {selectedUser && (
              <div className="space-y-6 py-4">
                {/* Informações Básicas */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-holding-white border-b border-holding-blue-light/30 pb-2">
                    Informações do Usuário
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-holding-blue-light">Nome:</span>
                        <span className="text-holding-white font-medium">
                          {selectedUser.nome}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-holding-blue-light">Email:</span>
                        <span className="text-holding-white font-medium">
                          {selectedUser.email}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-holding-blue-light">Perfil:</span>
                        <span className="text-holding-white font-medium">
                          {selectedUser.perfil_nome || 'N/A'}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-holding-blue-light">Status:</span>
                        <span className="text-holding-white font-medium">
                          {selectedUser.status === 'pendente'
                            ? 'Pendente'
                            : selectedUser.status === 'aprovado'
                              ? 'Aprovado'
                              : selectedUser.status === 'rejeitado'
                                ? 'Rejeitado'
                                : 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-holding-blue-light">Ativo:</span>
                        <span className="text-holding-white font-medium">
                          {selectedUser.ativo ? 'Sim' : 'Não'}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-holding-blue-light">
                          Data de Cadastro:
                        </span>
                        <span className="text-holding-white font-medium">
                          {formatarData(selectedUser.data_cadastro)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-holding-blue-light">
                          Data de Aprovação:
                        </span>
                        <span className="text-holding-white font-medium">
                          {selectedUser.data_aprovacao
                            ? formatarData(selectedUser.data_aprovacao)
                            : 'N/A'}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-holding-blue-light">
                          Aprovado por:
                        </span>
                        <span className="text-holding-white font-medium">
                          {selectedUser.aprovado_por || 'N/A'}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-holding-blue-light">
                          Último Acesso:
                        </span>
                        <span className="text-holding-white font-medium">
                          {selectedUser.ultimo_acesso
                            ? formatarData(selectedUser.ultimo_acesso)
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <AlertDialogFooter>
              <AlertDialogCancel className="bg-holding-accent/20 text-holding-blue-light hover:bg-holding-accent/30 hover:text-holding-white border-holding-accent/30">
                Fechar
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Popup de Seleção do Tipo de Usuário */}
        <AlertDialog
          open={showTipoUsuarioDialog}
          onOpenChange={setShowTipoUsuarioDialog}
        >
          <AlertDialogContent className="bg-holding-dark border border-holding-accent/30">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-holding-white text-xl">
                Selecione o Tipo de Usuário
              </AlertDialogTitle>
              <AlertDialogDescription className="text-holding-blue-light">
                Escolha se deseja cadastrar uma Pessoa Física ou Pessoa Jurídica
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <Button
                onClick={() => {
                  setShowTipoUsuarioDialog(false);
                  router.push('/usuarios/cadastro-pf');
                }}
                className="h-24 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-holding-blue-medium/20 to-holding-blue-light/20 hover:from-holding-blue-medium/30 hover:to-holding-blue-light/30 border border-holding-blue-light/30 hover:border-holding-blue-light/50 transition-all duration-200"
              >
                <div className="w-8 h-8 text-holding-blue-light">
                  <User size={32} />
                </div>
                <span className="text-holding-white font-semibold">
                  Pessoa Física
                </span>
                <span className="text-holding-blue-light text-sm">
                  CPF, RG, etc.
                </span>
              </Button>

              <Button
                onClick={() => {
                  setShowTipoUsuarioDialog(false);
                  router.push('/usuarios/cadastro-pj');
                }}
                className="h-24 flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-holding-blue-dark/20 to-holding-blue-deep/20 hover:from-holding-blue-dark/30 hover:to-holding-blue-deep/30 border border-holding-blue-deep/30 hover:border-holding-blue-deep/50 transition-all duration-200"
              >
                <div className="w-8 h-8 text-holding-blue-light">
                  <Building2 size={32} />
                </div>
                <span className="text-holding-white font-semibold">
                  Pessoa Jurídica
                </span>
                <span className="text-holding-blue-light text-sm">
                  CNPJ, Razão Social, etc.
                </span>
              </Button>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel className="bg-holding-accent/20 text-holding-blue-light hover:bg-holding-accent/30 hover:text-holding-white border-holding-accent/30">
                Cancelar
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
