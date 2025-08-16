'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
  AlertCircle,
  ArrowLeft,
  User,
  Filter,
  X,
} from 'lucide-react';
import Link from 'next/link';

interface TipoAcesso {
  id: number;
  nome: string;
  descricao: string | null;
  nivel: number;
  ativo: boolean;
  created_at: string;
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil_id: number | null;
  ativo: boolean;
  aprovado: boolean;
  rejeitado?: boolean; // Adicionando propriedade opcional
  data_cadastro: string;
  data_aprovacao?: string;
  aprovado_por?: string;
  ultimo_acesso?: string;
  tipo_pessoa: string;
  perfil_nome?: string;
}

export default function AprovacaoUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [perfis, setPerfis] = useState<TipoAcesso[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroAtivo, setFiltroAtivo] = useState<string>('ativos'); // Mostrar usuários ativos por padrão
  const [contagens, setContagens] = useState({
    total: 0,
    pendentes: 0,
    aprovados: 0,
    rejeitados: 0,
    ativos: 0,
  });

  // Estados para o modal de alerta
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error'>('success');
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  // Carregar dados existentes
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);

      // 1. Buscar todos os usuários
      const { data: usuariosData, error: usuariosError } = await supabase
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: false });

      if (usuariosError) {
        console.error('Erro ao carregar usuários:', usuariosError);
        console.error('Detalhes do erro:', {
          message: usuariosError.message,
          code: usuariosError.code,
          details: usuariosError.details,
        });
        return;
      }

      // 2. Buscar tipos de acesso (perfis)
      const { data: tiposAcessoData, error: tiposAcessoError } = await supabase
        .from('tipos_acesso')
        .select('*');

      if (tiposAcessoError) {
        console.error('Erro ao carregar tipos de acesso:', tiposAcessoError);
        console.error('Detalhes do erro:', {
          message: tiposAcessoError.message,
          code: tiposAcessoError.code,
          details: tiposAcessoError.details,
        });
        return;
      }

      // 3. Corrigir status de usuários pendentes (não podem estar ativos)
      let usuariosCorrigidos = usuariosData?.map(usuario => {
        // Se não foi aprovado nem rejeitado, deve estar inativo
        if (!usuario.aprovado && !usuario.rejeitado) {
          return { ...usuario, ativo: false };
        }
        return usuario;
      });

      // 4. Corrigir dados no banco se necessário
      const usuariosParaCorrigir =
        usuariosData?.filter(u => !u.aprovado && !u.rejeitado && u.ativo) || [];

      if (usuariosParaCorrigir.length > 0) {
        console.log('🔧 Corrigindo usuários pendentes que estão ativos...');

        for (const usuario of usuariosParaCorrigir) {
          const { error } = await supabase
            .from('usuarios')
            .update({ ativo: false })
            .eq('id', usuario.id);

          if (error) {
            console.error(`Erro ao corrigir usuário ${usuario.id}:`, error);
          } else {
            console.log(`✅ Usuário ${usuario.id} corrigido: ativo = false`);
          }
        }

        // Recarregar dados após correção
        const { data: usuariosCorrigidosDB, error: reloadError } =
          await supabase
            .from('usuarios')
            .select('*')
            .order('created_at', { ascending: false });

        if (!reloadError && usuariosCorrigidosDB) {
          // Aplicar correção local também
          usuariosCorrigidos = usuariosCorrigidosDB.map(usuario => {
            if (!usuario.aprovado && !usuario.rejeitado) {
              return { ...usuario, ativo: false };
            }
            return usuario;
          });
        }
      }

      // 5. Calcular contagens reais baseadas na lógica correta
      const total = usuariosCorrigidos?.length || 0;
      // Pendentes: não aprovados, não rejeitados e INATIVOS
      const pendentes =
        usuariosCorrigidos?.filter(u => !u.aprovado && !u.rejeitado && !u.ativo)
          ?.length || 0;
      // Aprovados: aprovados e ATIVOS (podem acessar o sistema)
      const aprovados =
        usuariosCorrigidos?.filter(u => u.aprovado && u.ativo)?.length || 0;
      // Rejeitados: rejeitados e INATIVOS
      const rejeitados =
        usuariosCorrigidos?.filter(u => u.rejeitado && !u.ativo)?.length || 0;
      // Ativos: usuários que podem acessar o sistema (aprovados e ativos)
      const ativos =
        usuariosCorrigidos?.filter(u => u.aprovado && u.ativo)?.length || 0;

      setContagens({ total, pendentes, aprovados, rejeitados, ativos });

      // 6. Determinar tipo de pessoa para cada usuário
      const usuariosComTipo = await Promise.all(
        (usuariosCorrigidos || []).map(async usuario => {
          let tipo_pessoa = 'Sistema';

          // Verificar se é pessoa jurídica
          const { data: pjData } = await supabase
            .from('pessoas_juridicas')
            .select('razao_social, cnpj')
            .eq('proprietario_email', usuario.email)
            .limit(1);

          if (pjData && pjData.length > 0) {
            tipo_pessoa = 'Jurídica';
          } else {
            // Verificar se é pessoa física
            const { data: pfData } = await supabase
              .from('pessoas_fisicas')
              .select('nome, cpf')
              .eq('email', usuario.email)
              .limit(1);

            if (pfData && pfData.length > 0) {
              tipo_pessoa = 'Física';
            }
          }

          return {
            ...usuario,
            tipo_pessoa,
          };
        })
      );

      setUsuarios(usuariosComTipo);
      setPerfis(tiposAcessoData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      if (error instanceof Error) {
        console.error('Mensagem do erro:', error.message);
        console.error('Stack trace:', error.stack);
      } else {
        console.error('Erro desconhecido:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para filtrar usuários baseado no card clicado
  const filtrarUsuarios = (filtro: string) => {
    setFiltroAtivo(filtro);
  };

  // Função para obter usuários filtrados
  const getUsuariosFiltrados = () => {
    switch (filtroAtivo) {
      case 'pendentes':
        // Pendentes: não aprovados, não rejeitados e INATIVOS
        return usuarios.filter(u => !u.aprovado && !u.rejeitado && !u.ativo);
      case 'aprovados':
        // Aprovados: aprovados e ATIVOS (podem acessar o sistema)
        return usuarios.filter(u => u.aprovado && u.ativo);
      case 'rejeitados':
        // Rejeitados: rejeitados e INATIVOS
        return usuarios.filter(u => u.rejeitado && !u.ativo);
      case 'ativos':
        // Ativos: usuários que podem acessar o sistema (aprovados e ativos)
        return usuarios.filter(u => u.aprovado && u.ativo);
      default:
        // Por padrão, mostrar usuários ativos (aprovados e ativos)
        return usuarios.filter(u => u.aprovado && u.ativo);
    }
  };

  const handleAprovarUsuario = async (usuarioId: number) => {
    try {
      const usuario = usuarios.find(u => u.id === usuarioId);
      if (!usuario) return;

      if (!usuario.perfil_id) {
        alert('Selecione um perfil de acesso antes de aprovar!');
        return;
      }

      // Aprovar usuário: aprovado = true, ativo = true
      const updateData: {
        aprovado: boolean;
        ativo: boolean;
        data_aprovacao: string;
        aprovado_por: string;
        rejeitado?: boolean;
      } = {
        aprovado: true,
        ativo: true, // Usuário aprovado fica ativo e pode acessar o sistema
        data_aprovacao: new Date().toISOString(),
        aprovado_por: 'Sistema', // Será atualizado quando implementar autenticação
      };

      // Verificar se a coluna rejeitado existe antes de usá-la
      if (usuario.hasOwnProperty('rejeitado')) {
        updateData.rejeitado = false;
      }

      const { error } = await supabase
        .from('usuarios')
        .update(updateData)
        .eq('id', usuarioId);

      if (error) {
        console.error('Erro ao aprovar usuário:', error);
        throw new Error(`Erro ao aprovar usuário: ${error.message}`);
      }

      // Atualizar estado local
      setUsuarios(prev =>
        prev.map(u =>
          u.id === usuarioId
            ? { ...u, aprovado: true, ativo: true, rejeitado: false }
            : u
        )
      );

      // Recarregar contagens
      await carregarDados();

      // Mostrar alerta de sucesso melhorado
      showSuccessAlert(
        'Usuário aprovado com sucesso! Agora ele pode acessar o sistema via login.'
      );
    } catch (error) {
      console.error('Erro ao aprovar usuário:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erro desconhecido ao aprovar usuário';
      showErrorAlert(`Erro ao aprovar usuário: ${errorMessage}`);
    }
  };

  const handleRejeitarUsuario = async (usuarioId: number) => {
    try {
      // Rejeitar usuário: aprovado = false, ativo = false
      const updateData: {
        aprovado: boolean;
        ativo: boolean;
        data_aprovacao: null;
        aprovado_por: null;
        rejeitado?: boolean;
      } = {
        aprovado: false,
        ativo: false, // Usuário rejeitado fica inativo e não pode acessar o sistema
        data_aprovacao: null,
        aprovado_por: null,
      };

      // Verificar se a coluna rejeitado existe antes de usá-la
      const usuario = usuarios.find(u => u.id === usuarioId);
      if (usuario && usuario.hasOwnProperty('rejeitado')) {
        updateData.rejeitado = true;
      }

      const { error } = await supabase
        .from('usuarios')
        .update(updateData)
        .eq('id', usuarioId);

      if (error) {
        console.error('Erro ao rejeitar usuário:', error);
        throw new Error(`Erro ao rejeitar usuário: ${error.message}`);
      }

      // Atualizar estado local
      setUsuarios(prev =>
        prev.map(u =>
          u.id === usuarioId
            ? { ...u, aprovado: false, ativo: false, rejeitado: true }
            : u
        )
      );

      // Recarregar contagens
      await carregarDados();

      // Mostrar alerta de sucesso melhorado
      showSuccessAlert(
        'Usuário rejeitado com sucesso! Ele não poderá acessar o sistema.'
      );
    } catch (error) {
      console.error('Erro ao rejeitar usuário:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erro desconhecido ao rejeitar usuário';
      showErrorAlert(`Erro ao rejeitar usuário: ${errorMessage}`);
    }
  };

  // Funções de alerta melhoradas
  const showSuccessAlert = (message: string) => {
    setModalType('success');
    setModalTitle('Sucesso!');
    setModalMessage(message);
    setShowModal(true);
  };

  const showErrorAlert = (message: string) => {
    setModalType('error');
    setModalTitle('Erro!');
    setModalMessage(message);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalMessage('');
    setModalTitle('');
  };

  const handleAlterarPerfil = async (usuarioId: number, perfilId: string) => {
    try {
      const perfilIdNum = perfilId ? parseInt(perfilId) : null;

      const { error } = await supabase
        .from('usuarios')
        .update({ perfil_id: perfilIdNum })
        .eq('id', usuarioId);

      if (error) {
        console.error('Erro ao alterar perfil:', error);
        throw new Error(`Erro ao alterar perfil: ${error.message}`);
      }

      // Atualizar estado local
      setUsuarios(prev =>
        prev.map(u =>
          u.id === usuarioId ? { ...u, perfil_id: perfilIdNum } : u
        )
      );

      showSuccessAlert('Perfil alterado com sucesso!');
    } catch (error) {
      console.error('Erro ao alterar perfil:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erro desconhecido ao alterar perfil';
      showErrorAlert(`Erro ao alterar perfil: ${errorMessage}`);
    }
  };

  const estatisticas = {
    total: usuarios.length,
  };

  if (loading) {
    return (
      <div className="min-h-screen holding-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-holding-accent mx-auto"></div>
          <p className="mt-4 text-holding-white text-lg">
            Carregando usuários...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen holding-gradient">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-holding-white mb-3">
                  Aprovação de Usuários Pendentes
                </h1>
                <p className="text-holding-accent-light text-lg">
                  Aprove ou rejeite usuários que aguardam aprovação para acessar
                  o sistema
                </p>
              </div>
              <Link href="/usuarios">
                <Button
                  variant="outline"
                  className="border-holding-accent-light text-holding-accent-light hover:bg-holding-accent/20"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar aos Usuários
                </Button>
              </Link>
            </div>
          </div>

          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Total de Usuários */}
            <Card
              className={`cursor-pointer transition-all hover:shadow-lg ${
                filtroAtivo === 'todos' ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => filtrarUsuarios('todos')}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total de Usuários
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      {contagens.total}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            {/* Pendentes */}
            <Card
              className={`cursor-pointer transition-all hover:shadow-lg ${
                filtroAtivo === 'pendentes' ? 'ring-2 ring-yellow-500' : ''
              }`}
              onClick={() => filtrarUsuarios('pendentes')}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Pendentes
                    </p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {contagens.pendentes}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            {/* Aprovados */}
            <Card
              className={`cursor-pointer transition-all hover:shadow-lg ${
                filtroAtivo === 'aprovados' ? 'ring-2 ring-green-500' : ''
              }`}
              onClick={() => filtrarUsuarios('aprovados')}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Aprovados
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      {contagens.aprovados}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            {/* Rejeitados */}
            <Card
              className={`cursor-pointer transition-all hover:shadow-lg ${
                filtroAtivo === 'rejeitados' ? 'ring-2 ring-red-500' : ''
              }`}
              onClick={() => filtrarUsuarios('rejeitados')}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Rejeitados
                    </p>
                    <p className="text-3xl font-bold text-red-600">
                      {contagens.rejeitados}
                    </p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            {/* Ativos */}
            <Card
              className={`cursor-pointer transition-all hover:shadow-lg ${
                filtroAtivo === 'ativos' ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => filtrarUsuarios('ativos')}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ativos</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {contagens.ativos}
                    </p>
                  </div>
                  <User className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Usuários */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {filtroAtivo === 'todos'
                  ? 'Usuários Ativos'
                  : filtroAtivo === 'pendentes'
                    ? 'Aprovação de Usuários Pendentes'
                    : filtroAtivo === 'aprovados'
                      ? 'Usuários Aprovados'
                      : filtroAtivo === 'rejeitados'
                        ? 'Usuários Rejeitados'
                        : filtroAtivo === 'ativos'
                          ? 'Usuários Ativos'
                          : 'Usuários Ativos'}
              </h1>
              <p className="text-gray-600 mt-2">
                {filtroAtivo === 'todos'
                  ? 'Gerencie usuários ativos e aprovados no sistema'
                  : filtroAtivo === 'pendentes'
                    ? 'Aprove ou rejeite usuários pendentes de aprovação'
                    : filtroAtivo === 'aprovados'
                      ? 'Visualize usuários aprovados no sistema'
                      : filtroAtivo === 'rejeitados'
                        ? 'Visualize usuários rejeitados'
                        : filtroAtivo === 'ativos'
                          ? 'Visualize usuários ativos no sistema'
                          : 'Gerencie usuários ativos no sistema'}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {/* Indicador de filtro ativo */}
            {filtroAtivo !== 'ativos' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-800 font-medium">
                      Filtro ativo:{' '}
                      {filtroAtivo === 'pendentes'
                        ? 'Pendentes'
                        : filtroAtivo === 'aprovados'
                          ? 'Aprovados'
                          : filtroAtivo === 'rejeitados'
                            ? 'Rejeitados'
                            : filtroAtivo === 'todos'
                              ? 'Todos'
                              : 'Ativos'}
                    </span>
                    <span className="text-blue-600">
                      ({getUsuariosFiltrados().length} usuários)
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => filtrarUsuarios('ativos')}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Voltar aos Ativos
                  </Button>
                </div>
              </div>
            )}

            {/* Lista de usuários filtrados */}
            {getUsuariosFiltrados().map(usuario => (
              <Card
                key={usuario.id}
                className="bg-white border-gray-200 hover:border-gray-300 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {usuario.nome}
                          </h3>
                          <p className="text-gray-600">{usuario.email}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            {/* Status do usuário baseado na lógica correta */}
                            {!usuario.aprovado &&
                              !usuario.rejeitado &&
                              !usuario.ativo && (
                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                  <Clock className="w-4 h-4 mr-1" />
                                  <span className="ml-1">Pendente</span>
                                </Badge>
                              )}
                            {usuario.aprovado && usuario.ativo && (
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                <span className="ml-1">Aprovado</span>
                              </Badge>
                            )}
                            {usuario.rejeitado && !usuario.ativo && (
                              <Badge className="bg-red-100 text-red-800 border-red-200">
                                <XCircle className="w-4 h-4 mr-1" />
                                <span className="ml-1">Rejeitado</span>
                              </Badge>
                            )}
                            {usuario.ativo && (
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                <User className="w-4 h-4 mr-1" />
                                <span className="ml-1">Ativo</span>
                              </Badge>
                            )}
                            {usuario.tipo_pessoa && (
                              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                                {usuario.tipo_pessoa}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Cadastrado em:{' '}
                            {new Date(usuario.data_cadastro).toLocaleDateString(
                              'pt-BR'
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Ações baseadas no status do usuário */}
                      {!usuario.aprovado &&
                        !usuario.rejeitado &&
                        !usuario.ativo && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleAprovarUsuario(usuario.id)}
                              disabled={!usuario.perfil_id}
                              className={`${
                                usuario.perfil_id
                                  ? 'bg-green-600 hover:bg-green-700 text-white'
                                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                              }`}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              {usuario.perfil_id
                                ? 'Aprovar'
                                : 'Selecione Perfil'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejeitarUsuario(usuario.id)}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Rejeitar
                            </Button>
                          </>
                        )}

                      {/* Ações para usuários aprovados */}
                      {usuario.aprovado && usuario.ativo && (
                        <div className="flex items-center space-x-2">
                          <span className="text-green-600 text-sm font-medium">
                            ✓ Aprovado e Ativo
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejeitarUsuario(usuario.id)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Rejeitar
                          </Button>
                        </div>
                      )}

                      {/* Ações para usuários rejeitados */}
                      {usuario.rejeitado && !usuario.ativo && (
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600 text-sm font-medium">
                            ❌ Rejeitado e Inativo
                          </span>
                          <Button
                            size="sm"
                            onClick={() => handleAprovarUsuario(usuario.id)}
                            disabled={!usuario.perfil_id}
                            className={`${
                              usuario.perfil_id
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            }`}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            {usuario.perfil_id
                              ? 'Reaprovar'
                              : 'Selecione Perfil'}
                          </Button>
                        </div>
                      )}

                      {/* Alterar perfil - sempre disponível */}
                      <div className="min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Perfil de Acesso{' '}
                          {!usuario.aprovado &&
                          !usuario.rejeitado &&
                          !usuario.ativo
                            ? '*'
                            : ''}
                        </label>
                        <select
                          value={usuario.perfil_id?.toString() || ''}
                          onChange={e =>
                            handleAlterarPerfil(usuario.id, e.target.value)
                          }
                          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Selecione um perfil</option>
                          {perfis.map(perfil => (
                            <option key={perfil.id} value={perfil.id}>
                              {perfil.nome} (Nível {perfil.nivel})
                            </option>
                          ))}
                        </select>
                        {usuario.perfil_id && (
                          <p className="text-xs text-green-600 mt-1">
                            ✓ Perfil:{' '}
                            {perfis.find(p => p.id === usuario.perfil_id)?.nome}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {getUsuariosFiltrados().length === 0 && (
              <Card className="bg-white border-gray-200">
                <CardContent className="p-12 text-center">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {filtroAtivo === 'ativos'
                      ? 'Nenhum usuário ativo'
                      : filtroAtivo === 'pendentes'
                        ? 'Nenhum usuário pendente'
                        : filtroAtivo === 'aprovados'
                          ? 'Nenhum usuário aprovado'
                          : filtroAtivo === 'rejeitados'
                            ? 'Nenhum usuário rejeitado'
                            : filtroAtivo === 'todos'
                              ? 'Nenhum usuário encontrado'
                              : 'Nenhum usuário ativo'}
                  </h3>
                  <p className="text-gray-600">
                    {filtroAtivo === 'ativos'
                      ? 'Não há usuários ativos no sistema no momento.'
                      : filtroAtivo === 'pendentes'
                        ? 'Todos os usuários foram aprovados ou rejeitados. Novos cadastros aparecerão aqui automaticamente.'
                        : filtroAtivo === 'aprovados'
                          ? 'Não há usuários aprovados no momento.'
                          : filtroAtivo === 'rejeitados'
                            ? 'Não há usuários rejeitados no momento.'
                            : filtroAtivo === 'todos'
                              ? 'Não há usuários cadastrados no sistema.'
                              : 'Não há usuários ativos no momento.'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Alerta Customizado */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 transform transition-all">
            {/* Header do Modal */}
            <div
              className={`px-6 py-4 border-b ${
                modalType === 'success'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {modalType === 'success' ? (
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                  )}
                  <h3
                    className={`text-lg font-semibold ${
                      modalType === 'success'
                        ? 'text-green-800'
                        : 'text-red-800'
                    }`}
                  >
                    {modalTitle}
                  </h3>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Conteúdo do Modal */}
            <div className="px-6 py-6">
              <p
                className={`text-sm ${
                  modalType === 'success' ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {modalMessage}
              </p>
            </div>

            {/* Footer do Modal */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeModal}
                className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
                  modalType === 'success'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
