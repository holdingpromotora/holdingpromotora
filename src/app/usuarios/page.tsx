'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Users,
  UserPlus,
  Building2,
  User,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  ArrowLeft,
  Save,
  X,
  Calendar,
  RotateCcw,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Usuario {
  id: string;
  nome: string;
  tipo: 'PF' | 'PJ';
  status: 'ativo' | 'pendente' | 'inativo';
  email: string;
  dataCadastro: string;
  ultimoAcesso?: string;
  dadosOriginais?: Record<string, unknown>; // Para armazenar dados completos do banco
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [tipoFilter, setTipoFilter] = useState<string>('todos');
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Estados para ações
  const [usuarioParaEditar, setUsuarioParaEditar] = useState<Usuario | null>(
    null
  );
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState<Usuario | null>(
    null
  );
  const [isEditando, setIsEditando] = useState(false);
  const [isExcluindo, setIsExcluindo] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Carregar usuários reais do banco de dados
  useEffect(() => {
    if (isClient) {
      carregarUsuarios();
    }
  }, [isClient]);

  const carregarUsuarios = async () => {
    try {
      setIsLoading(true);

      console.log('Iniciando carregamento de usuários...');

      // Carregar pessoas físicas
      const { data: pessoasFisicas, error: errorPF } = await supabase
        .from('pessoas_fisicas')
        .select('*')
        .eq('ativo', true);

      if (errorPF) {
        console.error('Erro ao carregar pessoas físicas:', errorPF);
      } else {
        console.log('Pessoas físicas carregadas:', pessoasFisicas?.length || 0);
      }

      // Carregar pessoas jurídicas
      const { data: pessoasJuridicas, error: errorPJ } = await supabase
        .from('pessoas_juridicas')
        .select('*')
        .eq('ativo', true);

      if (errorPJ) {
        console.error('Erro ao carregar pessoas jurídicas:', errorPJ);
      } else {
        console.log(
          'Pessoas jurídicas carregadas:',
          pessoasJuridicas?.length || 0
        );
      }

      // Converter dados para formato unificado
      const usuariosUnificados: Usuario[] = [];

      // Adicionar pessoas físicas
      if (pessoasFisicas) {
        pessoasFisicas.forEach(pf => {
          const usuario: Usuario = {
            id: pf.id.toString(),
            nome: pf.nome || 'Nome não informado',
            tipo: 'PF' as const,
            status: 'ativo' as const, // Por enquanto todos ativos
            email: pf.email || 'Email não informado',
            dataCadastro: pf.created_at || new Date().toISOString(),
            ultimoAcesso: pf.updated_at || undefined,
            dadosOriginais: pf, // Guardar dados completos para edição
          };

          console.log('Pessoa física convertida:', usuario);
          usuariosUnificados.push(usuario);
        });
      }

      // Adicionar pessoas jurídicas
      if (pessoasJuridicas) {
        pessoasJuridicas.forEach(pj => {
          const usuario: Usuario = {
            id: pj.id.toString(),
            nome: pj.razao_social || 'Razão social não informada',
            tipo: 'PJ' as const,
            status: 'ativo' as const, // Por enquanto todos ativos
            email: pj.proprietario_email || 'Email não informado',
            dataCadastro: pj.created_at || new Date().toISOString(),
            ultimoAcesso: pj.updated_at || undefined,
            dadosOriginais: pj, // Guardar dados completos para edição
          };

          console.log('Pessoa jurídica convertida:', usuario);
          usuariosUnificados.push(usuario);
        });
      }

      console.log('Total de usuários unificados:', usuariosUnificados.length);

      // Adicionar dados mock se não houver dados reais
      if (usuariosUnificados.length === 0) {
        console.log('Nenhum usuário encontrado, usando dados mock...');
        const mockUsuarios: Usuario[] = [
          {
            id: '1',
            nome: 'João Silva Santos',
            tipo: 'PF',
            status: 'ativo',
            email: 'joao.silva@email.com',
            dataCadastro: '2024-01-15',
            ultimoAcesso: '2024-01-20 14:30',
          },
          {
            id: '2',
            nome: 'Maria Oliveira Costa',
            tipo: 'PF',
            status: 'pendente',
            email: 'maria.oliveira@email.com',
            dataCadastro: '2024-01-18',
          },
          {
            id: '3',
            nome: 'Empresa ABC Ltda',
            tipo: 'PJ',
            status: 'ativo',
            email: 'contato@empresaabc.com',
            dataCadastro: '2024-01-10',
            ultimoAcesso: '2024-01-19 09:15',
          },
        ];
        setUsuarios(mockUsuarios);
      } else {
        setUsuarios(usuariosUnificados);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      // Fallback para dados mock em caso de erro
      const mockUsuarios: Usuario[] = [
        {
          id: '1',
          nome: 'João Silva Santos',
          tipo: 'PF',
          status: 'ativo',
          email: 'joao.silva@email.com',
          dataCadastro: '2024-01-15',
          ultimoAcesso: '2024-01-20 14:30',
        },
        {
          id: '2',
          nome: 'Maria Oliveira Costa',
          tipo: 'PF',
          status: 'pendente',
          email: 'maria.oliveira@email.com',
          dataCadastro: '2024-01-18',
        },
        {
          id: '3',
          nome: 'Empresa ABC Ltda',
          tipo: 'PJ',
          status: 'ativo',
          email: 'contato@empresaabc.com',
          dataCadastro: '2024-01-10',
          ultimoAcesso: '2024-01-19 09:15',
        },
      ];
      setUsuarios(mockUsuarios);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para editar usuário
  const handleEditar = (usuario: Usuario) => {
    console.log('Editando usuário:', usuario);
    console.log('Dados originais:', usuario.dadosOriginais);

    // Verificar se temos dados originais válidos
    if (!usuario.dadosOriginais) {
      console.warn('Usuário não possui dados originais completos');
      alert(
        'Este usuário não possui dados completos para edição. Recarregue a página e tente novamente.'
      );
      return;
    }

    setUsuarioParaEditar(usuario);
    setShowEditModal(true);
  };

  // Função para salvar edições
  const handleSalvarEdicao = async () => {
    if (!usuarioParaEditar) return;

    try {
      setIsEditando(true);

      console.log('Iniciando atualização para usuário:', usuarioParaEditar.id);
      console.log('Tipo de usuário:', usuarioParaEditar.tipo);

      if (usuarioParaEditar.tipo === 'PF') {
        // Validar dados antes de enviar
        const tipoPixAtual = usuarioParaEditar.dadosOriginais?.tipo_pix;
        const tipoPixValido =
          typeof tipoPixAtual === 'string' &&
          ['cpf', 'cnpj', 'telefone', 'email'].includes(tipoPixAtual);

        // Validação mais rigorosa do tipo de conta
        const tipoContaAtual = usuarioParaEditar.dadosOriginais?.tipo_conta;
        console.log('🔍 Tipo de conta atual:', tipoContaAtual);
        console.log('🔍 Tipo de conta atual (typeof):', typeof tipoContaAtual);

        // Valores mais básicos e seguros
        const valoresContaValidos = ['corrente', 'poupanca'];
        let tipoContaFinal = tipoContaAtual;

        // Se o valor atual não for válido, usar padrão
        if (
          typeof tipoContaAtual !== 'string' ||
          !valoresContaValidos.includes(tipoContaAtual)
        ) {
          console.log('⚠️ Tipo de conta inválido detectado, usando padrão');
          tipoContaFinal = 'corrente';
          // Atualizar o objeto para usar o valor válido
          setUsuarioParaEditar({
            ...usuarioParaEditar,
            dadosOriginais: {
              ...usuarioParaEditar.dadosOriginais,
              tipo_conta: tipoContaFinal,
            },
          });
        }

        const tipoContaValido =
          typeof tipoContaFinal === 'string' &&
          valoresContaValidos.includes(tipoContaFinal);

        console.log('🔍 Valores válidos para conta:', valoresContaValidos);
        console.log('🔍 Tipo de conta final:', tipoContaFinal);
        console.log('🔍 Tipo de conta é válido?', tipoContaValido);

        if (!tipoPixValido) {
          throw new Error(
            'Tipo PIX inválido. Use apenas: CPF, CNPJ, Telefone ou E-mail.'
          );
        }

        if (!tipoContaValido) {
          throw new Error(
            'Tipo de conta inválido. Use apenas: Corrente ou Poupança.'
          );
        }

        // Atualizar pessoa física com todos os campos
        const dadosPF = {
          nome: usuarioParaEditar.nome || '',
          email: usuarioParaEditar.email || '',
          cpf: usuarioParaEditar.dadosOriginais?.cpf || null,
          rg: usuarioParaEditar.dadosOriginais?.rg || null,
          data_nascimento:
            usuarioParaEditar.dadosOriginais?.data_nascimento || null,
          telefone: usuarioParaEditar.dadosOriginais?.telefone || null,
          cep: usuarioParaEditar.dadosOriginais?.cep || null,
          endereco: usuarioParaEditar.dadosOriginais?.endereco || null,
          numero: usuarioParaEditar.dadosOriginais?.numero || null,
          complemento: usuarioParaEditar.dadosOriginais?.complemento || null,
          bairro: usuarioParaEditar.dadosOriginais?.bairro || null,
          cidade: usuarioParaEditar.dadosOriginais?.cidade || null,
          estado: usuarioParaEditar.dadosOriginais?.estado || null,
          banco_id: usuarioParaEditar.dadosOriginais?.banco_id || null,
          agencia: usuarioParaEditar.dadosOriginais?.agencia || null,
          conta_digito: usuarioParaEditar.dadosOriginais?.conta_digito || null,
          tipo_conta: tipoContaFinal,
          tipo_pix: usuarioParaEditar.dadosOriginais?.tipo_pix || 'cpf',
          chave_pix: usuarioParaEditar.dadosOriginais?.chave_pix || null,
          ativo: usuarioParaEditar.status === 'ativo',
        };

        console.log('Dados PF para atualização:', dadosPF);

        const { data, error } = await supabase
          .from('pessoas_fisicas')
          .update(dadosPF)
          .eq('id', usuarioParaEditar.id)
          .select();

        console.log('Resposta Supabase PF - data:', data);
        console.log('Resposta Supabase PF - error:', error);

        if (error) {
          console.error('Erro Supabase PF:', error);
          throw new Error(
            `Erro ao atualizar pessoa física: ${error.message || 'Erro desconhecido'}`
          );
        }

        if (!data || data.length === 0) {
          throw new Error(
            'Nenhum registro foi atualizado. Verifique se o ID existe.'
          );
        }

        console.log('Pessoa física atualizada com sucesso:', data[0]);
      } else {
        // Validar dados antes de enviar
        const tipoPixAtual = usuarioParaEditar.dadosOriginais?.tipo_pix;
        const tipoPixValido =
          typeof tipoPixAtual === 'string' &&
          ['cpf', 'cnpj', 'telefone', 'email'].includes(tipoPixAtual);

        // Validação mais rigorosa do tipo de conta
        const tipoContaAtual = usuarioParaEditar.dadosOriginais?.tipo_conta;
        console.log('🔍 Tipo de conta atual (PJ):', tipoContaAtual);
        console.log(
          '🔍 Tipo de conta atual (PJ) (typeof):',
          typeof tipoContaAtual
        );

        // Valores mais básicos e seguros
        const valoresContaValidos = ['corrente', 'poupanca'];
        let tipoContaFinal = tipoContaAtual;

        // Se o valor atual não for válido, usar padrão
        if (
          typeof tipoContaAtual !== 'string' ||
          !valoresContaValidos.includes(tipoContaAtual)
        ) {
          console.log(
            '⚠️ Tipo de conta inválido detectado (PJ), usando padrão'
          );
          tipoContaFinal = 'corrente';
          // Atualizar o objeto para usar o valor válido
          setUsuarioParaEditar({
            ...usuarioParaEditar,
            dadosOriginais: {
              ...usuarioParaEditar.dadosOriginais,
              tipo_conta: tipoContaFinal,
            },
          });
        }

        const tipoContaValido =
          typeof tipoContaFinal === 'string' &&
          valoresContaValidos.includes(tipoContaFinal);

        console.log('🔍 Valores válidos para conta (PJ):', valoresContaValidos);
        console.log('🔍 Tipo de conta final (PJ):', tipoContaFinal);
        console.log('🔍 Tipo de conta é válido? (PJ):', tipoContaValido);

        if (!tipoPixValido) {
          throw new Error(
            'Tipo PIX inválido. Use apenas: CPF, CNPJ, Telefone ou E-mail.'
          );
        }

        if (!tipoContaValido) {
          throw new Error(
            'Tipo de conta inválido. Use apenas: Corrente ou Poupança.'
          );
        }

        // Atualizar pessoa jurídica com todos os campos
        const dadosPJ = {
          razao_social: usuarioParaEditar.nome || '',
          proprietario_email: usuarioParaEditar.email || '',
          cnpj: usuarioParaEditar.dadosOriginais?.cnpj || null,
          nome_fantasia:
            usuarioParaEditar.dadosOriginais?.nome_fantasia || null,
          proprietario_nome:
            usuarioParaEditar.dadosOriginais?.proprietario_nome || null,
          proprietario_cpf:
            usuarioParaEditar.dadosOriginais?.proprietario_cpf || null,
          proprietario_telefone:
            usuarioParaEditar.dadosOriginais?.proprietario_telefone || null,
          cep: usuarioParaEditar.dadosOriginais?.cep || null,
          endereco: usuarioParaEditar.dadosOriginais?.endereco || null,
          numero: usuarioParaEditar.dadosOriginais?.numero || null,
          complemento: usuarioParaEditar.dadosOriginais?.complemento || null,
          bairro: usuarioParaEditar.dadosOriginais?.bairro || null,
          cidade: usuarioParaEditar.dadosOriginais?.cidade || null,
          estado: usuarioParaEditar.dadosOriginais?.estado || null,
          banco_id: usuarioParaEditar.dadosOriginais?.banco_id || null,
          agencia: usuarioParaEditar.dadosOriginais?.agencia || null,
          conta_digito: usuarioParaEditar.dadosOriginais?.conta_digito || null,
          tipo_conta: tipoContaFinal,
          tipo_pix: usuarioParaEditar.dadosOriginais?.tipo_pix || 'cpf',
          chave_pix: usuarioParaEditar.dadosOriginais?.chave_pix || null,
          ativo: usuarioParaEditar.status === 'ativo',
        };

        console.log('Dados PJ para atualização:', dadosPJ);

        const { data, error } = await supabase
          .from('pessoas_juridicas')
          .update(dadosPJ)
          .eq('id', usuarioParaEditar.id)
          .select();

        console.log('Resposta Supabase PJ - data:', data);
        console.log('Resposta Supabase PJ - error:', error);

        if (error) {
          console.error('Erro Supabase PJ:', error);
          throw new Error(
            `Erro ao atualizar pessoa jurídica: ${error.message || 'Erro desconhecido'}`
          );
        }

        if (!data || data.length === 0) {
          throw new Error(
            'Nenhum registro foi atualizado. Verifique se o ID existe.'
          );
        }

        console.log('Pessoa jurídica atualizada com sucesso:', data[0]);
      }

      // Atualizar lista local
      setUsuarios(prev =>
        prev.map(u => (u.id === usuarioParaEditar.id ? usuarioParaEditar : u))
      );

      setShowEditModal(false);
      setUsuarioParaEditar(null);

      // Recarregar usuários para garantir sincronização
      await carregarUsuarios();
    } catch (error) {
      console.error('Erro completo ao atualizar usuário:', error);

      let mensagemErro = 'Erro ao atualizar usuário.';

      if (error instanceof Error) {
        mensagemErro = error.message;
      } else if (typeof error === 'object' && error !== null) {
        mensagemErro = `Erro: ${JSON.stringify(error)}`;
      }

      alert(mensagemErro);
    } finally {
      setIsEditando(false);
    }
  };

  // Função para excluir usuário
  const handleExcluir = (usuario: Usuario) => {
    setUsuarioParaExcluir(usuario);
    setShowDeleteModal(true);
  };

  // Função para confirmar exclusão
  const handleConfirmarExclusao = async () => {
    if (!usuarioParaExcluir) return;

    try {
      setIsExcluindo(true);

      if (usuarioParaExcluir.tipo === 'PF') {
        // Desativar pessoa física (soft delete)
        const { error } = await supabase
          .from('pessoas_fisicas')
          .update({ ativo: false })
          .eq('id', usuarioParaExcluir.id);

        if (error) throw error;
      } else {
        // Desativar pessoa jurídica (soft delete)
        const { error } = await supabase
          .from('pessoas_juridicas')
          .update({ ativo: false })
          .eq('id', usuarioParaExcluir.id);

        if (error) throw error;
      }

      // Remover da lista local
      setUsuarios(prev => prev.filter(u => u.id !== usuarioParaExcluir.id));

      setShowDeleteModal(false);
      setUsuarioParaExcluir(null);

      // Recarregar usuários para garantir sincronização
      await carregarUsuarios();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      alert('Erro ao excluir usuário. Tente novamente.');
    } finally {
      setIsExcluindo(false);
    }
  };

  // Estatísticas
  const totalUsuarios = usuarios.length;
  const usuariosAtivos = usuarios.filter(u => u.status === 'ativo').length;
  const usuariosPendentes = usuarios.filter(
    u => u.status === 'pendente'
  ).length;
  const usuariosInativos = usuarios.filter(u => u.status === 'inativo').length;

  // Filtros
  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch =
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'todos' || usuario.status === statusFilter;
    const matchesTipo = tipoFilter === 'todos' || usuario.tipo === tipoFilter;

    return matchesSearch && matchesStatus && matchesTipo;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            Ativo
          </Badge>
        );
      case 'pendente':
        return (
          <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            Pendente
          </Badge>
        );
      case 'inativo':
        return (
          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            Inativo
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gradient-to-r from-slate-500 to-slate-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            {status}
          </Badge>
        );
    }
  };

  // Função para obter o ícone baseado no tipo de usuário
  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Pessoa Física':
        return <User className="w-6 h-6 text-blue-600" />;
      case 'Pessoa Jurídica':
        return <Building2 className="w-6 h-6 text-emerald-600" />;
      default:
        return <User className="w-6 h-6 text-slate-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho da Página */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 rounded-2xl p-6 lg:p-8 shadow-2xl mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 to-blue-900/50"></div>
        <div className="absolute top-0 right-0 w-48 h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full -translate-y-24 lg:-translate-y-32 translate-x-24 lg:translate-x-32"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="flex-1">
            <div className="flex items-center space-x-4 lg:space-x-6 mb-4">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">
                  Gestão de Usuários
                </h1>
                <p className="text-blue-100 text-sm lg:text-lg">
                  Administre todos os usuários do sistema de forma eficiente
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link href="/dashboard">
              <div className="relative group animate-pulse hover:animate-none">
                <Button className="bg-white text-slate-800 hover:bg-blue-50 hover:text-blue-700 border-2 border-white/50 hover:border-white transition-all duration-300 transform hover:scale-105 shadow-xl font-semibold px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl ring-4 ring-blue-400/30 hover:ring-blue-400/50 text-sm lg:text-base">
                  <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3" />
                  Voltar ao Sistema
                </Button>
                {/* Indicador visual adicional */}
                <div className="absolute -top-2 -right-2 w-3 h-3 lg:w-4 lg:h-4 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-1 -left-1 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {/* Tooltip de ajuda */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                  ← Clique para voltar ao Dashboard
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                </div>
              </div>
            </Link>
            <div className="border-l border-white/20 h-12 lg:h-16 hidden sm:block"></div>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 border-0 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
          <CardContent className="p-4 lg:p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                  <Users className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-xs lg:text-sm font-medium">
                    Total de Usuários
                  </p>
                  <p className="text-xl lg:text-3xl font-bold text-white">
                    {isLoading ? '...' : totalUsuarios}
                  </p>
                </div>
              </div>
              <div className="text-right hidden lg:block">
                <div className="w-3 h-3 bg-white/40 rounded-full animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-green-500 via-green-600 to-green-700 border-0 shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-transparent"></div>
          <CardContent className="p-4 lg:p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                  <CheckCircle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-xs lg:text-sm font-medium">
                    Usuários Ativos
                  </p>
                  <p className="text-xl lg:text-3xl font-bold text-white">
                    {isLoading ? '...' : usuariosAtivos}
                  </p>
                </div>
              </div>
              <div className="text-right hidden lg:block">
                <div className="w-3 h-3 bg-white/40 rounded-full animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 border-0 shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 hover:scale-105 group">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-transparent"></div>
          <CardContent className="p-4 lg:p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                  <Clock className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-xs lg:text-sm font-medium">
                    Pendentes
                  </p>
                  <p className="text-xl lg:text-3xl font-bold text-white">
                    {isLoading ? '...' : usuariosPendentes}
                  </p>
                </div>
              </div>
              <div className="text-right hidden lg:block">
                <div className="w-3 h-3 bg-white/40 rounded-full animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-red-500 via-red-600 to-red-700 border-0 shadow-2xl hover:shadow-red-500/25 transition-all duration-300 hover:scale-105 group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>
          <CardContent className="p-4 lg:p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                  <AlertCircle className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-xs lg:text-sm font-medium">
                    Inativos
                  </p>
                  <p className="text-xl lg:text-3xl font-bold text-white">
                    {isLoading ? '...' : usuariosInativos}
                  </p>
                </div>
              </div>
              <div className="text-right hidden lg:block">
                <div className="w-3 h-3 bg-white/40 rounded-full animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Área de Cadastro */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Cadastro de Pessoa Física */}
        <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full -translate-y-12 lg:-translate-y-16 translate-x-12 lg:translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>

          <CardHeader className="relative z-10 pb-3 lg:pb-4">
            <CardTitle className="text-slate-800 flex items-center space-x-3 lg:space-x-4 group-hover:text-blue-700 transition-colors duration-300">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-110">
                <Users className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <span className="text-lg lg:text-2xl font-bold">
                Cadastro de Pessoa Física
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="relative z-10 space-y-4 lg:space-y-6">
            <p className="text-slate-600 text-sm lg:text-base leading-relaxed">
              Cadastre pessoas físicas com dados pessoais, endereço, bancários e
              PIX de forma completa e segura.
            </p>

            <div className="space-y-2 lg:space-y-3">
              <div className="flex items-center space-x-2 lg:space-x-3 text-slate-700">
                <div className="w-5 h-5 lg:w-6 lg:h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-green-600" />
                </div>
                <span className="text-sm lg:text-base font-medium">
                  Dados pessoais completos
                </span>
              </div>
              <div className="flex items-center space-x-2 lg:space-x-3 text-slate-700">
                <div className="w-5 h-5 lg:w-6 lg:h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-green-600" />
                </div>
                <span className="text-sm lg:text-base font-medium">
                  Validação de CPF e RG
                </span>
              </div>
              <div className="flex items-center space-x-2 lg:space-x-3 text-slate-700">
                <div className="w-5 h-5 lg:w-6 lg:h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-green-600" />
                </div>
                <span className="text-sm lg:text-base font-medium">
                  Dados bancários e PIX
                </span>
              </div>
            </div>

            <Link href="/usuarios/cadastro-pf">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 lg:py-3 px-4 lg:px-6 rounded-lg lg:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm lg:text-base">
                <UserPlus className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3" />
                Cadastrar Pessoa Física
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Cadastro de Pessoa Jurídica */}
        <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50 to-green-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full -translate-y-12 lg:-translate-y-16 translate-x-12 lg:translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>

          <CardHeader className="relative z-10 pb-3 lg:pb-4">
            <CardTitle className="text-slate-800 flex items-center space-x-3 lg:space-x-4 group-hover:text-emerald-700 transition-colors duration-300">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-300 group-hover:scale-110">
                <Building2 className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <span className="text-lg lg:text-2xl font-bold">
                Cadastro de Pessoa Jurídica
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="relative z-10 space-y-4 lg:space-y-6">
            <p className="text-slate-600 text-sm lg:text-base leading-relaxed">
              Cadastre pessoas jurídicas com dados da empresa, proprietário,
              bancários e PIX de forma eficiente.
            </p>

            <div className="space-y-2 lg:space-y-3">
              <div className="flex items-center space-x-2 lg:space-x-3 text-slate-700">
                <div className="w-5 h-5 lg:w-6 lg:h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-green-600" />
                </div>
                <span className="text-sm lg:text-base font-medium">
                  Busca automática de CNPJ
                </span>
              </div>
              <div className="flex items-center space-x-2 lg:space-x-3 text-slate-700">
                <div className="w-5 h-5 lg:w-6 lg:h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-green-600" />
                </div>
                <span className="text-sm lg:text-base font-medium">
                  Dados da empresa completos
                </span>
              </div>
              <div className="flex items-center space-x-2 lg:space-x-3 text-slate-700">
                <div className="w-5 h-5 lg:w-6 lg:h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-green-600" />
                </div>
                <span className="text-sm lg:text-base font-medium">
                  Informações bancárias
                </span>
              </div>
            </div>

            <Link href="/usuarios/cadastro-pj">
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-2 lg:py-3 px-4 lg:px-6 rounded-lg lg:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm lg:text-base">
                <Building2 className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3" />
                Cadastrar Pessoa Jurídica
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Usuários */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 border-0 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>

        <CardHeader className="relative z-10 bg-gradient-to-r from-slate-100 to-slate-200 border-b border-slate-200">
          <CardTitle className="text-slate-800 text-2xl font-bold flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span>Usuários Cadastrados</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="relative z-10 p-6">
          {/* Filtros e Busca */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 flex-1">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Buscar por nome, email ou documento..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 lg:py-3 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg lg:rounded-xl text-sm lg:text-base"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto min-w-[140px] border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg lg:rounded-xl py-2 lg:py-3 text-sm lg:text-base flex h-10 items-center justify-between px-3 ring-offset-background focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="ativo">Ativo</option>
                  <option value="pendente">Pendente</option>
                  <option value="inativo">Inativo</option>
                </select>

                <select
                  value={tipoFilter}
                  onChange={e => setTipoFilter(e.target.value)}
                  className="w-full sm:w-auto min-w-[140px] border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg lg:rounded-xl py-2 lg:py-3 text-sm lg:text-base flex h-10 items-center justify-between px-3 ring-offset-background focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="todos">Todos os Tipos</option>
                  <option value="Pessoa Física">Pessoa Física</option>
                  <option value="Pessoa Jurídica">Pessoa Jurídica</option>
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('todos');
                    setTipoFilter('todos');
                  }}
                  className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-700 rounded-lg lg:rounded-xl py-2 lg:py-3 px-3 lg:px-4 text-sm lg:text-base"
                >
                  <RotateCcw className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                  Limpar
                </Button>
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('todos');
                    setTipoFilter('todos');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg lg:rounded-xl py-2 lg:py-3 px-3 lg:px-4 text-sm lg:text-base"
                >
                  <RefreshCw className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                  Atualizar
                </Button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 text-lg font-medium">
                Carregando usuários...
              </p>
            </div>
          )}

          {/* Cards de Usuários (Mobile/Tablet) */}
          {!isLoading && (
            <div className="lg:hidden space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Usuários Cadastrados</span>
              </h3>

              {filteredUsuarios.map(usuario => (
                <Card
                  key={usuario.id}
                  className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                          {getTipoIcon(usuario.tipo)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 truncate">
                            {usuario.nome}
                          </h4>
                          <p className="text-slate-500 text-sm truncate">
                            {usuario.email}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            {getStatusBadge(usuario.status)}
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-xs text-slate-500">
                              {usuario.tipo}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg p-2"
                          title="Editar"
                          onClick={() => handleEditar(usuario)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg p-2"
                          title="Excluir"
                          onClick={() => handleExcluir(usuario)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>
                            Cadastro:{' '}
                            {new Date(usuario.dataCadastro).toLocaleDateString(
                              'pt-BR'
                            )}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>
                            {usuario.ultimoAcesso
                              ? new Date(
                                  usuario.ultimoAcesso
                                ).toLocaleDateString('pt-BR')
                              : 'Nunca acessou'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredUsuarios.length === 0 && (
                <Card className="bg-slate-50 border-slate-200">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-600 font-medium">
                      Nenhum usuário encontrado
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      Tente ajustar os filtros de busca
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Tabela de Usuários (Desktop) */}
          {!isLoading && (
            <div className="hidden lg:block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-gradient-to-r from-slate-100 to-slate-200 px-6 py-4 border-b border-slate-200">
                <h3 className="text-slate-800 text-xl lg:text-2xl font-bold flex items-center space-x-3">
                  <Users className="w-6 h-6 lg:w-7 lg:h-7 text-slate-600" />
                  <span>Usuários Cadastrados</span>
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-slate-900 uppercase tracking-wider">
                        Usuário
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-slate-900 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-slate-900 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-slate-900 uppercase tracking-wider">
                        Data Cadastro
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-slate-900 uppercase tracking-wider">
                        Último Acesso
                      </th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs lg:text-sm font-semibold text-slate-900 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {filteredUsuarios.map(usuario => (
                      <tr
                        key={usuario.id}
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                      >
                        <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3 lg:space-x-4">
                            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                              {getTipoIcon(usuario.tipo)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm lg:text-base font-semibold text-slate-900 truncate">
                                {usuario.nome}
                              </p>
                              <p className="text-xs lg:text-sm text-slate-500 truncate">
                                {usuario.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs lg:text-sm font-medium bg-slate-100 text-slate-800">
                            {usuario.tipo}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                          {getStatusBadge(usuario.status)}
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-slate-600">
                          {new Date(usuario.dataCadastro).toLocaleDateString(
                            'pt-BR'
                          )}
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-xs lg:text-sm text-slate-600">
                          {usuario.ultimoAcesso
                            ? new Date(usuario.ultimoAcesso).toLocaleDateString(
                                'pt-BR'
                              )
                            : 'Nunca acessou'}
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg p-2"
                              title="Editar"
                              onClick={() => handleEditar(usuario)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg p-2"
                              title="Excluir"
                              onClick={() => handleExcluir(usuario)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsuarios.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-medium">
                    Nenhum usuário encontrado
                  </p>
                  <p className="text-slate-500 text-sm mt-1">
                    Tente ajustar os filtros de busca
                  </p>
                </div>
              )}
            </div>
          )}

          {!isLoading && filteredUsuarios.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600 text-lg font-medium">
                Nenhum usuário encontrado com os filtros aplicados.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="bg-white border-gray-200 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="bg-gray-50 -m-6 mb-6 p-6 rounded-t-lg">
            <DialogTitle className="text-gray-900 text-xl font-semibold">
              Editar{' '}
              {usuarioParaEditar?.tipo === 'PF'
                ? 'Pessoa Física'
                : 'Pessoa Jurídica'}
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Atualize todas as informações do usuário selecionado.
            </DialogDescription>
          </DialogHeader>

          {usuarioParaEditar && (
            <div className="space-y-6">
              {/* Dados Básicos */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Dados Básicos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome" className="text-gray-700 font-medium">
                      {usuarioParaEditar.tipo === 'PF'
                        ? 'Nome Completo'
                        : 'Razão Social'}
                    </Label>
                    <Input
                      id="nome"
                      value={usuarioParaEditar.nome}
                      onChange={e =>
                        setUsuarioParaEditar({
                          ...usuarioParaEditar,
                          nome: e.target.value,
                        })
                      }
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="text-gray-700 font-medium"
                    >
                      {usuarioParaEditar.tipo === 'PF'
                        ? 'Email'
                        : 'Email do Proprietário'}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={usuarioParaEditar.email}
                      onChange={e =>
                        setUsuarioParaEditar({
                          ...usuarioParaEditar,
                          email: e.target.value,
                        })
                      }
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  {usuarioParaEditar.tipo === 'PF' && (
                    <>
                      <div>
                        <Label
                          htmlFor="cpf"
                          className="text-gray-700 font-medium"
                        >
                          CPF
                        </Label>
                        <Input
                          id="cpf"
                          value={String(
                            (
                              usuarioParaEditar.dadosOriginais as Record<
                                string,
                                string
                              >
                            )?.cpf || ''
                          )}
                          onChange={e =>
                            setUsuarioParaEditar({
                              ...usuarioParaEditar,
                              dadosOriginais: {
                                ...usuarioParaEditar.dadosOriginais,
                                cpf: e.target.value,
                              },
                            })
                          }
                          className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="000.000.000-00"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="rg"
                          className="text-gray-700 font-medium"
                        >
                          RG
                        </Label>
                        <Input
                          id="rg"
                          value={String(
                            (
                              usuarioParaEditar.dadosOriginais as Record<
                                string,
                                string
                              >
                            )?.rg || ''
                          )}
                          onChange={e =>
                            setUsuarioParaEditar({
                              ...usuarioParaEditar,
                              dadosOriginais: {
                                ...usuarioParaEditar.dadosOriginais,
                                rg: e.target.value,
                              },
                            })
                          }
                          className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="00.000.000-0"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="dataNascimento"
                          className="text-gray-700 font-medium"
                        >
                          Data de Nascimento
                        </Label>
                        <Input
                          id="dataNascimento"
                          type="date"
                          value={String(
                            (
                              usuarioParaEditar.dadosOriginais as Record<
                                string,
                                string
                              >
                            )?.data_nascimento || ''
                          )}
                          onChange={e =>
                            setUsuarioParaEditar({
                              ...usuarioParaEditar,
                              dadosOriginais: {
                                ...usuarioParaEditar.dadosOriginais,
                                data_nascimento: e.target.value,
                              },
                            })
                          }
                          className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="telefone"
                          className="text-gray-700 font-medium"
                        >
                          Telefone
                        </Label>
                        <Input
                          id="telefone"
                          value={String(
                            (
                              usuarioParaEditar.dadosOriginais as Record<
                                string,
                                string
                              >
                            )?.telefone || ''
                          )}
                          onChange={e =>
                            setUsuarioParaEditar({
                              ...usuarioParaEditar,
                              dadosOriginais: {
                                ...usuarioParaEditar.dadosOriginais,
                                telefone: e.target.value,
                              },
                            })
                          }
                          className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                    </>
                  )}

                  {usuarioParaEditar.tipo === 'PJ' && (
                    <>
                      <div>
                        <Label
                          htmlFor="cnpj"
                          className="text-gray-700 font-medium"
                        >
                          CNPJ
                        </Label>
                        <Input
                          id="cnpj"
                          value={String(
                            (
                              usuarioParaEditar.dadosOriginais as Record<
                                string,
                                string
                              >
                            )?.cnpj || ''
                          )}
                          onChange={e =>
                            setUsuarioParaEditar({
                              ...usuarioParaEditar,
                              dadosOriginais: {
                                ...usuarioParaEditar.dadosOriginais,
                                cnpj: e.target.value,
                              },
                            })
                          }
                          className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="00.000.000/0000-00"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="nomeFantasia"
                          className="text-gray-700 font-medium"
                        >
                          Nome Fantasia
                        </Label>
                        <Input
                          id="nomeFantasia"
                          value={String(
                            (
                              usuarioParaEditar.dadosOriginais as Record<
                                string,
                                string
                              >
                            )?.nome_fantasia || ''
                          )}
                          onChange={e =>
                            setUsuarioParaEditar({
                              ...usuarioParaEditar,
                              dadosOriginais: {
                                ...usuarioParaEditar.dadosOriginais,
                                nome_fantasia: e.target.value,
                              },
                            })
                          }
                          className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="proprietarioNome"
                          className="text-gray-700 font-medium"
                        >
                          Nome do Proprietário
                        </Label>
                        <Input
                          id="proprietarioNome"
                          value={String(
                            (
                              usuarioParaEditar.dadosOriginais as Record<
                                string,
                                string
                              >
                            )?.proprietario_nome || ''
                          )}
                          onChange={e =>
                            setUsuarioParaEditar({
                              ...usuarioParaEditar,
                              dadosOriginais: {
                                ...usuarioParaEditar.dadosOriginais,
                                proprietario_nome: e.target.value,
                              },
                            })
                          }
                          className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="proprietarioCPF"
                          className="text-gray-700 font-medium"
                        >
                          CPF do Proprietário
                        </Label>
                        <Input
                          id="proprietarioCPF"
                          value={String(
                            (
                              usuarioParaEditar.dadosOriginais as Record<
                                string,
                                string
                              >
                            )?.proprietario_cpf || ''
                          )}
                          onChange={e =>
                            setUsuarioParaEditar({
                              ...usuarioParaEditar,
                              dadosOriginais: {
                                ...usuarioParaEditar.dadosOriginais,
                                proprietario_cpf: e.target.value,
                              },
                            })
                          }
                          className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="000.000.000-00"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="proprietarioTelefone"
                          className="text-gray-700 font-medium"
                        >
                          Telefone do Proprietário
                        </Label>
                        <Input
                          id="proprietarioTelefone"
                          value={
                            (
                              usuarioParaEditar.dadosOriginais as Record<
                                string,
                                string
                              >
                            )?.proprietario_telefone || ''
                          }
                          onChange={e =>
                            setUsuarioParaEditar({
                              ...usuarioParaEditar,
                              dadosOriginais: {
                                ...usuarioParaEditar.dadosOriginais,
                                proprietario_telefone: e.target.value,
                              },
                            })
                          }
                          className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Endereço */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Endereço
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="cep" className="text-gray-700 font-medium">
                      CEP
                    </Label>
                    <Input
                      id="cep"
                      value={
                        (
                          usuarioParaEditar.dadosOriginais as Record<
                            string,
                            string
                          >
                        )?.cep || ''
                      }
                      onChange={e =>
                        setUsuarioParaEditar({
                          ...usuarioParaEditar,
                          dadosOriginais: {
                            ...usuarioParaEditar.dadosOriginais,
                            cep: e.target.value,
                          },
                        })
                      }
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="00000-000"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="endereco"
                      className="text-gray-700 font-medium"
                    >
                      Endereço
                    </Label>
                    <Input
                      id="endereco"
                      value={
                        (
                          usuarioParaEditar.dadosOriginais as Record<
                            string,
                            string
                          >
                        )?.endereco || ''
                      }
                      onChange={e =>
                        setUsuarioParaEditar({
                          ...usuarioParaEditar,
                          dadosOriginais: {
                            ...usuarioParaEditar.dadosOriginais,
                            endereco: e.target.value,
                          },
                        })
                      }
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="numero"
                      className="text-gray-700 font-medium"
                    >
                      Número
                    </Label>
                    <Input
                      id="numero"
                      value={
                        (
                          usuarioParaEditar.dadosOriginais as Record<
                            string,
                            string
                          >
                        )?.numero || ''
                      }
                      onChange={e =>
                        setUsuarioParaEditar({
                          ...usuarioParaEditar,
                          dadosOriginais: {
                            ...usuarioParaEditar.dadosOriginais,
                            numero: e.target.value,
                          },
                        })
                      }
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="complemento"
                      className="text-gray-700 font-medium"
                    >
                      Complemento
                    </Label>
                    <Input
                      id="complemento"
                      value={
                        (
                          usuarioParaEditar.dadosOriginais as Record<
                            string,
                            string
                          >
                        )?.complemento || ''
                      }
                      onChange={e =>
                        setUsuarioParaEditar({
                          ...usuarioParaEditar,
                          dadosOriginais: {
                            ...usuarioParaEditar.dadosOriginais,
                            complemento: e.target.value,
                          },
                        })
                      }
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="bairro"
                      className="text-gray-700 font-medium"
                    >
                      Bairro
                    </Label>
                    <Input
                      id="bairro"
                      value={
                        (
                          usuarioParaEditar.dadosOriginais as Record<
                            string,
                            string
                          >
                        )?.bairro || ''
                      }
                      onChange={e =>
                        setUsuarioParaEditar({
                          ...usuarioParaEditar,
                          dadosOriginais: {
                            ...usuarioParaEditar.dadosOriginais,
                            bairro: e.target.value,
                          },
                        })
                      }
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="cidade"
                      className="text-gray-700 font-medium"
                    >
                      Cidade
                    </Label>
                    <Input
                      id="cidade"
                      value={
                        (
                          usuarioParaEditar.dadosOriginais as Record<
                            string,
                            string
                          >
                        )?.cidade || ''
                      }
                      onChange={e =>
                        setUsuarioParaEditar({
                          ...usuarioParaEditar,
                          dadosOriginais: {
                            ...usuarioParaEditar.dadosOriginais,
                            cidade: e.target.value,
                          },
                        })
                      }
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="estado"
                      className="text-gray-700 font-medium"
                    >
                      Estado
                    </Label>
                    <select
                      value={
                        (
                          usuarioParaEditar.dadosOriginais as Record<
                            string,
                            string
                          >
                        )?.estado || ''
                      }
                      onChange={e =>
                        setUsuarioParaEditar({
                          ...usuarioParaEditar,
                          dadosOriginais: {
                            ...usuarioParaEditar.dadosOriginais,
                            estado: e.target.value,
                          },
                        })
                      }
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Selecione o estado</option>
                      <option value="AC">Acre</option>
                      <option value="AL">Alagoas</option>
                      <option value="AP">Amapá</option>
                      <option value="AM">Amazonas</option>
                      <option value="BA">Bahia</option>
                      <option value="CE">Ceará</option>
                      <option value="DF">Distrito Federal</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="GO">Goiás</option>
                      <option value="MA">Maranhão</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PA">Pará</option>
                      <option value="PB">Paraíba</option>
                      <option value="PR">Paraná</option>
                      <option value="PE">Pernambuco</option>
                      <option value="PI">Piauí</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="RN">Rio Grande do Norte</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="SP">São Paulo</option>
                      <option value="SE">Sergipe</option>
                      <option value="TO">Tocantins</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dados Bancários */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Dados Bancários
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="banco"
                      className="text-gray-700 font-medium"
                    >
                      Banco
                    </Label>
                    <Input
                      id="banco"
                      value={
                        (
                          usuarioParaEditar.dadosOriginais as Record<
                            string,
                            string
                          >
                        )?.banco_id || ''
                      }
                      onChange={e =>
                        setUsuarioParaEditar({
                          ...usuarioParaEditar,
                          dadosOriginais: {
                            ...usuarioParaEditar.dadosOriginais,
                            banco_id: e.target.value,
                          },
                        })
                      }
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="agencia"
                      className="text-gray-700 font-medium"
                    >
                      Agência
                    </Label>
                    <Input
                      id="agencia"
                      value={
                        (
                          usuarioParaEditar.dadosOriginais as Record<
                            string,
                            string
                          >
                        )?.agencia || ''
                      }
                      onChange={e =>
                        setUsuarioParaEditar({
                          ...usuarioParaEditar,
                          dadosOriginais: {
                            ...usuarioParaEditar.dadosOriginais,
                            agencia: e.target.value,
                          },
                        })
                      }
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="conta"
                      className="text-gray-700 font-medium"
                    >
                      Conta com Dígito
                    </Label>
                    <Input
                      id="conta"
                      value={
                        (
                          usuarioParaEditar.dadosOriginais as Record<
                            string,
                            string
                          >
                        )?.conta_digito || ''
                      }
                      onChange={e =>
                        setUsuarioParaEditar({
                          ...usuarioParaEditar,
                          dadosOriginais: {
                            ...usuarioParaEditar.dadosOriginais,
                            conta_digito: e.target.value,
                          },
                        })
                      }
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="00000-0"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="tipoConta"
                      className="text-gray-700 font-medium"
                    >
                      Tipo de Conta
                    </Label>
                    <select
                      value={
                        (
                          usuarioParaEditar.dadosOriginais as Record<
                            string,
                            string
                          >
                        )?.tipo_conta || ''
                      }
                      onChange={e =>
                        setUsuarioParaEditar({
                          ...usuarioParaEditar,
                          dadosOriginais: {
                            ...usuarioParaEditar.dadosOriginais,
                            tipo_conta: e.target.value,
                          },
                        })
                      }
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="corrente">Corrente</option>
                      <option value="poupanca">Poupança</option>
                    </select>
                  </div>

                  <div>
                    <Label
                      htmlFor="tipoPix"
                      className="text-gray-700 font-medium"
                    >
                      Tipo PIX
                    </Label>
                    <select
                      value={
                        (
                          usuarioParaEditar.dadosOriginais as Record<
                            string,
                            string
                          >
                        )?.tipo_pix || ''
                      }
                      onChange={e =>
                        setUsuarioParaEditar({
                          ...usuarioParaEditar,
                          dadosOriginais: {
                            ...usuarioParaEditar.dadosOriginais,
                            tipo_pix: e.target.value,
                          },
                        })
                      }
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="cpf">CPF</option>
                      <option value="cnpj">CNPJ</option>
                      <option value="telefone">Telefone</option>
                      <option value="email">E-mail</option>
                    </select>
                  </div>

                  <div>
                    <Label
                      htmlFor="chavePix"
                      className="text-gray-700 font-medium"
                    >
                      Chave PIX
                    </Label>
                    <Input
                      id="chavePix"
                      value={
                        (
                          usuarioParaEditar.dadosOriginais as Record<
                            string,
                            string
                          >
                        )?.chave_pix || ''
                      }
                      onChange={e =>
                        setUsuarioParaEditar({
                          ...usuarioParaEditar,
                          dadosOriginais: {
                            ...usuarioParaEditar.dadosOriginais,
                            chave_pix: e.target.value,
                          },
                        })
                      }
                      className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div>
                  <Label
                    htmlFor="status"
                    className="text-gray-900 font-semibold"
                  >
                    Status do Usuário
                  </Label>
                  <select
                    value={usuarioParaEditar.status}
                    onChange={e => {
                      const value = e.target.value as
                        | 'ativo'
                        | 'pendente'
                        | 'inativo';
                      setUsuarioParaEditar({
                        ...usuarioParaEditar,
                        status: value,
                      });
                    }}
                    className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="pendente">Pendente</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="bg-gray-50 -m-6 mt-6 p-6 rounded-b-lg">
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSalvarEdicao}
              disabled={isEditando}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isEditando ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent className="bg-holding-secondary border-holding-accent/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-holding-white">
              Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription className="text-holding-accent-light">
              Tem certeza que deseja excluir o usuário &quot;
              {usuarioParaExcluir?.nome}&quot;? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-holding-accent/30 text-holding-accent hover:text-holding-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmarExclusao}
              disabled={isExcluindo}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isExcluindo ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
