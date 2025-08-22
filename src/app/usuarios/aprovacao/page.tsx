'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Shield,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  Edit,
  Mail,
  Calendar,
  UserCheck2,
  UserCheck,
} from 'lucide-react';
import {
  UsuariosService,
  type Usuario,
  type FiltroUsuarios,
} from '@/lib/usuarios-service';
import { supabase } from '@/lib/supabase';

interface TipoAcesso {
  id: number;
  nome: string;
  descricao: string;
  nivel: number;
  cor: string;
  icone: string;
}

interface UsuarioEditavel {
  id: number;
  nome: string;
  email: string;
  tipo_acesso_id: number;
  ativo: boolean;
}

export default function AprovacaoPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [tiposAcesso, setTiposAcesso] = useState<TipoAcesso[]>([]);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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

  const [sidebarExpanded] = useState(false);
  const [perfisSelecionados, setPerfisSelecionados] = useState<{
    [key: number]: number;
  }>({});
  const [editingUser, setEditingUser] = useState<UsuarioEditavel | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [viewingUser, setViewingUser] = useState<Usuario | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const carregarTiposAcesso = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('tipos_acesso')
        .select('id, nome, descricao, nivel, cor, icone')
        .order('nivel', { ascending: false });

      if (error) {
        console.error('Erro ao carregar tipos de acesso:', error);
        return;
      }

      setTiposAcesso(data || []);
    } catch (err) {
      console.error('Erro ao carregar tipos de acesso:', err);
    }
  }, []);

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
      }

      const usuariosData = await UsuariosService.buscarUsuarios(filtros);

      // Ordenar com pendentes primeiro
      const usuariosOrdenados = usuariosData.sort((a, b) => {
        // Primeiro critério: status pendente primeiro
        const statusA = a.status === 'pendente' || (!a.aprovado && !a.ativo);
        const statusB = b.status === 'pendente' || (!b.aprovado && !b.ativo);

        if (statusA && !statusB) return -1;
        if (!statusA && statusB) return 1;

        // Segundo critério: data de cadastro (mais recente primeiro)
        const dataA = new Date(a.data_cadastro || '').getTime();
        const dataB = new Date(b.data_cadastro || '').getTime();
        return dataB - dataA;
      });

      setUsuarios(usuariosOrdenados);

      const stats = await UsuariosService.buscarEstatisticas();
      setEstatisticas(stats);
    } catch (err) {
      setError('Erro ao carregar usuários do banco de dados');
    } finally {
      setLoading(false);
      setInitializing(false);
    }
  }, [searchTerm, filterStatus]);

  useEffect(() => {
    const inicializar = async () => {
      try {
        setInitializing(true);
        await carregarTiposAcesso();
        await carregarUsuarios();
      } catch (err) {
        console.error('Erro na inicialização:', err);
        setError('Erro ao inicializar o sistema');
      } finally {
        setInitializing(false);
      }
    };

    inicializar();
  }, [carregarTiposAcesso, carregarUsuarios]);

  useEffect(() => {
    if (!initializing) {
      carregarUsuarios();
    }
  }, [searchTerm, filterStatus, carregarUsuarios, initializing]);

  const getPerfilIcon = (perfilNome: string) => {
    switch (perfilNome?.toLowerCase()) {
      case 'submaster':
        return <Shield size={16} />;
      case 'visualizador':
        return <Eye size={16} />;
      case 'operador':
        return <User size={16} />;
      case 'parceiro':
        return <Users size={16} />;
      default:
        return <User size={16} />;
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

  const handlePerfilChange = (usuarioId: number, tipoAcessoId: string) => {
    setPerfisSelecionados(prev => ({
      ...prev,
      [usuarioId]: parseInt(tipoAcessoId),
    }));
  };

  const handleViewUser = (usuario: Usuario) => {
    setViewingUser(usuario);
    setIsViewModalOpen(true);
  };

  const handleEditUser = async (usuario: Usuario) => {
    try {
      console.log('🔄 Iniciando edição do usuário:', usuario);

      // Verificar se é pessoa física ou jurídica baseado no email
      let isPessoaJuridica = false;

      // Tentar buscar dados de pessoa jurídica pelo email
      const { data: pjData, error: pjError } = await supabase
        .from('pessoas_juridicas')
        .select('id')
        .eq('proprietario_email', usuario.email)
        .single();

      if (pjData && !pjError) {
        isPessoaJuridica = true;
        console.log('🔍 Tipo de pessoa detectado: Jurídica');
      } else {
        // Se não for PJ, assume PF
        isPessoaJuridica = false;
        console.log('🔍 Tipo de pessoa detectado: Física');
      }

      // Redirecionar para o formulário apropriado
      if (isPessoaJuridica) {
        console.log('🚀 Redirecionando para formulário PJ');
        router.push(`/usuarios/cadastro-pj?edit=${usuario.id}`);
      } else {
        console.log('🚀 Redirecionando para formulário PF');
        router.push(`/usuarios/cadastro-pf?edit=${usuario.id}`);
      }
    } catch (err) {
      console.error('❌ Erro ao determinar tipo de pessoa:', err);
      // Em caso de erro, assume pessoa física e redireciona
      console.log('🚀 Redirecionando para formulário PF (fallback)');
      router.push(`/usuarios/cadastro-pf?edit=${usuario.id}`);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      setEditLoading(true);
      setError(null);

      console.log('🔄 Iniciando edição do usuário:', editingUser);

      // Buscar o nome do tipo de acesso selecionado
      const tipoAcessoSelecionado = tiposAcesso.find(
        tipo => tipo.id === editingUser.tipo_acesso_id
      );

      console.log('📋 Tipo de acesso selecionado:', tipoAcessoSelecionado);

      const updateData = {
        nome: editingUser.nome,
        email: editingUser.email,
        tipo_acesso_id: editingUser.tipo_acesso_id,
        perfil_nome: tipoAcessoSelecionado?.nome || 'N/A',
        ativo: editingUser.ativo,
      };

      console.log('📝 Dados para atualização:', updateData);

      const { data, error } = await supabase
        .from('usuarios')
        .update(updateData)
        .eq('id', editingUser.id)
        .select();

      console.log('📊 Resposta do Supabase:', { data, error });

      if (error) {
        console.error('❌ Erro do Supabase:', error);
        throw error;
      }

      // Atualizar o usuário na lista local imediatamente
      const usuarioAtualizado = {
        ...editingUser,
        perfil_id: editingUser.tipo_acesso_id,
        perfil_nome: tipoAcessoSelecionado?.nome || 'N/A',
        ativo: editingUser.ativo,
        status: editingUser.ativo ? 'aprovado' : 'rejeitado',
      };

      console.log('🔄 Usuário atualizado localmente:', usuarioAtualizado);

      setUsuarios(prev => {
        const novaLista = prev.map(user =>
          user.id === editingUser.id
            ? {
                ...user,
                nome: editingUser.nome,
                email: editingUser.email,
                perfil_id: editingUser.tipo_acesso_id,
                perfil_nome: tipoAcessoSelecionado?.nome || 'N/A',
                ativo: editingUser.ativo,
                status: editingUser.ativo
                  ? ('aprovado' as const)
                  : ('rejeitado' as const),
              }
            : user
        );

        console.log('📝 Nova lista de usuários:', novaLista);
        return novaLista;
      });

      setIsEditModalOpen(false);
      setEditingUser(null);

      setSuccess('Usuário atualizado com sucesso!');
      setTimeout(() => setSuccess(null), 3000);

      // Não recarregar dados para manter as atualizações locais
      // await carregarUsuarios();
    } catch (err) {
      console.error('Erro ao editar usuário:', err);
      setError('Erro ao editar usuário. Tente novamente.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
    setError(null);
  };

  const handleAprovarUsuario = async (
    usuario: Usuario,
    tipoAcessoId: number
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Buscar o nome do tipo de acesso selecionado
      const tipoAcessoSelecionado = tiposAcesso.find(
        tipo => tipo.id === tipoAcessoId
      );

      const { error } = await supabase
        .from('usuarios')
        .update({
          aprovado: true,
          ativo: true,
          tipo_acesso_id: tipoAcessoId,
          perfil_nome: tipoAcessoSelecionado?.nome || 'N/A',
          data_aprovacao: new Date().toISOString(),
        })
        .eq('id', usuario.id);

      if (error) {
        throw error;
      }

      await carregarUsuarios();
      setSuccess(`Usuário ${usuario.nome} aprovado com sucesso!`);
      setTimeout(() => setSuccess(null), 3000);

      setPerfisSelecionados(prev => {
        const newState = { ...prev };
        delete newState[usuario.id];
        return newState;
      });
    } catch (err) {
      console.error('Erro ao aprovar usuário:', err);
      setError('Erro ao aprovar usuário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleRejeitarUsuario = async (usuario: Usuario) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('usuarios')
        .update({
          aprovado: true,
          ativo: false,
          data_aprovacao: new Date().toISOString(),
        })
        .eq('id', usuario.id);

      if (error) {
        throw error;
      }

      await carregarUsuarios();
      setSuccess(`Usuário ${usuario.nome} rejeitado.`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Erro ao rejeitar usuário:', err);
      setError('Erro ao rejeitar usuário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirUsuario = async (id: number, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário "${nome}"?`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.from('usuarios').delete().eq('id', id);

      if (error) {
        throw error;
      }

      await carregarUsuarios();
      setSuccess(`Usuário ${nome} excluído com sucesso!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Erro ao excluir usuário:', err);
      setError('Erro ao excluir usuário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-holding-blue-deep via-holding-blue-dark to-holding-blue-profound">
      <div
        className={`transition-all duration-300 ${sidebarExpanded ? 'pl-80' : 'pl-24'} p-8 space-y-8`}
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-holding-white mb-2">
            Aprovação de Usuários
          </h1>
          <p className="text-holding-blue-light mb-6">
            Gerencie aprovações e status dos usuários do sistema
          </p>

          {/* Botões de Ação */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => router.push('/usuarios')}
              className="bg-gradient-to-r from-holding-blue-light to-holding-blue-medium hover:from-holding-blue-medium hover:to-holding-blue-light text-holding-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 font-semibold"
            >
              <Users size={18} className="mr-3" />
              Gerenciar Usuários
            </Button>
            <Button
              onClick={() => router.push('/usuarios/niveis-acesso')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 font-semibold"
            >
              <Shield size={18} className="mr-3" />
              Níveis de Acesso
            </Button>
          </div>
        </div>

        {/* Mensagens */}
        {success && (
          <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-holding-blue-medium/20 to-holding-blue-light/10 border-holding-blue-light/30 hover:from-holding-blue-medium/30 hover:to-holding-blue-light/20 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <CardContent className="p-6 relative">
              {/* Ícone no canto superior esquerdo */}
              <div className="absolute top-4 left-4 p-2 bg-holding-blue-light/20 rounded-lg">
                <Users size={24} className="text-holding-blue-light" />
              </div>

              {/* Número no canto superior direito */}
              <div className="absolute top-4 right-4 text-4xl font-bold text-holding-white">
                {estatisticas.total}
              </div>

              {/* Título abaixo do ícone */}
              <div className="mt-16 mb-2">
                <h3 className="text-lg text-holding-blue-light font-medium">
                  Total de Usuários
                </h3>
              </div>

              {/* Descrição */}
              <p className="text-holding-blue-light/70 text-sm">Total</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-holding-blue-medium/20 to-holding-blue-light/10 border-holding-blue-light/30 hover:from-holding-blue-medium/30 hover:to-holding-blue-light/20 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <CardContent className="p-6 relative">
              {/* Ícone no canto superior esquerdo */}
              <div className="absolute top-4 left-4 p-2 bg-green-500/20 rounded-lg">
                <Shield size={24} className="text-green-400" />
              </div>

              {/* Número no canto superior direito */}
              <div className="absolute top-4 right-4 text-4xl font-bold text-holding-white">
                {estatisticas.ativos}
              </div>

              {/* Título abaixo do ícone */}
              <div className="mt-16 mb-2">
                <h3 className="text-lg text-holding-blue-light font-medium">
                  Usuários Ativos
                </h3>
              </div>

              {/* Descrição */}
              <p className="text-green-400 text-sm">Ativos</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-holding-blue-medium/20 to-holding-blue-light/10 border-holding-blue-light/30 hover:from-holding-blue-medium/30 hover:to-holding-blue-light/20 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <CardContent className="p-6 relative">
              {/* Ícone no canto superior esquerdo */}
              <div className="absolute top-4 left-4 p-2 bg-purple-500/20 rounded-lg">
                <CheckCircle size={24} className="text-purple-400" />
              </div>

              {/* Número no canto superior direito */}
              <div className="absolute top-4 right-4 text-4xl font-bold text-holding-white">
                {estatisticas.aprovados}
              </div>

              {/* Título abaixo do ícone */}
              <div className="mt-16 mb-2">
                <h3 className="text-lg text-holding-blue-light font-medium">
                  Usuários Aprovados
                </h3>
              </div>

              {/* Descrição */}
              <p className="text-purple-400 text-sm">Aprovados</p>
            </CardContent>
          </Card>
        </div>

        {/* Pesquisa e Filtros */}
        <Card className="bg-gradient-to-r from-holding-blue-deep/20 to-holding-blue-dark/20 border-holding-blue-light/30 hover:from-holding-blue-deep/30 hover:to-holding-blue-dark/30 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-holding-blue-light">
                  <Search size={18} />
                </div>
                <Input
                  type="text"
                  placeholder="Buscar usuários por nome ou email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-14 py-4 bg-holding-blue-profound/80 border-holding-blue-light/40 text-holding-white placeholder:text-holding-blue-light/60 focus:border-holding-blue-light focus:ring-2 focus:ring-holding-blue-light/30 focus:bg-holding-blue-profound/90 transition-all duration-300 rounded-xl text-base"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-holding-blue-light">
                  <Filter size={18} />
                  <span className="text-sm font-medium">Filtrar por:</span>
                </div>
                <select
                  value={filterStatus}
                  onChange={e => {
                    setFilterStatus(e.target.value);
                  }}
                  className="py-4 px-6 bg-holding-blue-profound/80 border border-holding-blue-light/40 text-holding-white rounded-xl focus:outline-none focus:ring-2 focus:ring-holding-blue-light/30 focus:border-holding-blue-light transition-all duration-300 text-base font-medium cursor-pointer hover:bg-holding-blue-profound/90"
                >
                  <option value="todos">Todos os Usuários</option>
                  <option value="pendente">Pendentes</option>
                  <option value="aprovado">Aprovados</option>
                  <option value="rejeitado">Rejeitados</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Usuários */}
        <Card className="bg-gradient-to-br from-holding-blue-deep/20 to-holding-blue-dark/20 border-holding-blue-light/30 hover:from-holding-blue-deep/30 hover:to-holding-blue-dark/30 transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-holding-blue-deep/40 to-holding-blue-dark/40 border-b border-holding-blue-light/30 py-6">
            <CardTitle className="text-2xl text-holding-white flex items-center space-x-3">
              <div className="p-2 bg-holding-blue-light/20 rounded-lg">
                <Users size={28} className="text-holding-blue-light" />
              </div>
              <div className="flex flex-col">
                <span>
                  {filterStatus === 'todos'
                    ? 'Todos os Usuários'
                    : filterStatus === 'pendente'
                      ? 'Usuários Pendentes'
                      : filterStatus === 'aprovado'
                        ? 'Usuários Aprovados'
                        : 'Usuários Rejeitados'}
                </span>
                <span className="text-holding-blue-light text-base font-normal mt-1">
                  {usuarios.length} usuário{usuarios.length !== 1 ? 's' : ''}{' '}
                  encontrado{usuarios.length !== 1 ? 's' : ''}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {initializing ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-holding-blue-light/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-holding-blue-light/50 animate-spin">
                    <RefreshCw size={40} />
                  </div>
                </div>
                <p className="text-holding-blue-light text-lg font-medium mb-2">
                  Inicializando sistema...
                </p>
                <p className="text-holding-blue-light/70 text-sm">
                  Carregando dados e configurações.
                </p>
              </div>
            ) : loading ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-holding-blue-light/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-holding-blue-light/50 animate-spin">
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
                  <div className="text-red-500/50">
                    <AlertCircle size={40} />
                  </div>
                </div>
                <p className="text-red-400 text-lg font-medium mb-2">{error}</p>
                <p className="text-red-400/70 text-sm">
                  Tente recarregar a página.
                </p>
              </div>
            ) : usuarios.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-holding-blue-light/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-holding-blue-light/50">
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
              <div className="space-y-6">
                {/* Usuários Pendentes */}
                {usuarios.filter(user => user.status === 'pendente').length >
                  0 && (
                  <div>
                    <h3 className="text-holding-blue-light text-lg font-semibold mb-4 flex items-center gap-2">
                      <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
                        <div className="text-yellow-500">
                          <Clock size={16} />
                        </div>
                      </div>
                      Usuários Pendentes (
                      {
                        usuarios.filter(user => user.status === 'pendente')
                          .length
                      }
                      )
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                      {usuarios
                        .filter(user => user.status === 'pendente')
                        .map(user => (
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
                                      <UserCheck2 size={12} />
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
                                      <Calendar size={12} />
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

                              {user.status === 'pendente' && (
                                <div className="mb-4">
                                  <div className="text-holding-blue-light text-sm font-medium mb-2 block">
                                    Perfil para Aprovação
                                  </div>
                                  <select
                                    value={perfisSelecionados[user.id] || ''}
                                    onChange={e =>
                                      handlePerfilChange(
                                        user.id,
                                        e.target.value
                                      )
                                    }
                                    className="w-full bg-holding-blue-profound/60 border border-holding-blue-light/30 text-holding-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-holding-blue-light/50 focus:border-holding-blue-light transition-all duration-200"
                                  >
                                    <option value="">Selecione o perfil</option>
                                    {tiposAcesso.map(tipo => (
                                      <option key={tipo.id} value={tipo.id}>
                                        {tipo.nome} (Nível {tipo.nivel})
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}

                              <div className="flex items-center justify-between pt-3 border-t border-holding-blue-light/20">
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleViewUser(user)}
                                    className="w-8 h-8 p-0 border-holding-blue-light/30 text-holding-blue-light hover:bg-holding-blue-light/20 hover:border-holding-blue-light/50 hover:scale-110 transition-all duration-200 rounded-lg"
                                    title="Visualizar"
                                  >
                                    <div className="text-holding-blue-light">
                                      <Eye size={16} />
                                    </div>
                                  </Button>

                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditUser(user)}
                                    className="w-8 h-8 p-0 border-blue-400/30 text-blue-400 hover:bg-blue-400/20 hover:border-blue-400/50 hover:scale-110 transition-all duration-200 rounded-lg"
                                    title="Editar Usuário"
                                  >
                                    <div className="text-blue-400">
                                      <Edit size={16} />
                                    </div>
                                  </Button>
                                </div>

                                <div className="flex items-center space-x-2">
                                  {user.status === 'pendente' && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          const perfilSelecionado =
                                            perfisSelecionados[user.id];
                                          if (perfilSelecionado) {
                                            handleAprovarUsuario(
                                              user,
                                              perfilSelecionado
                                            );
                                          } else {
                                            setError(
                                              'Selecione um perfil antes de aprovar o usuário'
                                            );
                                          }
                                        }}
                                        disabled={!perfisSelecionados[user.id]}
                                        className="w-8 h-8 p-0 border-green-400/30 text-green-400 hover:bg-green-400/20 hover:border-green-400/50 hover:scale-110 transition-all duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Aprovar Usuário"
                                      >
                                        <div className="text-green-400">
                                          <CheckCircle size={16} />
                                        </div>
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          handleRejeitarUsuario(user)
                                        }
                                        className="w-8 h-8 p-0 border-red-400/30 text-red-400 hover:bg-red-400/20 hover:border-red-400/50 hover:scale-110 transition-all duration-200 rounded-lg"
                                        title="Rejeitar Usuário"
                                      >
                                        <div className="text-red-400">
                                          <XCircle size={16} />
                                        </div>
                                      </Button>
                                    </>
                                  )}

                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleExcluirUsuario(user.id, user.nome)
                                    }
                                    className="w-8 h-8 p-0 border-red-400/30 text-red-400 hover:bg-red-400/20 hover:border-red-400/50 hover:scale-110 transition-all duration-200 rounded-lg"
                                    title="Excluir Usuário"
                                  >
                                    <div className="text-red-400">
                                      <Trash2 size={16} />
                                    </div>
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}

                {/* Usuários Aprovados */}
                {usuarios.filter(user => user.status !== 'pendente').length >
                  0 && (
                  <div>
                    <h3 className="text-holding-blue-light text-lg font-semibold mb-4 flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                        <div className="text-green-500">
                          <CheckCircle size={16} />
                        </div>
                      </div>
                      Usuários Aprovados (
                      {
                        usuarios.filter(user => user.status !== 'pendente')
                          .length
                      }
                      )
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                      {usuarios
                        .filter(user => user.status !== 'pendente')
                        .map(user => (
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
                                      <UserCheck2 size={12} />
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
                                      <Calendar size={12} />
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
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleViewUser(user)}
                                    className="w-8 h-8 p-0 border-holding-blue-light/30 text-holding-blue-light hover:bg-holding-blue-light/20 hover:border-holding-blue-light/50 hover:scale-110 transition-all duration-200 rounded-lg"
                                    title="Visualizar"
                                  >
                                    <div className="text-holding-blue-light">
                                      <Eye size={16} />
                                    </div>
                                  </Button>

                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditUser(user)}
                                    className="w-8 h-8 p-0 border-blue-400/30 text-blue-400 hover:bg-blue-400/20 hover:border-blue-400/50 hover:scale-110 transition-all duration-200 rounded-lg"
                                    title="Editar Usuário"
                                  >
                                    <div className="text-blue-400">
                                      <Edit size={16} />
                                    </div>
                                  </Button>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleExcluirUsuario(user.id, user.nome)
                                    }
                                    className="w-8 h-8 p-0 border-red-400/30 text-red-400 hover:bg-red-400/20 hover:border-red-400/50 hover:scale-110 transition-all duration-200 rounded-lg"
                                    title="Excluir Usuário"
                                  >
                                    <div className="text-red-400">
                                      <Trash2 size={16} />
                                    </div>
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de Visualização */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="bg-holding-blue-profound/95 border-holding-blue-light/30 text-holding-white max-w-md backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-holding-white">
                Detalhes do Usuário
              </DialogTitle>
            </DialogHeader>

            {viewingUser && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-holding-blue-light/20 to-holding-blue-light/10 rounded-xl flex items-center justify-center">
                    {getPerfilIcon(viewingUser.perfil_nome)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-holding-white text-lg">
                      {viewingUser.nome}
                    </h3>
                    <p className="text-holding-blue-light text-sm">
                      {viewingUser.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-holding-blue-light/20 rounded flex items-center justify-center">
                      <div className="text-holding-blue-light">
                        <UserCheck2 size={12} />
                      </div>
                    </div>
                    <span className="text-holding-blue-light">Perfil:</span>
                    <span className="text-holding-white">
                      {viewingUser.perfil_nome || 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-holding-blue-light/20 rounded flex items-center justify-center">
                      <div className="text-holding-blue-light">
                        <Calendar size={12} />
                      </div>
                    </div>
                    <span className="text-holding-blue-light">Cadastro:</span>
                    <span className="text-holding-white">
                      {formatarData(viewingUser.data_cadastro)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-holding-blue-light/20 rounded flex items-center justify-center">
                      <div className="text-holding-blue-light">
                        <Mail size={12} />
                      </div>
                    </div>
                    <span className="text-holding-blue-light">Status:</span>
                    {getStatusBadge(
                      viewingUser.status,
                      viewingUser.aprovado,
                      viewingUser.ativo
                    )}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                onClick={() => setIsViewModalOpen(false)}
                className="bg-holding-blue-light hover:bg-holding-blue-light/80 text-holding-white"
              >
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Edição */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="bg-holding-blue-profound/95 border-holding-blue-light/30 text-holding-white max-w-md backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-holding-white">
                Editar Usuário
              </DialogTitle>
            </DialogHeader>

            {editingUser && (
              <div className="space-y-4">
                <div>
                  <div className="text-holding-blue-light">Nome</div>
                  <Input
                    id="edit-nome"
                    value={editingUser.nome}
                    onChange={e =>
                      setEditingUser(prev => ({
                        ...prev!,
                        nome: e.target.value,
                      }))
                    }
                    className="bg-holding-blue-profound/60 border-holding-blue-light/30 text-holding-white focus:border-holding-blue-light focus:ring-holding-blue-light/20"
                  />
                </div>

                <div>
                  <div className="text-holding-blue-light">Email</div>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingUser.email}
                    onChange={e =>
                      setEditingUser(prev => ({
                        ...prev!,
                        email: e.target.value,
                      }))
                    }
                    className="bg-holding-blue-profound/60 border-holding-blue-light/30 text-holding-white focus:border-holding-blue-light focus:ring-holding-blue-light/20"
                  />
                </div>

                <div>
                  <div className="text-holding-blue-light">Perfil</div>
                  <select
                    id="edit-perfil"
                    value={editingUser.tipo_acesso_id}
                    onChange={e =>
                      setEditingUser(prev => ({
                        ...prev!,
                        tipo_acesso_id: parseInt(e.target.value),
                      }))
                    }
                    className="w-full bg-holding-blue-profound/60 border border-holding-blue-light/30 text-holding-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-holding-blue-light/50 focus:border-holding-blue-light transition-all duration-200"
                  >
                    {tiposAcesso.map(tipo => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nome} (Nível {tipo.nivel})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-ativo"
                    checked={editingUser.ativo}
                    onChange={e =>
                      setEditingUser(prev => ({
                        ...prev!,
                        ativo: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-holding-blue-light bg-holding-blue-profound/60 border-holding-blue-light/30 rounded focus:ring-holding-blue-light focus:ring-2"
                  />
                  <div className="text-holding-blue-light">Usuário Ativo</div>
                </div>
              </div>
            )}

            <DialogFooter className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="border-holding-blue-light/30 text-holding-blue-light hover:bg-holding-blue-light/20"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={editLoading}
                className="bg-holding-blue-light hover:bg-holding-blue-light/80 text-holding-white"
              >
                {editLoading ? (
                  <div className="mr-2 animate-spin">
                    <RefreshCw size={16} />
                  </div>
                ) : (
                  <div className="mr-2">
                    <Edit size={16} />
                  </div>
                )}
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
