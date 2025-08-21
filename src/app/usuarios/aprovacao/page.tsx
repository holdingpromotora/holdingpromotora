'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Shield,
  User,
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import {
  UsuariosService,
  type Usuario,
  type FiltroUsuarios,
} from '@/lib/usuarios-service';

export default function AprovacaoPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [estatisticas, setEstatisticas] = useState({
    total: 0,
    aprovados: 0,
    pendentes: 0,
    rejeitados: 0,
    ativos: 0,
    inativos: 0,
  });

  // Estado para controlar a sidebar (simulado)
  const [sidebarExpanded] = useState(false);

  const carregarUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let filtros: FiltroUsuarios = {
        searchTerm,
      };

      if (filterStatus === 'pendente') {
        filtros.aprovado = false;
        filtros.ativo = false;
      } else if (filterStatus === 'aprovado') {
        filtros.aprovado = true;
        filtros.ativo = true;
      } else if (filterStatus === 'rejeitado') {
        filtros.aprovado = true;
        filtros.ativo = false;
      } else if (filterStatus === 'todos') {
        // No specific filters for 'todos'
      }

      const usuariosData = await UsuariosService.buscarUsuarios(filtros);
      setUsuarios(usuariosData);

      const stats = await UsuariosService.buscarEstatisticas();
      setEstatisticas(stats);
    } catch (err) {
      setError('Erro ao carregar usuários do banco de dados');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterStatus]);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const getPerfilIcon = (perfilNome: string) => {
    switch (perfilNome?.toLowerCase()) {
      case 'submaster':
        return <Shield className="w-4 h-4 text-blue-400" />;
      case 'visualizador':
        return <Eye className="w-4 h-4 text-green-400" />;
      case 'operador':
        return <User className="w-4 h-4 text-yellow-400" />;
      case 'parceiro':
        return <Users className="w-4 h-4 text-purple-400" />;
      default:
        return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (
    status: string | undefined,
    aprovado: boolean | undefined,
    ativo: boolean | undefined
  ) => {
    if (status === 'pendente' || (!aprovado && !ativo)) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Pendente
        </span>
      );
    } else if (status === 'aprovado' || (aprovado && ativo)) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Aprovado
        </span>
      );
    } else if (status === 'rejeitado' || (aprovado && !ativo)) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Rejeitado
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status || 'N/A'}
        </span>
      );
    }
  };

  const formatarData = (data: string | Date) => {
    if (!data) return 'N/A';
    const dataObj = new Date(data);
    return dataObj.toLocaleDateString('pt-BR');
  };

  const handleAprovarUsuario = async (usuario: Usuario) => {
    try {
      // Simular aprovação (implementar quando a função estiver disponível)
      console.log('Aprovando usuário:', usuario.id);
      await carregarUsuarios();
      setError(null);
    } catch (err) {
      setError('Erro ao aprovar usuário');
    }
  };

  const handleRejeitarUsuario = async (usuario: Usuario) => {
    try {
      // Simular rejeição (implementar quando a função estiver disponível)
      console.log('Rejeitando usuário:', usuario.id);
      await carregarUsuarios();
      setError(null);
    } catch (err) {
      setError('Erro ao rejeitar usuário');
    }
  };

  const handleExcluirUsuario = async (id: number) => {
    try {
      // Simular exclusão (implementar quando a função estiver disponível)
      console.log('Excluindo usuário:', id);
      await carregarUsuarios();
      setError(null);
    } catch (err) {
      setError('Erro ao excluir usuário');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Conteúdo Principal */}
      <div
        className={`transition-all duration-300 ${sidebarExpanded ? 'pl-80' : 'pl-24'} p-8 space-y-8`}
      >
        {/* Header */}
        <div className="holding-fade-in">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold text-holding-white mb-4">
                Aprovação de Usuários
              </h1>
              <p className="text-xl text-holding-blue-light">
                Gerencie solicitações de acesso ao sistema
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push('/usuarios')}
                className="bg-holding-blue-light hover:bg-holding-blue-light/80 text-holding-white px-6 py-2"
              >
                <Users className="w-4 h-4 mr-2" />
                Gerenciar Usuários
              </Button>
              <Button
                onClick={() => router.push('/usuarios/niveis-acesso')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              >
                <Shield className="w-4 h-4 mr-2" />
                Níveis de Acesso
              </Button>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <Card
            className={`bg-gray-800 border-gray-700 cursor-pointer transition-all hover:bg-gray-700 ${
              filterStatus === 'todos' ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => {
              setFilterStatus('todos');
              setSearchTerm('');
              carregarUsuarios();
            }}
          >
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">
                    {estatisticas.total}
                  </p>
                  <p className="text-blue-300 text-sm">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`bg-gray-800 border-gray-700 cursor-pointer transition-all hover:bg-gray-700 ${
              filterStatus === 'pendente' ? 'ring-2 ring-yellow-500' : ''
            }`}
            onClick={() => {
              setFilterStatus('pendente');
              setSearchTerm('');
              carregarUsuarios();
            }}
          >
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">
                    {estatisticas.pendentes}
                  </p>
                  <p className="text-yellow-300 text-sm">Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`bg-gray-800 border-gray-700 cursor-pointer transition-all hover:bg-gray-700 ${
              filterStatus === 'aprovado' ? 'ring-2 ring-green-500' : ''
            }`}
            onClick={() => {
              setFilterStatus('aprovado');
              setSearchTerm('');
              carregarUsuarios();
            }}
          >
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">
                    {estatisticas.aprovados}
                  </p>
                  <p className="text-green-300 text-sm">Aprovados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`bg-gray-800 border-gray-700 cursor-pointer transition-all hover:bg-gray-700 ${
              filterStatus === 'rejeitado' ? 'ring-2 ring-red-500' : ''
            }`}
            onClick={() => {
              setFilterStatus('rejeitado');
              setSearchTerm('');
              carregarUsuarios();
            }}
          >
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">
                    {estatisticas.rejeitados}
                  </p>
                  <p className="text-red-300 text-sm">Rejeitados</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                onChange={e => {
                  setFilterStatus(e.target.value);
                  carregarUsuarios();
                }}
                className="holding-input py-3 px-4"
              >
                <option value="todos">Todos os Usuários</option>
                <option value="pendente">Pendentes</option>
                <option value="aprovado">Aprovados</option>
                <option value="rejeitado">Rejeitados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Usuários */}
        <Card className="holding-card">
          <CardHeader className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-6">
                <h3 className="text-xl font-semibold text-holding-white">
                  {filterStatus === 'todos'
                    ? 'Todos os Usuários'
                    : filterStatus === 'pendente'
                      ? 'Usuários Pendentes'
                      : filterStatus === 'aprovado'
                        ? 'Usuários Aprovados'
                        : 'Usuários Rejeitados'}
                </h3>
                <span className="text-holding-blue-light text-sm font-normal">
                  ({usuarios.length} usuário
                  {usuarios.length !== 1 ? 's' : ''})
                </span>
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
              </div>
            </div>
            <CardTitle className="text-holding-white flex items-center space-x-3">
              <Users className="w-6 h-6 text-holding-blue-light" />
              <span>
                {filterStatus === 'todos'
                  ? 'Todos os Usuários'
                  : filterStatus === 'pendente'
                    ? 'Usuários Pendentes'
                    : filterStatus === 'aprovado'
                      ? 'Usuários Aprovados'
                      : 'Usuários Rejeitados'}
              </span>
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
                                  onClick={() => handleAprovarUsuario(user)}
                                  title="Aprovar Usuário"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-10 h-10 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                  onClick={() => handleRejeitarUsuario(user)}
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
      </div>
    </div>
  );
}
