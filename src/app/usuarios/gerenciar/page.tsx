'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Building,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  Eye,
  Edit,
  Trash2,
  UserCheck2,
  Calendar,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Building2,
  BarChart,
  Cog,
  CreditCard,
  TrendingUp,
} from 'lucide-react';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo_acesso_id: number;
  perfil_nome: string;
  aprovado: boolean;
  ativo: boolean;
  data_cadastro: string;
  data_aprovacao: string;
  tipos_acesso: {
    id: number;
    nome: string;
    nivel: number;
    descricao: string;
  };
}

interface Permissao {
  id: string;
  nome: string;
  descricao: string;
  acao: string;
  recurso: string;
}

interface PermissoesOrganizadas {
  [categoria: string]: Permissao[];
}

export default function GerenciarUsuariosPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [permissoes, setPermissoes] = useState<PermissoesOrganizadas>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [userInfo, setUserInfo] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('holding_user');
    if (!userData) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      setUserInfo(user);
      carregarPermissoes(user.id);
      carregarUsuarios();
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      router.push('/login');
    }
  }, [router]);

  const carregarPermissoes = async (userId: number) => {
    try {
      const response = await fetch('/api/usuarios/permissoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setPermissoes(data.permissoes);
      }
    } catch (error) {
      console.error('Erro ao carregar permissões:', error);
    }
  };

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      console.log('🔍 Carregando usuários...');
      const response = await fetch('/api/usuarios/aprovados');

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Usuários carregados:', data.usuarios);
        setUsuarios(data.usuarios);
      } else {
        console.error('❌ Erro na resposta da API');
        setError('Erro ao carregar usuários');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar usuários:', error);
      setError('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const temPermissao = (categoria: string, acao: string): boolean => {
    if (!permissoes[categoria]) return false;
    return permissoes[categoria].some(p => p.acao === acao);
  };

  const temAcessoCategoria = (categoria: string): boolean => {
    return permissoes[categoria] && permissoes[categoria].length > 0;
  };

  const getPerfilIcon = (perfilNome: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      Master: <Shield size={24} />,
      Administrador: <Shield size={24} />,
      Gerente: <Shield size={24} />,
      Supervisor: <Shield size={24} />,
      Operador: <User size={24} />,
      Visualizador: <Eye size={24} />,
      Convidado: <User size={24} />,
    };
    return icons[perfilNome] || <User size={24} />;
  };

  const getStatusBadge = (usuario: Usuario) => {
    if (!usuario.ativo) {
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-400/30">
          <div className="text-red-400">
            <XCircle size={12} />
          </div>
          Inativo
        </Badge>
      );
    }

    if (usuario.aprovado) {
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
          <div className="text-green-400">
            <CheckCircle size={12} />
          </div>
          Ativo
        </Badge>
      );
    }

    return (
      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-400/30">
        <div className="text-yellow-400">
          <Clock size={12} />
        </div>
        Pendente
      </Badge>
    );
  };

  const formatarData = (data: string) => {
    if (!data) return 'N/A';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const filtrarUsuarios = () => {
    let usuariosFiltrados = usuarios;
    console.log('🔍 Filtrando usuários. Total:', usuarios.length);

    if (filterStatus !== 'todos') {
      usuariosFiltrados = usuariosFiltrados.filter(usuario => {
        if (filterStatus === 'ativo') return usuario.ativo;
        if (filterStatus === 'inativo') return !usuario.ativo;
        return true;
      });
      console.log('🔍 Após filtro de status:', usuariosFiltrados.length);
    }

    if (searchTerm) {
      usuariosFiltrados = usuariosFiltrados.filter(
        usuario =>
          usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          usuario.perfil_nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('🔍 Após filtro de busca:', usuariosFiltrados.length);
    }

    console.log('✅ Usuários filtrados finais:', usuariosFiltrados.length);
    return usuariosFiltrados;
  };

  const usuariosFiltrados = filtrarUsuarios();

  // Debug: Log do estado atual
  console.log('🎯 Estado atual:', {
    loading,
    error,
    usuariosTotal: usuarios.length,
    usuariosFiltrados: usuariosFiltrados.length,
    permissoes: Object.keys(permissoes),
  });

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-holding-blue-deep via-holding-blue-dark to-holding-blue-profound flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-holding-blue-light/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="text-holding-blue-light animate-spin">
              <RefreshCw size={40} />
            </div>
          </div>
          <p className="text-holding-blue-light text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen holding-layout">
      {/* Sidebar */}
      <div
        className={`holding-sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`}
      >
        <nav className="flex flex-col items-center py-8 space-y-6">
          <Button
            variant="ghost"
            size="sm"
            className="w-12 h-12 p-0 text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20 rounded-lg mb-8"
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
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

          <div className="w-12 h-12 bg-gradient-to-br from-holding-blue-medium to-holding-blue-light rounded-xl flex items-center justify-center mb-8">
            <div className="text-holding-white">
              <Shield size={24} />
            </div>
          </div>

          {temAcessoCategoria('dashboard') && (
            <Button
              variant="ghost"
              size="sm"
              className="w-12 h-12 p-0 text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20 rounded-lg"
              onClick={() => router.push('/dashboard')}
              title="Dashboard"
            >
              <div className="w-5 h-5">
                <BarChart3 size={20} />
              </div>
            </Button>
          )}

          {temAcessoCategoria('usuarios') && (
            <Button
              variant="ghost"
              size="sm"
              className="w-12 h-12 p-0 text-holding-white hover:text-holding-white hover:bg-holding-blue-light/20 rounded-lg bg-holding-blue-light/20"
              onClick={() => router.push('/usuarios')}
              title="Usuários"
            >
              <div className="w-5 h-5">
                <Users size={20} />
              </div>
            </Button>
          )}

          {temAcessoCategoria('cadastros') && (
            <Button
              variant="ghost"
              size="sm"
              className="w-12 h-12 p-0 text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20 rounded-lg"
              onClick={() => router.push('/clientes')}
              title="Clientes"
            >
              <div className="w-5 h-5">
                <Building size={20} />
              </div>
            </Button>
          )}

          {temAcessoCategoria('relatorios') && (
            <Button
              variant="ghost"
              size="sm"
              className="w-12 h-12 p-0 text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20 rounded-lg"
              onClick={() => router.push('/relatorios')}
              title="Relatórios"
            >
              <div className="w-5 h-5">
                <BarChart size={20} />
              </div>
            </Button>
          )}

          {temAcessoCategoria('sistema') && (
            <Button
              variant="ghost"
              size="sm"
              className="w-12 h-12 p-0 text-holding-blue-light hover:text-holding-white hover:bg-holding-blue-light/20 rounded-lg"
              onClick={() => router.push('/settings')}
              title="Configurações"
            >
              <div className="w-5 h-5">
                <Settings size={20} />
              </div>
            </Button>
          )}

          <div className="pt-8 border-t border-holding-blue-light/30 w-8">
            <Button
              variant="ghost"
              size="sm"
              className="w-12 h-12 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg"
              onClick={() => {
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
            </Button>
          </div>
        </nav>
      </div>

      {/* Conteúdo Principal */}
      <div
        className={`transition-all duration-300 ${sidebarExpanded ? 'pl-64' : 'pl-16'} p-6`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            {/* Header */}
            <div className="mobile-section-spacing">
              <h1 className="page-title text-2xl font-bold text-holding-white">
                Gerenciamento de Usuários
              </h1>
              <p className="page-subtitle text-holding-blue-light">
                Gerencie usuários, permissões e níveis de acesso
              </p>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="holding-card stats-card">
                <div className="stats-card-icon">
                  <Users className="w-8 h-8 text-holding-blue-light" />
                </div>
                <div className="stats-card-text">
                  <div className="text-2xl font-bold text-holding-white">{usuarios.length}</div>
                  <div className="text-holding-blue-light">Total de Usuários</div>
                </div>
              </Card>
              <Card className="holding-card stats-card">
                <div className="stats-card-icon">
                  <Shield className="w-8 h-8 text-holding-blue-light" />
                </div>
                <div className="stats-card-text">
                  <div className="text-2xl font-bold text-holding-white">{usuarios.filter(u => u.ativo).length}</div>
                  <div className="text-holding-blue-light">Usuários Ativos</div>
                </div>
              </Card>
              <Card className="holding-card stats-card">
                <div className="stats-card-icon">
                  <UserCheck2 className="w-8 h-8 text-holding-blue-light" />
                </div>
                <div className="stats-card-text">
                  <div className="text-2xl font-bold text-holding-white">{usuarios.filter(u => u.aprovado).length}</div>
                  <div className="text-holding-blue-light">Usuários Aprovados</div>
                </div>
              </Card>
            </div>

          {/* Filtros */}
          <Card className="glass-effect-accent border-holding-accent/30 mb-6 md:mb-8">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
                <div className="flex-1 relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-holding-blue-light">
                    <div className="text-holding-blue-light">
                      <Search size={16} />
                    </div>
                  </div>
                  <Input
                    type="text"
                    placeholder="Buscar usuários por nome, email ou perfil..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-12 py-3 bg-holding-blue-profound/60 border-holding-blue-light/30 text-holding-white placeholder:text-holding-blue-light/70 focus:border-holding-blue-light focus:ring-holding-blue-light/20"
                  />
                </div>
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="text-holding-blue-light">
                    <div className="text-holding-blue-light">
                      <Filter size={16} />
                    </div>
                  </div>
                  <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="py-2 md:py-3 px-3 md:px-4 bg-holding-blue-profound/60 border border-holding-blue-light/30 text-holding-white rounded-md focus:outline-none focus:ring-2 focus:ring-holding-blue-light/50 text-sm md:text-base"
                  >
                    <option value="todos">Todos os Usuários</option>
                    <option value="ativo">Ativos</option>
                    <option value="inativo">Inativos</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Usuários */}
          <Card className="glass-effect-accent border-holding-accent/30">
            <CardHeader>
              <CardTitle className="text-xl text-holding-white flex items-center">
                <div className="text-holding-white mr-2">
                  <Users size={24} />
                </div>
                Usuários Aprovados
                <span className="text-holding-blue-light text-sm font-normal ml-3">
                  ({usuariosFiltrados.length} usuário
                  {usuariosFiltrados.length !== 1 ? 's' : ''})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-holding-blue-light/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-holding-blue-light animate-spin">
                      <div className="text-holding-blue-light">
                        <RefreshCw size={40} />
                      </div>
                    </div>
                  </div>
                  <p className="text-holding-blue-light text-lg font-medium mb-2">
                    Carregando usuários...
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-red-400">
                      <div className="text-red-400">
                        <AlertCircle size={40} />
                      </div>
                    </div>
                  </div>
                  <p className="text-red-400 text-lg font-medium mb-2">
                    {error}
                  </p>
                </div>
              ) : usuariosFiltrados.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-holding-blue-light/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-holding-blue-light">
                      <div className="text-holding-blue-light">
                        <Users size={40} />
                      </div>
                    </div>
                  </div>
                  <p className="text-holding-blue-light text-lg font-medium mb-2">
                    Nenhum usuário encontrado
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4">
                  {usuariosFiltrados.map(usuario => (
                    <Card
                      key={usuario.id}
                      className="bg-gradient-to-br from-holding-blue-profound/60 to-holding-blue-profound/40 border border-holding-blue-light/30 hover:border-holding-blue-light/50 transition-all duration-300 hover:shadow-lg hover:shadow-holding-blue-light/10 group"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-holding-blue-light/20 to-holding-blue-light/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            {getPerfilIcon(usuario.perfil_nome)}
                          </div>
                          {getStatusBadge(usuario)}
                        </div>

                        <div className="mb-3">
                          <h4 className="font-semibold text-holding-white text-lg mb-1">
                            {usuario.nome}
                          </h4>
                          <p className="text-holding-blue-light text-sm">
                            {usuario.email}
                          </p>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="w-4 h-4 bg-holding-blue-light/20 rounded flex items-center justify-center">
                              <div className="text-holding-blue-light">
                                <div className="text-holding-blue-light">
                                  <UserCheck2 size={12} />
                                </div>
                              </div>
                            </div>
                            <span className="text-holding-blue-light">
                              Perfil:
                            </span>
                            <span className="text-holding-white font-medium">
                              {usuario.perfil_nome || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="w-4 h-4 bg-holding-blue-light/20 rounded flex items-center justify-center">
                              <div className="text-holding-blue-light">
                                <div className="text-holding-blue-light">
                                  <Calendar size={12} />
                                </div>
                              </div>
                            </div>
                            <span className="text-holding-blue-light">
                              Cadastro:
                            </span>
                            <span className="text-holding-white font-medium">
                              {formatarData(usuario.data_cadastro)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <div className="w-4 h-4 bg-holding-blue-light/20 rounded flex items-center justify-center">
                              <div className="text-holding-blue-light">
                                <div className="text-holding-blue-light">
                                  <Shield size={12} />
                                </div>
                              </div>
                            </div>
                            <span className="text-holding-blue-light">
                              Nível:
                            </span>
                            <span className="text-holding-white font-medium">
                              {usuario.tipos_acesso?.nivel || 'N/A'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-holding-blue-light/20">
                          <div className="flex items-center space-x-2">
                            {temPermissao('usuarios', 'visualizar') && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  alert(`Visualizando usuário: ${usuario.nome}`)
                                }
                                className="w-8 h-8 p-0 border-holding-blue-light/30 text-holding-blue-light hover:bg-holding-blue-light/20 hover:border-holding-blue-light/50 hover:scale-110 transition-all duration-200 rounded-lg"
                                title="Visualizar"
                              >
                                <div className="text-holding-blue-light">
                                  <div className="text-holding-blue-light">
                                    <Eye size={16} />
                                  </div>
                                </div>
                              </Button>
                            )}

                            {temPermissao('usuarios', 'editar') && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  alert(`Editando usuário: ${usuario.nome}`)
                                }
                                className="w-8 h-8 p-0 border-blue-400/30 text-blue-400 hover:bg-blue-400/20 hover:border-blue-400/50 hover:scale-110 transition-all duration-200 rounded-lg"
                                title="Editar Usuário"
                              >
                                <div className="text-blue-400">
                                  <div className="text-blue-400">
                                    <Edit size={16} />
                                  </div>
                                </div>
                              </Button>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            {temPermissao('usuarios', 'excluir') && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  if (
                                    confirm(
                                      `Tem certeza que deseja excluir o usuário "${usuario.nome}"?`
                                    )
                                  ) {
                                    alert(`Excluindo usuário: ${usuario.nome}`);
                                  }
                                }}
                                className="w-8 h-8 p-0 border-red-400/30 text-red-400 hover:bg-red-400/20 hover:border-red-400/50 hover:scale-110 transition-all duration-200 rounded-lg"
                                title="Excluir Usuário"
                              >
                                <div className="text-red-400">
                                  <div className="text-red-400">
                                    <Trash2 size={16} />
                                  </div>
                                </div>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações de Permissões */}
          <Card className="glass-effect-accent border-holding-accent/30 mt-8">
            <CardHeader>
              <CardTitle className="text-xl text-holding-white flex items-center">
                <div className="text-holding-white mr-2">
                  <Shield size={24} />
                </div>
                Suas Permissões no Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {Object.entries(permissoes).map(([categoria, perms]) => (
                  <div
                    key={categoria}
                    className="p-4 bg-holding-blue-profound/40 rounded-lg border border-holding-blue-light/20"
                  >
                    <h4 className="font-semibold text-holding-white mb-3 flex items-center gap-2">
                      {categoria === 'usuarios' && (
                        <div className="text-holding-white">
                          <Users size={16} />
                        </div>
                      )}
                      {categoria === 'cadastros' && (
                        <div className="text-holding-white">
                          <Building2 size={16} />
                        </div>
                      )}
                      {categoria === 'dashboard' && (
                        <div className="text-holding-white">
                          <BarChart3 size={16} />
                        </div>
                      )}
                      {categoria === 'relatorios' && (
                        <div className="text-holding-white">
                          <BarChart size={16} />
                        </div>
                      )}
                      {categoria === 'sistema' && (
                        <div className="text-holding-white">
                          <Cog size={16} />
                        </div>
                      )}
                      {categoria === 'financeiro' && (
                        <div className="text-holding-white">
                          <CreditCard size={16} />
                        </div>
                      )}
                      {categoria === 'marketing' && (
                        <div className="text-holding-white">
                          <TrendingUp size={16} />
                        </div>
                      )}
                      {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                    </h4>
                    <div className="space-y-2">
                      {perms.map(permissao => (
                        <div
                          key={permissao.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-holding-blue-light">
                            {permissao.acao}:
                          </span>
                          <span className="text-holding-white">
                            {permissao.nome}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
