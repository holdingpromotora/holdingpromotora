'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Shield,
  Users,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Settings,
  Key,
} from 'lucide-react';
import Link from 'next/link';

interface TipoAcesso {
  id: string;
  nome: string;
  descricao: string;
  nivel: number;
  ativo: boolean;
  dataCriacao: string;
}

interface Permissao {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  ativo: boolean;
}

interface NivelAcesso {
  id: string;
  tipoAcessoId: string;
  tipoAcessoNome: string;
  permissoes: string[];
  ativo: boolean;
  dataCriacao: string;
}

export default function NiveisAcessoPage() {
  const [tiposAcesso, setTiposAcesso] = useState<TipoAcesso[]>([]);
  const [permissoes, setPermissoes] = useState<Permissao[]>([]);
  const [niveisAcesso, setNiveisAcesso] = useState<NivelAcesso[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para modais
  const [showTipoAcessoModal, setShowTipoAcessoModal] = useState(false);
  const [showPermissaoModal, setShowPermissaoModal] = useState(false);
  const [showNivelAcessoModal, setShowNivelAcessoModal] = useState(false);

  // Estados para formulários
  const [tipoAcessoForm, setTipoAcessoForm] = useState({
    nome: '',
    descricao: '',
    nivel: 1,
  });

  const [permissaoForm, setPermissaoForm] = useState({
    nome: '',
    descricao: '',
    categoria: 'sistema',
  });

  const [nivelAcessoForm, setNivelAcessoForm] = useState({
    tipoAcessoId: '',
    permissoes: [] as string[],
  });

  // Estados para edição
  const [editandoTipoAcesso, setEditandoTipoAcesso] =
    useState<TipoAcesso | null>(null);
  const [editandoPermissao, setEditandoPermissao] = useState<Permissao | null>(
    null
  );
  const [editandoNivelAcesso, setEditandoNivelAcesso] =
    useState<NivelAcesso | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setIsLoading(true);
    try {
      // Carregar dados mockados para demonstração
      const mockTiposAcesso: TipoAcesso[] = [
        {
          id: '1',
          nome: 'Master',
          descricao: 'Acesso total ao sistema',
          nivel: 1,
          ativo: true,
          dataCriacao: new Date().toISOString(),
        },
        {
          id: '2',
          nome: 'Submaster',
          descricao: 'Acesso administrativo limitado',
          nivel: 2,
          ativo: true,
          dataCriacao: new Date().toISOString(),
        },
        {
          id: '3',
          nome: 'Parceiro',
          descricao: 'Acesso a funcionalidades específicas',
          nivel: 3,
          ativo: true,
          dataCriacao: new Date().toISOString(),
        },
        {
          id: '4',
          nome: 'Colaborador',
          descricao: 'Acesso básico ao sistema',
          nivel: 4,
          ativo: true,
          dataCriacao: new Date().toISOString(),
        },
      ];

      const mockPermissoes: Permissao[] = [
        // Permissões de Usuários
        {
          id: '1',
          nome: 'visualizar_usuarios',
          descricao: 'Visualizar lista de usuários',
          categoria: 'usuarios',
          ativo: true,
        },
        {
          id: '2',
          nome: 'criar_usuarios',
          descricao: 'Criar novos usuários',
          categoria: 'usuarios',
          ativo: true,
        },
        {
          id: '3',
          nome: 'editar_usuarios',
          descricao: 'Editar usuários existentes',
          categoria: 'usuarios',
          ativo: true,
        },
        {
          id: '4',
          nome: 'excluir_usuarios',
          descricao: 'Excluir usuários',
          categoria: 'usuarios',
          ativo: true,
        },
        {
          id: '5',
          nome: 'visualizar_todos_usuarios',
          descricao: 'Visualizar usuários de outros',
          categoria: 'usuarios',
          ativo: true,
        },

        // Novas permissões para controle de registros próprios
        {
          id: '11',
          nome: 'visualizar_proprios_usuarios',
          descricao: 'Visualizar apenas usuários criados por si',
          categoria: 'usuarios',
          ativo: true,
        },
        {
          id: '12',
          nome: 'editar_proprios_usuarios',
          descricao: 'Editar apenas usuários criados por si',
          categoria: 'usuarios',
          ativo: true,
        },
        {
          id: '13',
          nome: 'excluir_proprios_usuarios',
          descricao: 'Excluir apenas usuários criados por si',
          categoria: 'usuarios',
          ativo: true,
        },

        // Permissões de Sistema
        {
          id: '6',
          nome: 'configurar_sistema',
          descricao: 'Configurações do sistema',
          categoria: 'sistema',
          ativo: true,
        },
        {
          id: '7',
          nome: 'gerenciar_backups',
          descricao: 'Gerenciar backups',
          categoria: 'sistema',
          ativo: true,
        },
        {
          id: '8',
          nome: 'visualizar_logs',
          descricao: 'Visualizar logs do sistema',
          categoria: 'sistema',
          ativo: true,
        },

        // Permissões de Relatórios
        {
          id: '9',
          nome: 'gerar_relatorios',
          descricao: 'Gerar relatórios',
          categoria: 'relatorios',
          ativo: true,
        },
        {
          id: '10',
          nome: 'exportar_dados',
          descricao: 'Exportar dados',
          categoria: 'relatorios',
          ativo: true,
        },

        // Novas permissões para relatórios próprios
        {
          id: '14',
          nome: 'visualizar_proprios_relatorios',
          descricao: 'Visualizar apenas relatórios criados por si',
          categoria: 'relatorios',
          ativo: true,
        },
        {
          id: '15',
          nome: 'editar_proprios_relatorios',
          descricao: 'Editar apenas relatórios criados por si',
          categoria: 'relatorios',
          ativo: true,
        },
        {
          id: '16',
          nome: 'excluir_proprios_relatorios',
          descricao: 'Excluir apenas relatórios criados por si',
          categoria: 'relatorios',
          ativo: true,
        },

        // Permissões para registros próprios (nova categoria)
        {
          id: '17',
          nome: 'visualizar_proprios_registros',
          descricao: 'Visualizar apenas registros criados por si',
          categoria: 'proprios',
          ativo: true,
        },
        {
          id: '18',
          nome: 'editar_proprios_registros',
          descricao: 'Editar apenas registros criados por si',
          categoria: 'proprios',
          ativo: true,
        },
        {
          id: '19',
          nome: 'excluir_proprios_registros',
          descricao: 'Excluir apenas registros criados por si',
          categoria: 'proprios',
          ativo: true,
        },
        {
          id: '20',
          nome: 'gerenciar_proprios_registros',
          descricao: 'Gerenciar completamente registros criados por si',
          categoria: 'proprios',
          ativo: true,
        },
      ];

      const mockNiveisAcesso: NivelAcesso[] = [
        {
          id: '1',
          tipoAcessoId: '1',
          tipoAcessoNome: 'Master',
          permissoes: [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
          ],
          ativo: true,
          dataCriacao: new Date().toISOString(),
        },
        {
          id: '2',
          tipoAcessoId: '2',
          tipoAcessoNome: 'Submaster',
          permissoes: [
            '1',
            '2',
            '3',
            '4',
            '5',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
          ],
          ativo: true,
          dataCriacao: new Date().toISOString(),
        },
        {
          id: '3',
          tipoAcessoId: '3',
          tipoAcessoNome: 'Parceiro',
          permissoes: [
            '1',
            '2',
            '3',
            '9',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
          ],
          ativo: true,
          dataCriacao: new Date().toISOString(),
        },
        {
          id: '4',
          tipoAcessoId: '4',
          tipoAcessoNome: 'Colaborador',
          permissoes: ['1', '9', '11', '14', '17'],
          ativo: true,
          dataCriacao: new Date().toISOString(),
        },
      ];

      setTiposAcesso(mockTiposAcesso);
      setPermissoes(mockPermissoes);
      setNiveisAcesso(mockNiveisAcesso);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Funções para Tipos de Acesso
  const handleCriarTipoAcesso = () => {
    if (!tipoAcessoForm.nome.trim()) return;

    const novoTipo: TipoAcesso = {
      id: Date.now().toString(),
      nome: tipoAcessoForm.nome,
      descricao: tipoAcessoForm.descricao,
      nivel: tipoAcessoForm.nivel,
      ativo: true,
      dataCriacao: new Date().toISOString(),
    };

    setTiposAcesso(prev => [...prev, novoTipo]);
    setTipoAcessoForm({ nome: '', descricao: '', nivel: 1 });
    setShowTipoAcessoModal(false);
  };

  const handleEditarTipoAcesso = (tipo: TipoAcesso) => {
    setEditandoTipoAcesso(tipo);
    setTipoAcessoForm({
      nome: tipo.nome,
      descricao: tipo.descricao,
      nivel: tipo.nivel,
    });
    setShowTipoAcessoModal(true);
  };

  const handleSalvarEdicaoTipoAcesso = () => {
    if (!editandoTipoAcesso) return;

    setTiposAcesso(prev =>
      prev.map(tipo =>
        tipo.id === editandoTipoAcesso.id
          ? { ...tipo, ...tipoAcessoForm }
          : tipo
      )
    );

    setEditandoTipoAcesso(null);
    setTipoAcessoForm({ nome: '', descricao: '', nivel: 1 });
    setShowTipoAcessoModal(false);
  };

  const handleExcluirTipoAcesso = (id: string) => {
    setTiposAcesso(prev => prev.filter(tipo => tipo.id !== id));
  };

  // Funções para Permissões
  const handleCriarPermissao = () => {
    if (!permissaoForm.nome.trim()) return;

    const novaPermissao: Permissao = {
      id: Date.now().toString(),
      nome: permissaoForm.nome,
      descricao: permissaoForm.descricao,
      categoria: permissaoForm.categoria,
      ativo: true,
    };

    setPermissoes(prev => [...prev, novaPermissao]);
    setPermissaoForm({ nome: '', descricao: '', categoria: 'sistema' });
    setShowPermissaoModal(false);
  };

  const handleEditarPermissao = (permissao: Permissao) => {
    setEditandoPermissao(permissao);
    setPermissaoForm({
      nome: permissao.nome,
      descricao: permissao.descricao,
      categoria: permissao.categoria,
    });
    setShowPermissaoModal(true);
  };

  const handleSalvarEdicaoPermissao = () => {
    if (!editandoPermissao) return;

    setPermissoes(prev =>
      prev.map(perm =>
        perm.id === editandoPermissao.id ? { ...perm, ...permissaoForm } : perm
      )
    );

    setEditandoPermissao(null);
    setPermissaoForm({ nome: '', descricao: '', categoria: 'sistema' });
    setShowPermissaoModal(false);
  };

  const handleExcluirPermissao = (id: string) => {
    setPermissoes(prev => prev.filter(perm => perm.id !== id));
  };

  // Funções para Níveis de Acesso
  const handleCriarNivelAcesso = () => {
    if (!nivelAcessoForm.tipoAcessoId) return;

    const tipoAcesso = tiposAcesso.find(
      t => t.id === nivelAcessoForm.tipoAcessoId
    );
    if (!tipoAcesso) return;

    const novoNivel: NivelAcesso = {
      id: Date.now().toString(),
      tipoAcessoId: nivelAcessoForm.tipoAcessoId,
      tipoAcessoNome: tipoAcesso.nome,
      permissoes: nivelAcessoForm.permissoes,
      ativo: true,
      dataCriacao: new Date().toISOString(),
    };

    setNiveisAcesso(prev => [...prev, novoNivel]);
    setNivelAcessoForm({ tipoAcessoId: '', permissoes: [] });
    setShowNivelAcessoModal(false);
  };

  const handleEditarNivelAcesso = (nivel: NivelAcesso) => {
    setEditandoNivelAcesso(nivel);
    setNivelAcessoForm({
      tipoAcessoId: nivel.tipoAcessoId,
      permissoes: nivel.permissoes,
    });
    setShowNivelAcessoModal(true);
  };

  const handleSalvarEdicaoNivelAcesso = () => {
    if (!editandoNivelAcesso) return;

    const tipoAcesso = tiposAcesso.find(
      t => t.id === nivelAcessoForm.tipoAcessoId
    );
    if (!tipoAcesso) return;

    setNiveisAcesso(prev =>
      prev.map(nivel =>
        nivel.id === editandoNivelAcesso.id
          ? {
              ...nivel,
              tipoAcessoId: nivelAcessoForm.tipoAcessoId,
              tipoAcessoNome: tipoAcesso.nome,
              permissoes: nivelAcessoForm.permissoes,
            }
          : nivel
      )
    );

    setEditandoNivelAcesso(null);
    setNivelAcessoForm({ tipoAcessoId: '', permissoes: [] });
    setShowNivelAcessoModal(false);
  };

  const handleExcluirNivelAcesso = (id: string) => {
    setNiveisAcesso(prev => prev.filter(nivel => nivel.id !== id));
  };

  const togglePermissao = (permissaoId: string) => {
    setNivelAcessoForm(prev => ({
      ...prev,
      permissoes: prev.permissoes.includes(permissaoId)
        ? prev.permissoes.filter(id => id !== permissaoId)
        : [...prev.permissoes, permissaoId],
    }));
  };

  // Funções para controle de categorias
  const marcarTodasCategoria = (categoria: string) => {
    const permissoesCategoria = permissoes.filter(
      p => p.categoria === categoria
    );
    const idsCategoria = permissoesCategoria.map(p => p.id);
    const outrasPermissoes = nivelAcessoForm.permissoes.filter(
      id => !idsCategoria.includes(id)
    );
    setNivelAcessoForm(prev => ({
      ...prev,
      permissoes: [...outrasPermissoes, ...idsCategoria],
    }));
  };

  const desmarcarTodasCategoria = (categoria: string) => {
    const permissoesCategoria = permissoes.filter(
      p => p.categoria === categoria
    );
    const idsCategoria = permissoesCategoria.map(p => p.id);
    const novasPermissoes = nivelAcessoForm.permissoes.filter(
      id => !idsCategoria.includes(id)
    );
    setNivelAcessoForm(prev => ({
      ...prev,
      permissoes: novasPermissoes,
    }));
  };

  const marcarTodasPermissoes = () => {
    const todasPermissoes = permissoes.map(p => p.id);
    setNivelAcessoForm(prev => ({ ...prev, permissoes: todasPermissoes }));
  };

  const desmarcarTodasPermissoes = () => {
    setNivelAcessoForm(prev => ({ ...prev, permissoes: [] }));
  };



  const getCategoriaNome = (categoria: string) => {
    const categorias: { [key: string]: string } = {
      usuarios: 'Usuários',
      sistema: 'Sistema',
      relatorios: 'Relatórios',
      proprios: 'Registros Próprios',
    };
    return categorias[categoria] || categoria;
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">
            Carregando níveis de acesso...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 rounded-2xl p-6 lg:p-8 shadow-2xl mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 to-blue-900/50"></div>
        <div className="absolute top-0 right-0 w-48 h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full -translate-y-24 lg:-translate-y-32 translate-x-24 lg:translate-x-32"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="flex-1">
            <div className="flex items-center space-x-4 lg:space-x-6 mb-4">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">
                  Níveis de Acesso
                </h1>
                <p className="text-blue-100 text-sm lg:text-lg">
                  Gerencie tipos de acesso e permissões do sistema
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link href="/usuarios">
              <Button className="bg-white text-slate-800 hover:bg-blue-50 hover:text-blue-700 border-2 border-white/50 hover:border-white transition-all duration-300 transform hover:scale-105 shadow-xl font-semibold px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl text-sm lg:text-base">
                <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3" />
                Voltar aos Usuários
              </Button>
            </Link>

            <Link href="/dashboard">
              <div className="relative group animate-pulse hover:animate-none">
                <div className="ring-4 ring-blue-400/30 hover:ring-blue-400/50 transition-all duration-300">
                  <Button className="bg-white text-slate-800 hover:bg-blue-50 hover:text-blue-700 border-2 border-white/50 hover:border-white transition-all duration-300 transform hover:scale-105 shadow-xl font-semibold px-4 lg:px-6 py-2 lg:py-3 rounded-lg lg:rounded-xl text-sm lg:text-base">
                    <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3" />
                    Voltar ao Dashboard
                  </Button>
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-1 -left-1 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                  Retornar ao painel principal
                </div>
              </div>
            </Link>
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
                  <Shield className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-xs lg:text-sm font-medium">
                    Tipos de Acesso
                  </p>
                  <p className="text-xl lg:text-3xl font-bold text-white">
                    {tiposAcesso.length}
                  </p>
                </div>
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
                  <Key className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-xs lg:text-sm font-medium">
                    Permissões
                  </p>
                  <p className="text-xl lg:text-3xl font-bold text-white">
                    {permissoes.length}
                  </p>
                </div>
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
                  <Settings className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-xs lg:text-sm font-medium">
                    Níveis Configurados
                  </p>
                  <p className="text-xl lg:text-3xl font-bold text-white">
                    {niveisAcesso.length}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 border-0 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent"></div>
          <CardContent className="p-4 lg:p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                  <Users className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-xs lg:text-sm font-medium">
                    Usuários Ativos
                  </p>
                  <p className="text-xl lg:text-3xl font-bold text-white">24</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Área de Gerenciamento */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Tipos de Acesso */}
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-800 flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span>Tipos de Acesso</span>
              </CardTitle>
              <Button
                size="sm"
                onClick={() => {
                  setEditandoTipoAcesso(null);
                  setTipoAcessoForm({ nome: '', descricao: '', nivel: 1 });
                  setShowTipoAcessoModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-2 text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {tiposAcesso.map(tipo => (
              <div
                key={tipo.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      Nível {tipo.nivel}
                    </Badge>
                    {tipo.ativo ? (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        Inativo
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm">
                    {tipo.nome}
                  </h4>
                  <p className="text-slate-600 text-xs">{tipo.descricao}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditarTipoAcesso(tipo)}
                    className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 p-2"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-600 hover:text-red-600 hover:bg-red-50 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Excluir Tipo de Acesso
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o tipo de acesso &quot;
                          {tipo.nome}&quot;? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleExcluirTipoAcesso(tipo.id)}
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Permissões */}
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-800 flex items-center space-x-2">
                <Key className="w-5 h-5 text-green-600" />
                <span>Permissões</span>
              </CardTitle>
              <Button
                size="sm"
                onClick={() => {
                  setEditandoPermissao(null);
                  setPermissaoForm({
                    nome: '',
                    descricao: '',
                    categoria: 'sistema',
                  });
                  setShowPermissaoModal(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-3 py-2 text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {permissoes.map(permissao => (
              <div
                key={permissao.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {getCategoriaNome(permissao.categoria)}
                    </Badge>
                    {permissao.ativo ? (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        Ativa
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        Inativa
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm">
                    {permissao.nome}
                  </h4>
                  <p className="text-slate-600 text-xs">
                    {permissao.descricao}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditarPermissao(permissao)}
                    className="text-slate-600 hover:text-green-600 hover:bg-green-50 p-2"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-600 hover:text-red-600 hover:bg-red-50 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Permissão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir a permissão &quot;
                          {permissao.nome}&quot;? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleExcluirPermissao(permissao.id)}
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Níveis de Acesso */}
        <Card className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-800 flex items-center space-x-2">
                <Settings className="w-5 h-5 text-amber-600" />
                <span>Níveis de Acesso</span>
              </CardTitle>
              <Button
                size="sm"
                onClick={() => {
                  setEditandoNivelAcesso(null);
                  setNivelAcessoForm({ tipoAcessoId: '', permissoes: [] });
                  setShowNivelAcessoModal(true);
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-3 py-2 text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {niveisAcesso.map(nivel => (
              <div
                key={nivel.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge className="bg-amber-100 text-amber-800 text-xs">
                      {nivel.tipoAcessoNome}
                    </Badge>
                    {nivel.ativo ? (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        Inativo
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm">
                    {nivel.permissoes.length} permissões
                  </h4>
                  <p className="text-slate-600 text-xs">
                    Criado em{' '}
                    {new Date(nivel.dataCriacao).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditarNivelAcesso(nivel)}
                    className="text-slate-600 hover:text-amber-600 hover:bg-amber-50 p-2"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-600 hover:text-red-600 hover:bg-red-50 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Excluir Nível de Acesso
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o nível de acesso para
                          &quot;{nivel.tipoAcessoNome}&quot;? Esta ação não pode ser
                          desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleExcluirNivelAcesso(nivel.id)}
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Modal Tipo de Acesso */}
      <Dialog open={showTipoAcessoModal} onOpenChange={setShowTipoAcessoModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editandoTipoAcesso
                ? 'Editar Tipo de Acesso'
                : 'Novo Tipo de Acesso'}
            </DialogTitle>
            <DialogDescription>
              {editandoTipoAcesso
                ? 'Edite as informações do tipo de acesso'
                : 'Crie um novo tipo de acesso para o sistema'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={tipoAcessoForm.nome}
                onChange={e =>
                  setTipoAcessoForm(prev => ({ ...prev, nome: e.target.value }))
                }
                placeholder="Ex: Master, Parceiro, Colaborador"
              />
            </div>
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={tipoAcessoForm.descricao}
                onChange={e =>
                  setTipoAcessoForm(prev => ({
                    ...prev,
                    descricao: e.target.value,
                  }))
                }
                placeholder="Descreva o tipo de acesso"
              />
            </div>
            <div>
              <Label htmlFor="nivel">Nível de Prioridade</Label>
              <select
                value={tipoAcessoForm.nivel.toString()}
                onChange={e =>
                  setTipoAcessoForm(prev => ({
                    ...prev,
                    nivel: parseInt(e.target.value),
                  }))
                }
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selecione o nível</option>
                <option value="1">1 - Máxima Prioridade</option>
                <option value="2">2 - Alta Prioridade</option>
                <option value="3">3 - Média Prioridade</option>
                <option value="4">4 - Baixa Prioridade</option>
                <option value="5">5 - Mínima Prioridade</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowTipoAcessoModal(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={
                editandoTipoAcesso
                  ? handleSalvarEdicaoTipoAcesso
                  : handleCriarTipoAcesso
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              {editandoTipoAcesso
                ? 'Salvar Alterações'
                : 'Criar Tipo de Acesso'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Permissão */}
      <Dialog open={showPermissaoModal} onOpenChange={setShowPermissaoModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editandoPermissao ? 'Editar Permissão' : 'Nova Permissão'}
            </DialogTitle>
            <DialogDescription>
              {editandoPermissao
                ? 'Edite as informações da permissão'
                : 'Crie uma nova permissão para o sistema'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nomePermissao">Nome da Permissão</Label>
              <Input
                id="nomePermissao"
                value={permissaoForm.nome}
                onChange={e =>
                  setPermissaoForm(prev => ({ ...prev, nome: e.target.value }))
                }
                placeholder="Ex: criar_usuarios, visualizar_relatorios"
              />
            </div>
            <div>
              <Label htmlFor="descricaoPermissao">Descrição</Label>
              <Input
                id="descricaoPermissao"
                value={permissaoForm.descricao}
                onChange={e =>
                  setPermissaoForm(prev => ({
                    ...prev,
                    descricao: e.target.value,
                  }))
                }
                placeholder="Descreva o que esta permissão permite"
              />
            </div>
            <div>
              <Label htmlFor="categoria">Categoria</Label>
                              <select
                  value={permissaoForm.categoria}
                  onChange={e =>
                    setPermissaoForm(prev => ({ ...prev, categoria: e.target.value }))
                  }
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selecione a categoria</option>
                  <option value="usuarios">Usuários</option>
                  <option value="sistema">Sistema</option>
                  <option value="relatorios">Relatórios</option>
                  <option value="proprios">Registros Próprios</option>
                  <option value="financeiro">Financeiro</option>
                  <option value="marketing">Marketing</option>
                </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPermissaoModal(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={
                editandoPermissao
                  ? handleSalvarEdicaoPermissao
                  : handleCriarPermissao
              }
              className="bg-green-600 hover:bg-green-700"
            >
              {editandoPermissao ? 'Salvar Alterações' : 'Criar Permissão'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Nível de Acesso */}
      <Dialog
        open={showNivelAcessoModal}
        onOpenChange={setShowNivelAcessoModal}
      >
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editandoNivelAcesso
                ? 'Editar Nível de Acesso'
                : 'Novo Nível de Acesso'}
            </DialogTitle>
            <DialogDescription>
              {editandoNivelAcesso
                ? 'Edite as permissões do nível de acesso'
                : 'Configure as permissões para um tipo de acesso'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label htmlFor="tipoAcesso">Tipo de Acesso</Label>
              <select
                value={nivelAcessoForm.tipoAcessoId}
                onChange={e =>
                  setNivelAcessoForm(prev => ({ ...prev, tipoAcessoId: e.target.value }))
                }
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selecione o tipo de acesso</option>
                {tiposAcesso.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nome} (Nível {tipo.nivel})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-base font-semibold mb-4 block">
                Permissões Disponíveis
              </Label>

              {/* Explicação sobre permissões de registros próprios */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="w-3 h-3 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-2">
                      Sobre Permissões de Registros Próprios
                    </h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>
                        • <strong>Visualizar Próprios:</strong> Usuário vê
                        apenas registros que criou
                      </p>
                      <p>
                        • <strong>Editar Próprios:</strong> Usuário pode
                        modificar apenas seus registros
                      </p>
                      <p>
                        • <strong>Excluir Próprios:</strong> Usuário pode
                        remover apenas seus registros
                      </p>
                      <p>
                        • <strong>Gerenciar Próprios:</strong> Controle total
                        sobre registros criados por si
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controles de Seleção em Massa */}
              <div className="flex items-center justify-between mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={marcarTodasPermissoes}
                    className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200 hover:border-green-300"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Marcar Todas
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={desmarcarTodasPermissoes}
                    className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200 hover:border-red-300"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Desmarcar Todas
                  </Button>
                </div>
                <div className="text-sm text-slate-600">
                  <span className="font-medium">
                    {nivelAcessoForm.permissoes.length}
                  </span>{' '}
                  de <span className="font-medium">{permissoes.length}</span>{' '}
                  permissões selecionadas
                </div>
              </div>

              <div className="space-y-4">
                {['usuarios', 'sistema', 'relatorios', 'proprios'].map(
                  categoria => {
                    const permissoesCategoria = permissoes.filter(
                      p => p.categoria === categoria
                    );
                    if (permissoesCategoria.length === 0) return null;

                    const permissoesSelecionadasCategoria =
                      nivelAcessoForm.permissoes.filter(id =>
                        permissoesCategoria.some(p => p.id === id)
                      );
                    const totalCategoria = permissoesCategoria.length;
                    const selecionadasCategoria =
                      permissoesSelecionadasCategoria.length;

                    return (
                      <div
                        key={categoria}
                        className="border border-slate-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-slate-900 flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-slate-600" />
                            <span>{getCategoriaNome(categoria)}</span>
                          </h4>
                          <div className="flex items-center space-x-3">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => marcarTodasCategoria(categoria)}
                              className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 hover:border-blue-300 text-xs px-2 py-1"
                              disabled={
                                selecionadasCategoria === totalCategoria
                              }
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Marcar Categoria
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => desmarcarTodasCategoria(categoria)}
                              className="bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200 hover:border-orange-300 text-xs px-2 py-1"
                              disabled={selecionadasCategoria === 0}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Desmarcar Categoria
                            </Button>
                            <Badge variant="outline" className="text-xs">
                              {selecionadasCategoria}/{totalCategoria}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {permissoesCategoria.map(permissao => (
                            <div
                              key={permissao.id}
                              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => togglePermissao(permissao.id)}
                                className={`w-8 h-8 p-0 rounded-full transition-all duration-200 ${
                                  nivelAcessoForm.permissoes.includes(
                                    permissao.id
                                  )
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200 scale-110'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-105'
                                }`}
                              >
                                {nivelAcessoForm.permissoes.includes(
                                  permissao.id
                                ) ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : (
                                  <XCircle className="w-4 h-4" />
                                )}
                              </Button>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">
                                  {permissao.nome}
                                </p>
                                <p className="text-xs text-slate-500 truncate">
                                  {permissao.descricao}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNivelAcessoModal(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={
                editandoNivelAcesso
                  ? handleSalvarEdicaoNivelAcesso
                  : handleCriarNivelAcesso
              }
              className="bg-amber-600 hover:bg-amber-700"
              disabled={!nivelAcessoForm.tipoAcessoId}
            >
              {editandoNivelAcesso
                ? 'Salvar Alterações'
                : 'Criar Nível de Acesso'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
