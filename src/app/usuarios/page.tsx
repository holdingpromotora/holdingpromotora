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
    if (!perfilNome) return <User className="w-4 h-4" />;

    if (perfilNome.toLowerCase().includes('admin'))
      return <Shield className="w-4 h-4" />;
    if (perfilNome.toLowerCase().includes('gerente'))
      return <Settings className="w-4 h-4" />;
    if (perfilNome.toLowerCase().includes('operador'))
      return <Users className="w-4 h-4" />;
    if (perfilNome.toLowerCase().includes('visualizador'))
      return <Eye className="w-4 h-4" />;

    return <User className="w-4 h-4" />;
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
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold text-holding-white mb-4">
                Gerenciamento de Usuários
              </h1>
              <p className="text-xl text-holding-blue-light">
                Usuários aprovados e ativos com acesso ao aplicativo
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push('/usuarios/aprovacao')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Aprovação
              </Button>
              <Button
                onClick={() => router.push('/usuarios/niveis-acesso')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Shield className="w-4 h-4 mr-2" />
                Níveis de Acesso
              </Button>
              <Button
                onClick={() => setShowTipoUsuarioDialog(true)}
                className="holding-btn-primary"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Novo Usuário
              </Button>
            </div>
          </div>
        </div>

        {/* Barra de Pesquisa e Filtros */}
        <div className="holding-card p-8">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-holding-blue-light w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar usuários por nome ou email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="holding-input pl-12 py-3"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Filter className="w-4 h-4 text-holding-blue-light" />
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <Card className="holding-stat-card">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 bg-gradient-to-br from-holding-blue-medium/20 to-holding-blue-light/20 rounded-xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-holding-blue-light" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-holding-white">
                    {estatisticas.total}
                  </p>
                  <p className="text-holding-blue-light text-sm">
                    Total de Usuários
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="holding-stat-card">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 bg-gradient-to-br from-holding-blue-light/20 to-holding-blue-medium/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-holding-blue-light" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-holding-white">
                    {estatisticas.ativos}
                  </p>
                  <p className="text-holding-blue-light text-sm">
                    Usuários Ativos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="holding-stat-card">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 bg-gradient-to-br from-holding-blue-dark/20 to-holding-blue-deep/20 rounded-xl flex items-center justify-center">
                  <UserPlus className="w-8 h-8 text-holding-blue-light" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-holding-white">
                    {estatisticas.aprovados}
                  </p>
                  <p className="text-holding-blue-light text-sm">
                    Usuários Aprovados
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="holding-stat-card">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 bg-gradient-to-br from-holding-blue-deep/20 to-holding-blue-profound/20 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-holding-blue-light" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-holding-white">
                    {estatisticas.pendentes}
                  </p>
                  <p className="text-holding-blue-light text-sm">
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
                <h3 className="text-xl font-semibold text-holding-white">
                  Usuários com Acesso ao Aplicativo
                </h3>
                <span className="text-holding-blue-light text-sm font-normal">
                  ({usuarios.length} usuário
                  {usuarios.length !== 1 ? 's' : ''})
                </span>
              </div>

              {/* DEBUG: Mostrar dados brutos */}
              <div className="text-xs text-holding-blue-light/70">
                <details>
                  <summary>Debug: Dados do Banco</summary>
                  <pre className="mt-2 p-2 bg-holding-dark/50 rounded text-xs overflow-auto max-w-md">
                    {JSON.stringify(usuarios.slice(0, 2), null, 2)}
                  </pre>
                </details>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={carregarUsuarios}
                  disabled={loading}
                  className="text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20 px-4 py-2"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`}
                  />
                  Atualizar
                </Button>

                <Button
                  onClick={() => setShowTipoUsuarioDialog(true)}
                  className="bg-holding-blue-light hover:bg-holding-blue-light/80 text-holding-white px-6 py-2"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Novo Usuário
                </Button>
              </div>
            </div>
            <CardTitle className="text-holding-white flex items-center space-x-3">
              <Users className="w-6 h-6 text-holding-blue-light" />
              <span>Usuários com Acesso ao Aplicativo</span>
              <span className="text-holding-blue-light text-sm font-normal">
                ({usuarios.length} usuário
                {usuarios.length !== 1 ? 's' : ''})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="holding-table">
                <thead>
                  <tr>
                    <th className="px-6 py-4">Nome</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Perfil</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Data de Cadastro</th>
                    <th className="px-6 py-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16">
                        <RefreshCw className="w-16 h-16 text-holding-blue-light/50 mx-auto mb-6 animate-spin" />
                        <p className="text-holding-blue-light text-lg mb-3">
                          Carregando usuários...
                        </p>
                        <p className="text-holding-blue-light/70 text-sm">
                          Aguarde um momento.
                        </p>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16">
                        <AlertCircle className="w-16 h-16 text-red-400/50 mx-auto mb-6" />
                        <p className="text-red-400 text-lg mb-3">{error}</p>
                        <p className="text-red-400/70 text-sm">
                          Tente recarregar a página.
                        </p>
                      </td>
                    </tr>
                  ) : usuarios.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16">
                        <XCircle className="w-16 h-16 text-holding-blue-light/50 mx-auto mb-6" />
                        <p className="text-holding-blue-light text-lg mb-3">
                          Nenhum usuário encontrado
                        </p>
                        <p className="text-holding-blue-light/70 text-sm">
                          Tente ajustar os filtros de busca
                        </p>
                      </td>
                    </tr>
                  ) : (
                    usuarios.map(user => (
                      <tr
                        key={user.id}
                        className="hover:bg-holding-blue-light/5 transition-colors"
                      >
                        <td className="font-medium text-holding-white px-6 py-4">
                          {user.nome}
                        </td>
                        <td className="text-holding-blue-light px-6 py-4">
                          {user.email}
                        </td>
                        <td className="flex items-center space-x-3 px-6 py-4">
                          {getPerfilIcon(user.perfil_nome)}
                          <span>{user.perfil_nome || 'N/A'}</span>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(
                            user.status,
                            user.aprovado,
                            user.ativo
                          )}
                        </td>
                        <td className="text-holding-blue-light px-6 py-4">
                          {formatarData(user.data_cadastro)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-10 h-10 p-0 text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20"
                              title="Visualizar"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {user.status === 'pendente' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-10 h-10 p-0 text-green-400 hover:text-green-300 hover:bg-green-500/20"
                                  onClick={() => handleAprovarUsuario(user.id)}
                                  title="Aprovar Usuário"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-10 h-10 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                  onClick={() => handleRejeitarUsuario(user.id)}
                                  title="Rejeitar Usuário"
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-10 h-10 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                              onClick={() => handleExcluirUsuario(user.id)}
                              title="Excluir Usuário"
                            >
                              <Trash2 className="w-4 h-4" />
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
                <User className="w-8 h-8 text-holding-blue-light" />
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
                <Building2 className="w-8 h-8 text-holding-blue-light" />
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
