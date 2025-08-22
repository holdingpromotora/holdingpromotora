'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
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
  UserCheck,
  Eye,
  User,
  RefreshCw,
  AlertCircle,
  BarChart3,
  Building2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TipoAcesso {
  id: string;
  nome: string;
  descricao: string;
  nivel: number;
  ativo: boolean;
  dataCriacao: string;
  permissoes?: {
    [categoria: string]: Array<{
      id: string;
      nome: string;
      descricao: string;
      acao: string;
      recurso: string;
    }>;
  };
}

interface Permissao {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  ativo: boolean;
}

export default function NiveisAcessoPage() {
  const [tiposAcesso, setTiposAcesso] = useState<TipoAcesso[]>([]);
  const [permissoes, setPermissoes] = useState<Permissao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [permissoesCarregadas, setPermissoesCarregadas] = useState<Set<string>>(
    new Set()
  );

  // Estados para modais
  const [showTipoAcessoModal, setShowTipoAcessoModal] = useState(false);
  const [showPermissaoModal, setShowPermissaoModal] = useState(false);
  const [showPerfilModal, setShowPerfilModal] = useState(false);

  // Estados para alertas
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');

  // Estados para formulários
  const [tipoAcessoForm, setTipoAcessoForm] = useState({
    nome: '',
    descricao: '',
    nivel: 1,
  });

  const [permissaoForm, setPermissaoForm] = useState({
    nome: '',
    descricao: '',
    categoria: 'usuarios',
  });

  const [perfilForm, setPerfilForm] = useState({
    tipoAcessoId: '',
    tipoAcessoNome: '',
    permissoes: {
      usuarios: {
        visualizar: false,
        criar: false,
        editar: false,
        excluir: false,
        aprovar: false,
        proprios: false,
      },
      clientes: {
        visualizar: false,
        criar: false,
        editar: false,
        excluir: false,
        proprios: false,
      },
      dashboard: {
        acessoTotal: false,
        acessoLimitado: false,
        proprios: false,
      },
      sistema: {
        tiposAcesso: false,
        configuracoes: false,
        relatorios: false,
        proprios: false,
      },
      proprios: {
        visualizar: false,
        editar: false,
        excluir: false,
      },
    },
  });

  // Estados para edição
  const [editandoTipoAcesso, setEditandoTipoAcesso] =
    useState<TipoAcesso | null>(null);
  const [editandoPermissao, setEditandoPermissao] = useState<Permissao | null>(
    null
  );
  const [editandoPerfil, setEditandoPerfil] = useState<{
    tipoAcessoId: string;
    tipoAcessoNome: string;
    permissoes: any;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    carregarDados();
  }, []);

  // Função para exibir alertas
  const showSuccessAlert = (message: string) => {
    setAlertMessage(message);
    setAlertType('success');
    setShowAlert(true);
    setTimeout(() => {
      const alertElement = document.querySelector('.alert-container');
      if (alertElement) {
        alertElement.classList.add('animate-[slideOut_0.3s_ease-in]');
        setTimeout(() => setShowAlert(false), 300);
      } else {
        setShowAlert(false);
      }
    }, 5000);
  };

  const showErrorAlert = (message: string) => {
    setAlertMessage(message);
    setAlertType('error');
    setShowAlert(true);
    setTimeout(() => {
      const alertElement = document.querySelector('.alert-container');
      if (alertElement) {
        alertElement.classList.add('animate-[slideOut_0.3s_ease-in]');
        setTimeout(() => setShowAlert(false), 300);
      } else {
        setShowAlert(false);
      }
    }, 5000);
  };

  const carregarDados = async () => {
    try {
      setIsLoading(true);

      // Carregar tipos de acesso
      const response = await fetch('/api/niveis-acesso');
      if (response.ok) {
        const data = await response.json();
        setTiposAcesso(data);
      }

      // Dados simulados para permissões
      setPermissoes([
        // USUÁRIOS
        {
          id: '1',
          nome: 'Visualizar Usuários',
          descricao: 'Pode visualizar lista de usuários',
          categoria: 'usuarios',
          ativo: true,
        },
        {
          id: '2',
          nome: 'Criar Usuários',
          descricao: 'Pode criar novos usuários',
          categoria: 'usuarios',
          ativo: true,
        },
        {
          id: '3',
          nome: 'Editar Usuários',
          descricao: 'Pode editar usuários existentes',
          categoria: 'usuarios',
          ativo: true,
        },
        {
          id: '4',
          nome: 'Excluir Usuários',
          descricao: 'Pode excluir usuários',
          categoria: 'usuarios',
          ativo: true,
        },
        {
          id: '5',
          nome: 'Aprovar Usuários',
          descricao: 'Pode aprovar novos usuários',
          categoria: 'usuarios',
          ativo: true,
        },
        // CLIENTES
        {
          id: '6',
          nome: 'Visualizar Clientes',
          descricao: 'Pode visualizar lista de clientes',
          categoria: 'clientes',
          ativo: true,
        },
        {
          id: '7',
          nome: 'Criar Clientes',
          descricao: 'Pode criar novos clientes',
          categoria: 'clientes',
          ativo: true,
        },
        {
          id: '8',
          nome: 'Editar Clientes',
          descricao: 'Pode editar clientes existentes',
          categoria: 'clientes',
          ativo: true,
        },
        {
          id: '9',
          nome: 'Excluir Clientes',
          descricao: 'Pode excluir clientes',
          categoria: 'clientes',
          ativo: true,
        },
        // DASHBOARD
        {
          id: '10',
          nome: 'Acesso Total ao Dashboard',
          descricao: 'Pode acessar todos os dados do dashboard',
          categoria: 'dashboard',
          ativo: true,
        },
        {
          id: '11',
          nome: 'Acesso Limitado ao Dashboard',
          descricao: 'Pode acessar dados limitados do dashboard',
          categoria: 'dashboard',
          ativo: true,
        },
        // SISTEMA
        {
          id: '12',
          nome: 'Gerenciar Tipos de Acesso',
          descricao: 'Pode criar, editar e excluir tipos de acesso',
          categoria: 'sistema',
          ativo: true,
        },
        {
          id: '13',
          nome: 'Configurações do Sistema',
          descricao: 'Pode alterar configurações gerais do sistema',
          categoria: 'sistema',
          ativo: true,
        },
        {
          id: '14',
          nome: 'Gerenciar Relatórios',
          descricao: 'Pode criar, visualizar e exportar relatórios',
          categoria: 'sistema',
          ativo: true,
        },
        // REGISTROS PRÓPRIOS
        {
          id: '15',
          nome: 'Visualizar Registros Próprios',
          descricao: 'Pode visualizar apenas registros que criou',
          categoria: 'proprios',
          ativo: true,
        },
        {
          id: '16',
          nome: 'Editar Registros Próprios',
          descricao: 'Pode editar apenas registros que criou',
          categoria: 'proprios',
          ativo: true,
        },
        {
          id: '17',
          nome: 'Excluir Registros Próprios',
          descricao: 'Pode excluir apenas registros que criou',
          categoria: 'proprios',
          ativo: true,
        },
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  // Funções para Tipos de Acesso
  const handleCriarTipoAcesso = async () => {
    if (!tipoAcessoForm.nome.trim()) return;

    try {
      const response = await fetch('/api/niveis-acesso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tipoAcessoForm),
      });

      if (response.ok) {
        const novoTipo = await response.json();
        const tipoConvertido: TipoAcesso = {
          id: novoTipo.id.toString(),
          nome: novoTipo.nome,
          descricao: novoTipo.descricao || '',
          nivel: novoTipo.nivel,
          ativo: novoTipo.ativo,
          dataCriacao: novoTipo.created_at || new Date().toISOString(),
        };

        setTiposAcesso(prev => [...prev, tipoConvertido]);
        setTipoAcessoForm({ nome: '', descricao: '', nivel: 1 });
        setShowTipoAcessoModal(false);

        // Atualizar formulários automaticamente
        const novaCategoria = tipoConvertido.nome
          .toLowerCase()
          .replace(/\s+/g, '_');
        if (!permissoes.some(p => p.categoria === novaCategoria)) {
          gerarPermissoesParaCategoria(novaCategoria);
          atualizarFormulariosComNovaCategoria(novaCategoria);
        }

        carregarDados();
        showSuccessAlert('Tipo de acesso criado com sucesso!');
      } else {
        const errorData = await response.json();
        showErrorAlert(
          `Erro ao criar tipo de acesso: ${errorData.error || 'Erro desconhecido'}`
        );
      }
    } catch (error) {
      console.error('Erro ao criar tipo de acesso:', error);
      showErrorAlert('Erro ao criar tipo de acesso');
    }
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

    // Verificar se o nome foi alterado (pode afetar a categoria)
    const nomeAlterado = editandoTipoAcesso.nome !== tipoAcessoForm.nome;

    setTiposAcesso(prev =>
      prev.map(tipo =>
        tipo.id === editandoTipoAcesso.id
          ? { ...tipo, ...tipoAcessoForm }
          : tipo
      )
    );

    // Se o nome foi alterado, atualizar formulários
    if (nomeAlterado) {
      const novaCategoria = tipoAcessoForm.nome
        .toLowerCase()
        .replace(/\s+/g, '_');
      if (!permissoes.some(p => p.categoria === novaCategoria)) {
        gerarPermissoesParaCategoria(novaCategoria);
        atualizarFormulariosComNovaCategoria(novaCategoria);
      }
    }

    setEditandoTipoAcesso(null);
    setTipoAcessoForm({ nome: '', descricao: '', nivel: 1 });
    setShowTipoAcessoModal(false);
    showSuccessAlert('Tipo de acesso atualizado com sucesso!');
  };

  const handleExcluirTipoAcesso = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este tipo de acesso?')) {
      setTiposAcesso(prev => prev.filter(tipo => tipo.id !== id));
    }
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

    // Verificar se é uma nova categoria
    const categoriaExiste = permissoes.some(
      p => p.categoria === permissaoForm.categoria
    );

    if (!categoriaExiste) {
      // Se for nova categoria, gerar permissões padrão e atualizar formulários
      gerarPermissoesParaCategoria(permissaoForm.categoria);
      atualizarFormulariosComNovaCategoria(permissaoForm.categoria);
      showSuccessAlert(
        `Nova categoria "${permissaoForm.categoria}" criada com permissões padrão!`
      );
    } else {
      // Se categoria já existe, apenas adicionar a nova permissão
      setPermissoes(prev => [...prev, novaPermissao]);
      showSuccessAlert('Permissão criada com sucesso!');
    }

    setPermissaoForm({
      nome: '',
      descricao: '',
      categoria: 'usuarios',
    });
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

    // Verificar se a categoria foi alterada
    const categoriaAlterada =
      editandoPermissao.categoria !== permissaoForm.categoria;

    setPermissoes(prev =>
      prev.map(permissao =>
        permissao.id === editandoPermissao.id
          ? { ...permissao, ...permissaoForm }
          : permissao
      )
    );

    // Se a categoria foi alterada, atualizar formulários
    if (categoriaAlterada) {
      const novaCategoria = permissaoForm.categoria;
      if (!permissoes.some(p => p.categoria === novaCategoria)) {
        gerarPermissoesParaCategoria(novaCategoria);
        atualizarFormulariosComNovaCategoria(novaCategoria);
      }
    }

    setEditandoPermissao(null);
    setPermissaoForm({
      nome: '',
      descricao: '',
      categoria: 'usuarios',
    });
    setShowPermissaoModal(false);
    showSuccessAlert('Permissão atualizada com sucesso!');
  };

  const handleExcluirPermissao = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta permissão?')) {
      setPermissoes(prev => prev.filter(permissao => permissao.id !== id));
    }
  };

  // Função para gerar permissões automaticamente para uma nova categoria
  const gerarPermissoesParaCategoria = (categoria: string) => {
    const permissoesPadrao = [
      {
        id: Date.now().toString() + '_1',
        nome: `Visualizar ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}`,
        descricao: `Pode visualizar lista de ${categoria}`,
        categoria: categoria,
        ativo: true,
      },
      {
        id: Date.now().toString() + '_2',
        nome: `Criar ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}`,
        descricao: `Pode criar novos ${categoria}`,
        categoria: categoria,
        ativo: true,
      },
      {
        id: Date.now().toString() + '_3',
        nome: `Editar ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}`,
        descricao: `Pode editar ${categoria} existentes`,
        categoria: categoria,
        ativo: true,
      },
      {
        id: Date.now().toString() + '_4',
        nome: `Excluir ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}`,
        descricao: `Pode excluir ${categoria}`,
        categoria: categoria,
        ativo: true,
      },
      {
        id: Date.now().toString() + '_5',
        nome: `Gerenciar ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}`,
        descricao: `Pode gerenciar configurações de ${categoria}`,
        categoria: categoria,
        ativo: true,
      },
    ];

    setPermissoes(prev => [...prev, ...permissoesPadrao]);
    return permissoesPadrao;
  };

  // Função para atualizar formulários com nova categoria
  const atualizarFormulariosComNovaCategoria = (categoria: string) => {
    // Atualizar perfilForm com nova categoria
    setPerfilForm(prev => ({
      ...prev,
      permissoes: {
        ...prev.permissoes,
        [categoria]: {
          visualizar: false,
          criar: false,
          editar: false,
          excluir: false,
          gerenciar: false,
          proprios: false,
        },
      },
    }));

    // Atualizar permissaoForm se estiver na mesma categoria
    if (permissaoForm.categoria === categoria) {
      setPermissaoForm(prev => ({
        ...prev,
        categoria: 'usuarios', // Reset para categoria padrão
      }));
    }
  };

  // Funções para Perfis
  const handleCriarPerfil = () => {
    if (!perfilForm.tipoAcessoId) return;

    console.log('Permissões a serem configuradas:', perfilForm);

    setPerfilForm({
      tipoAcessoId: '',
      tipoAcessoNome: '',
      permissoes: {
        usuarios: {
          visualizar: false,
          criar: false,
          editar: false,
          excluir: false,
          aprovar: false,
          proprios: false,
        },
        clientes: {
          visualizar: false,
          criar: false,
          editar: false,
          excluir: false,
          proprios: false,
        },
        dashboard: {
          acessoTotal: false,
          acessoLimitado: false,
          proprios: false,
        },
        sistema: {
          tiposAcesso: false,
          configuracoes: false,
          relatorios: false,
          proprios: false,
        },
        proprios: {
          visualizar: false,
          editar: false,
          excluir: false,
        },
      },
    });
    setShowPerfilModal(false);

    showSuccessAlert(
      'Permissões configuradas com sucesso! (Funcionalidade será implementada com o banco de dados)'
    );
  };

  const handleEditarPerfil = (perfil: any) => {
    setEditandoPerfil(perfil);
    setPerfilForm({
      tipoAcessoId: perfil.tipoAcessoId,
      tipoAcessoNome: perfil.tipoAcessoNome,
      permissoes: perfil.permissoes,
    });
    setShowPerfilModal(true);
  };

  const carregarPermissoesTipoAcesso = async (tipo: TipoAcesso) => {
    if (permissoesCarregadas.has(tipo.id)) {
      return; // Já foi carregado
    }

    try {
      const response = await fetch('/api/tipo-acesso-permissoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tipo_acesso_id: tipo.id }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Atualizar o tipo de acesso com suas permissões
          setTiposAcesso(prev =>
            prev.map(t =>
              t.id === tipo.id ? { ...t, permissoes: data.permissoes } : t
            )
          );
          setPermissoesCarregadas(prev => new Set(prev).add(tipo.id));
        }
      }
    } catch (error) {
      console.error('Erro ao carregar permissões do tipo de acesso:', error);
    }
  };

  const handleEditarPermissoesTipoAcesso = (tipo: TipoAcesso) => {
    setEditandoPerfil({
      tipoAcessoId: tipo.id,
      tipoAcessoNome: tipo.nome,
      permissoes: {
        usuarios: {
          visualizar: false,
          criar: false,
          editar: false,
          excluir: false,
          aprovar: false,
          proprios: false,
        },
        clientes: {
          visualizar: false,
          criar: false,
          editar: false,
          excluir: false,
          proprios: false,
        },
        dashboard: {
          acessoTotal: false,
          acessoLimitado: false,
          proprios: false,
        },
        sistema: {
          tiposAcesso: false,
          configuracoes: false,
          relatorios: false,
          proprios: false,
        },
        proprios: {
          visualizar: false,
          editar: false,
          excluir: false,
        },
      },
    });
    setPerfilForm({
      tipoAcessoId: tipo.id,
      tipoAcessoNome: tipo.nome,
      permissoes: {
        usuarios: {
          visualizar: false,
          criar: false,
          editar: false,
          excluir: false,
          aprovar: false,
          proprios: false,
        },
        clientes: {
          visualizar: false,
          criar: false,
          editar: false,
          excluir: false,
          proprios: false,
        },
        dashboard: {
          acessoTotal: false,
          acessoLimitado: false,
          proprios: false,
        },
        sistema: {
          tiposAcesso: false,
          configuracoes: false,
          relatorios: false,
          proprios: false,
        },
        proprios: {
          visualizar: false,
          editar: false,
          excluir: false,
        },
      },
    });
    setShowPerfilModal(true);
  };

  const handleSalvarEdicaoPerfil = () => {
    if (!editandoPerfil) return;

    console.log('Perfil a ser atualizado:', perfilForm);

    setEditandoPerfil(null);
    setPerfilForm({
      tipoAcessoId: '',
      tipoAcessoNome: '',
      permissoes: {
        usuarios: {
          visualizar: false,
          criar: false,
          editar: false,
          excluir: false,
          aprovar: false,
          proprios: false,
        },
        clientes: {
          visualizar: false,
          criar: false,
          editar: false,
          excluir: false,
          proprios: false,
        },
        dashboard: {
          acessoTotal: false,
          acessoLimitado: false,
          proprios: false,
        },
        sistema: {
          tiposAcesso: false,
          configuracoes: false,
          relatorios: false,
          proprios: false,
        },
        proprios: {
          visualizar: false,
          editar: false,
          excluir: false,
        },
      },
    });
    setShowPerfilModal(false);

    showSuccessAlert(
      'Permissões atualizadas com sucesso! (Funcionalidade será implementada com o banco de dados)'
    );
  };

  if (isLoading) {
    return (
      <div
        className={`${sidebarExpanded ? 'pl-80' : 'pl-24'} p-4 md:p-8 space-y-6 md:space-y-8`}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-holding-blue-light" />
            <p className="text-holding-blue-light">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`${sidebarExpanded ? 'pl-80' : 'pl-24'} p-4 md:p-8 space-y-6 md:space-y-8`}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
            <p className="text-red-500">{error}</p>
            <Button onClick={carregarDados} className="mt-4">
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${sidebarExpanded ? 'pl-80' : 'pl-24'} p-4 md:p-8 space-y-6 md:space-y-8`}
    >
      {/* Alertas */}
      {showAlert && (
        <div className="fixed top-6 right-6 z-50 max-w-sm md:max-w-md mx-4 animate-[slideIn_0.5s_ease-out] alert-container">
          <div
            className={`relative overflow-hidden rounded-xl shadow-2xl border-l-4 p-6 backdrop-blur-sm ${
              alertType === 'success'
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-500 text-green-800 shadow-green-200/50'
                : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-500 text-red-800 shadow-red-200/50'
            }`}
          >
            {/* Barra de progresso */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 rounded-t-xl overflow-hidden">
              <div
                className={`h-full transition-all duration-5000 ease-linear ${
                  alertType === 'success'
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                    : 'bg-gradient-to-r from-red-400 to-rose-500'
                }`}
                style={{ animation: 'progress 5s linear forwards' }}
              />
            </div>

            <div className="flex items-start space-x-4">
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                  alertType === 'success'
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-300/50'
                    : 'bg-gradient-to-br from-red-400 to-rose-500 shadow-red-300/50'
                }`}
              >
                {alertType === 'success' ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <XCircle className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold mb-1">
                  {alertType === 'success' ? 'Operação Concluída!' : 'Atenção!'}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {alertMessage}
                </p>
              </div>
              <button
                onClick={() => setShowAlert(false)}
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 transition-all duration-200 group hover:shadow-md"
                title="Fechar alerta"
              >
                <XCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>

            {/* Ícones decorativos */}
            <div className="absolute -top-2 -right-2 w-16 h-16 opacity-10">
              {alertType === 'success' ? (
                <CheckCircle className="w-full h-full text-green-400" />
              ) : (
                <XCircle className="w-full h-full text-red-400" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-holding-white mb-2">
            Níveis de Acesso
          </h1>
          <p className="text-holding-blue-light mb-4 md:mb-6 text-sm md:text-base">
            Gerencie tipos de acesso e permissões do sistema
          </p>
        </div>

        {/* Botões de Ação - ABAIXO do subtítulo */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 niveis-acesso-buttons">
          <Button
            onClick={() => router.push('/usuarios')}
            className="bg-gradient-to-r from-holding-blue-light to-holding-blue-medium hover:from-holding-blue-medium hover:to-holding-blue-light text-holding-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 font-semibold w-full sm:w-auto niveis-acesso-button"
          >
            <Users className="w-5 h-5 mr-3" />
            Gerenciar Usuários
          </Button>
          <Button
            onClick={() => router.push('/usuarios/aprovacao')}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 font-semibold w-full sm:w-auto niveis-acesso-button"
          >
            <UserCheck className="w-5 h-5 mr-3" />
            Aprovações
          </Button>
          <Button
            onClick={() => setShowTipoAcessoModal(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 font-semibold w-full sm:w-auto niveis-acesso-button"
          >
            <Shield className="w-5 h-5 mr-3" />
            Criar Tipo de Acesso
          </Button>
          <Button
            onClick={() => setShowPerfilModal(true)}
            className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 font-semibold w-full sm:w-auto niveis-acesso-button"
          >
            <User className="w-5 h-5 mr-3" />
            Configurar Permissões
          </Button>
          <Button
            onClick={() => setShowPermissaoModal(true)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 font-semibold w-full sm:w-auto niveis-acesso-button"
          >
            <Key className="w-5 h-5 mr-3" />
            Criar Permissões
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="glass-effect-accent border-holding-accent/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg text-holding-white flex items-center">
              <Shield className="w-4 h-4 md:w-5 md:h-5 mr-2 text-holding-blue-light" />
              Tipos de Acesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-holding-white">
              {tiposAcesso.length}
            </div>
            <p className="text-holding-blue-light text-xs md:text-sm">
              Total de tipos configurados
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect-accent border-holding-accent/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg text-holding-white flex items-center">
              <Key className="w-4 h-4 md:w-5 md:h-5 mr-2 text-holding-blue-light" />
              Permissões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-holding-white">
              {permissoes.length}
            </div>
            <p className="text-holding-blue-light text-xs md:text-sm">
              Total de permissões
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect-accent border-holding-accent/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg text-holding-white flex items-center">
              <Users className="w-4 h-4 md:w-5 md:h-5 mr-2 text-holding-blue-light" />
              Usuários Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-holding-white">
              0
            </div>
            <p className="text-holding-blue-light text-xs md:text-sm">
              Com acesso liberado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Tipos de Acesso */}
      <Card className="glass-effect-accent border-holding-accent/30">
        <CardHeader className="bg-gradient-to-r from-holding-blue-deep/50 to-holding-blue-dark/50 border-b border-holding-blue-light/20">
          <CardTitle className="text-xl text-holding-white flex items-center">
            <Shield className="w-6 h-6 mr-3 text-holding-blue-light" />
            Tipos de Acesso Configurados
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {tiposAcesso.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-holding-blue-light/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-holding-blue-light/50" />
              </div>
              <p className="text-holding-blue-light text-lg font-medium mb-2">
                Nenhum tipo de acesso configurado
              </p>
              <p className="text-holding-blue-light/70 text-sm">
                Clique em &quot;Criar Tipo de Acesso&quot; para começar
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4">
              {tiposAcesso.map(tipo => (
                <Card
                  key={tipo.id}
                  className="bg-gradient-to-br from-holding-blue-profound/60 to-holding-blue-profound/40 border border-holding-blue-light/30 hover:border-holding-blue-light/50 transition-all duration-300 hover:shadow-lg hover:shadow-holding-blue-light/10 group cursor-pointer"
                  onClick={() => carregarPermissoesTipoAcesso(tipo)}
                >
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-holding-blue-light/20 to-holding-blue-light/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Shield className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-holding-blue-light" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditarPermissoesTipoAcesso(tipo)}
                          className="w-6 h-6 md:w-8 md:h-8 p-0 border-holding-blue-light/30 text-holding-blue-light hover:bg-holding-blue-light/20 hover:border-holding-blue-light/50 hover:scale-110 transition-all duration-200 rounded-lg"
                          title="Editar permissões do tipo de acesso"
                        >
                          <Edit className="w-2.5 h-2.5 md:w-3 md:h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-6 h-6 md:w-8 md:h-8 p-0 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 hover:scale-110 transition-all duration-200 rounded-lg"
                          onClick={() => handleExcluirTipoAcesso(tipo.id)}
                          title="Excluir tipo de acesso"
                        >
                          <Trash2 className="w-2.5 h-2.5 md:w-3 md:h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1.5 md:space-y-2">
                      <h3 className="text-sm md:text-base font-bold text-holding-white group-hover:text-holding-blue-light transition-colors duration-200">
                        {tipo.nome}
                      </h3>
                      <p className="text-xs text-holding-blue-light/80 leading-relaxed">
                        {tipo.descricao}
                      </p>

                      <div className="flex items-center space-x-1.5 md:space-x-2 pt-1">
                        <Badge
                          variant="secondary"
                          className="bg-holding-blue-light/20 text-holding-blue-light border-holding-blue-light/30 px-1.5 md:px-2 py-0.5 text-xs font-medium"
                        >
                          Nível {tipo.nivel}
                        </Badge>
                        <Badge
                          variant={tipo.ativo ? 'default' : 'destructive'}
                          className={`px-1.5 md:px-2 py-0.5 text-xs font-medium ${
                            tipo.ativo
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : 'bg-red-500/20 text-red-400 border-red-500/30'
                          }`}
                        >
                          {tipo.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>

                      {/* Permissões de Acesso */}
                      <div className="pt-1.5 md:pt-2 border-t border-holding-blue-light/20">
                        <h4 className="text-xs font-semibold text-holding-blue-light mb-1">
                          Permissões de Acesso:
                        </h4>
                        <div className="space-y-0.5 md:space-y-1">
                          {tipo.permissoes ? (
                            // Mostrar permissões reais carregadas do banco
                            Object.entries(tipo.permissoes).map(
                              ([categoria, perms]) => (
                                <div
                                  key={categoria}
                                  className="space-y-0.5 md:space-y-1"
                                >
                                  {perms.slice(0, 3).map(perm => (
                                    <div
                                      key={perm.id}
                                      className="flex items-center space-x-1.5 md:space-x-2"
                                    >
                                      <div className="w-1.5 h-1.5 bg-holding-blue-light rounded-full"></div>
                                      <span className="text-xs text-holding-blue-light">
                                        {perm.acao} {perm.recurso}
                                      </span>
                                    </div>
                                  ))}
                                  {perms.length > 3 && (
                                    <div className="flex items-center space-x-1.5 md:space-x-2">
                                      <div className="w-1.5 h-1.5 bg-holding-blue-light/50 rounded-full"></div>
                                      <span className="text-xs text-holding-blue-light/70">
                                        +{perms.length - 3} mais permissões
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )
                            )
                          ) : (
                            // Mostrar permissões baseadas no nível (fallback)
                            <>
                              {tipo.nivel >= 5 && (
                                <div className="flex items-center space-x-1.5 md:space-x-2">
                                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                  <span className="text-xs text-holding-blue-light">
                                    Acesso total ao sistema
                                  </span>
                                </div>
                              )}
                              {tipo.nivel >= 4 && (
                                <div className="flex items-center space-x-1.5 md:space-x-2">
                                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                  <span className="text-xs text-holding-blue-light">
                                    Gerenciar usuários e clientes
                                  </span>
                                </div>
                              )}
                              {tipo.nivel >= 3 && (
                                <div className="flex items-center space-x-1.5 md:space-x-2">
                                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                                  <span className="text-xs text-holding-blue-light">
                                    Editar registros
                                  </span>
                                </div>
                              )}
                              {tipo.nivel >= 2 && (
                                <div className="flex items-center space-x-1.5 md:space-x-2">
                                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                                  <span className="text-xs text-holding-blue-light">
                                    Visualizar dados
                                  </span>
                                </div>
                              )}
                              {tipo.nivel >= 1 && (
                                <div className="flex items-center space-x-1.5 md:space-x-2">
                                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                  <span className="text-xs text-holding-blue-light">
                                    Acesso básico
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Permissões */}
      <Card className="glass-effect-accent border-holding-accent/30">
        <CardHeader className="bg-gradient-to-r from-holding-blue-deep/50 to-holding-blue-dark/50 border-b border-holding-blue-light/20">
          <CardTitle className="text-xl text-holding-white flex items-center">
            <Key className="w-6 h-6 mr-3 text-holding-blue-light" />
            Permissões Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <Tabs defaultValue="usuarios" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-holding-blue-profound/80 border border-holding-blue-light/30">
              <TabsTrigger
                value="usuarios"
                className="data-[state=active]:bg-holding-blue-light/20 data-[state=active]:text-holding-blue-light data-[state=active]:border-holding-blue-light/50"
              >
                <Users className="w-4 h-4 mr-2" />
                Usuários
              </TabsTrigger>
              <TabsTrigger
                value="clientes"
                className="data-[state=active]:bg-holding-blue-light/20 data-[state=active]:text-holding-blue-light data-[state=active]:border-holding-blue-light/50"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Clientes
              </TabsTrigger>
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:bg-holding-blue-light/20 data-[state=active]:text-holding-blue-light data-[state=active]:border-holding-blue-light/50"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="sistema"
                className="data-[state=active]:bg-holding-blue-light/20 data-[state=active]:text-holding-blue-light data-[state=active]:border-holding-blue-light/50"
              >
                <Settings className="w-4 h-4 mr-2" />
                Sistema
              </TabsTrigger>
              <TabsTrigger
                value="proprios"
                className="data-[state=active]:bg-holding-blue-light/20 data-[state=active]:text-holding-blue-light data-[state=active]:border-holding-blue-light/50"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Próprios
              </TabsTrigger>
            </TabsList>

            {/* Aba Usuários */}
            <TabsContent value="usuarios" className="mt-4 md:mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4">
                {permissoes
                  .filter(p => p.categoria === 'usuarios')
                  .map(permissao => (
                    <Card
                      key={permissao.id}
                      className="bg-gradient-to-br from-holding-blue-profound/60 to-holding-blue-profound/40 border border-holding-blue-light/30 hover:border-holding-blue-light/50 transition-all duration-300 hover:shadow-lg hover:shadow-holding-blue-light/10 group"
                    >
                      <CardContent className="p-3 md:p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-holding-blue-light/20 to-holding-blue-light/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Users className="w-6 h-6 text-holding-blue-light" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditarPermissao(permissao)}
                              className="w-8 h-8 p-0 border-holding-blue-light/30 text-holding-blue-light hover:bg-holding-blue-light/20 hover:border-holding-blue-light/50 hover:scale-110 transition-all duration-200 rounded-lg"
                              title="Editar permissão"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-8 h-8 p-0 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 hover:scale-110 transition-all duration-200 rounded-lg"
                              onClick={() =>
                                handleExcluirPermissao(permissao.id)
                              }
                              title="Excluir permissão"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-base font-bold text-holding-white group-hover:text-holding-blue-light transition-colors duration-200">
                            {permissao.nome}
                          </h3>
                          <p className="text-xs text-holding-blue-light/80 leading-relaxed">
                            {permissao.descricao}
                          </p>

                          <div className="pt-1">
                            <Badge
                              variant="outline"
                              className="bg-holding-blue-light/20 text-holding-blue-light border-holding-blue-light/30 px-2 py-0.5 text-xs font-medium"
                            >
                              {permissao.categoria}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            {/* Aba Clientes */}
            <TabsContent value="clientes" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {permissoes
                  .filter(p => p.categoria === 'clientes')
                  .map(permissao => (
                    <Card
                      key={permissao.id}
                      className="bg-gradient-to-br from-holding-blue-profound/60 to-holding-blue-profound/40 border border-holding-blue-light/30 hover:border-holding-blue-light/50 transition-all duration-300 hover:shadow-lg hover:shadow-holding-blue-light/10 group"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-holding-blue-light/20 to-holding-blue-light/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Building2 className="w-6 h-6 text-holding-blue-light" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditarPermissao(permissao)}
                              className="w-8 h-8 p-0 border-holding-blue-light/30 text-holding-blue-light hover:bg-holding-blue-light/20 hover:border-holding-blue-light/50 hover:scale-110 transition-all duration-200 rounded-lg"
                              title="Editar permissão"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-8 h-8 p-0 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 hover:scale-110 transition-all duration-200 rounded-lg"
                              onClick={() =>
                                handleExcluirPermissao(permissao.id)
                              }
                              title="Excluir permissão"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-base font-bold text-holding-white group-hover:text-holding-blue-light transition-colors duration-200">
                            {permissao.nome}
                          </h3>
                          <p className="text-xs text-holding-blue-light/80 leading-relaxed">
                            {permissao.descricao}
                          </p>

                          <div className="pt-1">
                            <Badge
                              variant="outline"
                              className="bg-holding-blue-light/20 text-holding-blue-light border-holding-blue-light/30 px-2 py-0.5 text-xs font-medium"
                            >
                              {permissao.categoria}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            {/* Aba Dashboard */}
            <TabsContent value="dashboard" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {permissoes
                  .filter(p => p.categoria === 'dashboard')
                  .map(permissao => (
                    <Card
                      key={permissao.id}
                      className="bg-gradient-to-br from-holding-blue-light/60 to-holding-blue-light/40 border border-holding-blue-light/30 hover:border-holding-blue-light/50 transition-all duration-300 hover:shadow-lg hover:shadow-holding-blue-light/10 group"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-holding-blue-light/20 to-holding-blue-light/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <BarChart3 className="w-6 h-6 text-holding-blue-light" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditarPermissao(permissao)}
                              className="w-8 h-8 p-0 border-holding-blue-light/30 text-holding-blue-light hover:bg-holding-blue-light/20 hover:border-holding-blue-light/50 hover:scale-110 transition-all duration-200 rounded-lg"
                              title="Editar permissão"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-8 h-8 p-0 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 hover:scale-110 transition-all duration-200 rounded-lg"
                              onClick={() =>
                                handleExcluirPermissao(permissao.id)
                              }
                              title="Excluir permissão"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-base font-bold text-holding-white group-hover:text-holding-blue-light transition-colors duration-200">
                            {permissao.nome}
                          </h3>
                          <p className="text-xs text-holding-blue-light/80 leading-relaxed">
                            {permissao.descricao}
                          </p>

                          <div className="pt-1">
                            <Badge
                              variant="outline"
                              className="bg-holding-blue-light/20 text-holding-blue-light border-holding-blue-light/30 px-2 py-0.5 text-xs font-medium"
                            >
                              {permissao.categoria}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            {/* Aba Sistema */}
            <TabsContent value="sistema" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {permissoes
                  .filter(p => p.categoria === 'sistema')
                  .map(permissao => (
                    <Card
                      key={permissao.id}
                      className="bg-gradient-to-br from-holding-blue-profound/60 to-holding-blue-profound/40 border border-holding-blue-light/30 hover:border-holding-blue-light/50 transition-all duration-300 hover:shadow-lg hover:shadow-holding-blue-light/10 group"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-holding-blue-light/20 to-holding-blue-light/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Settings className="w-6 h-6 text-holding-blue-light" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditarPermissao(permissao)}
                              className="w-8 h-8 p-0 border-holding-blue-light/30 text-holding-blue-light hover:bg-holding-blue-light/20 hover:border-holding-blue-light/50 hover:scale-110 transition-all duration-200 rounded-lg"
                              title="Editar permissão"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-8 h-8 p-0 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 hover:scale-110 transition-all duration-200 rounded-lg"
                              onClick={() =>
                                handleExcluirPermissao(permissao.id)
                              }
                              title="Excluir permissão"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-base font-bold text-holding-white group-hover:text-holding-blue-light transition-colors duration-200">
                            {permissao.nome}
                          </h3>
                          <p className="text-xs text-holding-blue-light/80 leading-relaxed">
                            {permissao.descricao}
                          </p>

                          <div className="pt-1">
                            <Badge
                              variant="outline"
                              className="bg-holding-blue-light/20 text-holding-blue-light border-holding-blue-light/30 px-2 py-0.5 text-xs font-medium"
                            >
                              {permissao.categoria}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            {/* Aba Registros Próprios */}
            <TabsContent value="proprios" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {permissoes
                  .filter(p => p.categoria === 'proprios')
                  .map(permissao => (
                    <Card
                      key={permissao.id}
                      className="bg-gradient-to-br from-holding-blue-profound/60 to-holding-blue-profound/40 border border-holding-blue-light/30 hover:border-holding-blue-light/50 transition-all duration-300 hover:shadow-lg hover:shadow-holding-blue-light/10 group"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-holding-blue-light/20 to-holding-blue-light/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <UserCheck className="w-6 h-6 text-holding-blue-light" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditarPermissao(permissao)}
                              className="w-8 h-8 p-0 border-holding-blue-light/30 text-holding-blue-light hover:bg-holding-blue-light/20 hover:border-holding-blue-light/50 hover:scale-110 transition-all duration-200 rounded-lg"
                              title="Editar permissão"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-8 h-8 p-0 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 hover:scale-110 transition-all duration-200 rounded-lg"
                              onClick={() =>
                                handleExcluirPermissao(permissao.id)
                              }
                              title="Excluir permissão"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-base font-bold text-holding-white group-hover:text-holding-blue-light transition-colors duration-200">
                            {permissao.nome}
                          </h3>
                          <p className="text-xs text-holding-blue-light/80 leading-relaxed">
                            {permissao.descricao}
                          </p>

                          <div className="pt-1">
                            <Badge
                              variant="outline"
                              className="bg-holding-blue-light/20 text-holding-blue-light border-holding-blue-light/30 px-2 py-0.5 text-xs font-medium"
                            >
                              {permissao.categoria}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modal Perfil */}
      <Dialog open={showPerfilModal} onOpenChange={setShowPerfilModal}>
        <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto glass-effect-accent border-holding-accent/30 bg-holding-blue-profound/95">
          <DialogHeader className="bg-gradient-to-r from-holding-blue-deep to-holding-blue-dark text-white p-6 rounded-t-lg">
            <DialogTitle className="text-xl font-semibold text-white">
              {editandoPerfil ? 'Editar Permissões' : 'Configurar Permissões'}
            </DialogTitle>
            <DialogDescription className="text-holding-blue-light">
              {editandoPerfil
                ? 'Edite as permissões do tipo de acesso'
                : 'Configure as permissões para um tipo de acesso'}
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-6 bg-holding-blue-profound/80">
            {/* Seleção do tipo de acesso */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="tipoAcesso"
                  className="text-sm font-medium text-holding-white"
                >
                  Tipo de Acesso
                </Label>
                <select
                  id="tipoAcesso"
                  value={perfilForm.tipoAcessoId}
                  onChange={e => {
                    const tipoSelecionado = tiposAcesso.find(
                      t => t.id === e.target.value
                    );
                    setPerfilForm(prev => ({
                      ...prev,
                      tipoAcessoId: e.target.value,
                      tipoAcessoNome: tipoSelecionado?.nome || '',
                    }));
                  }}
                  className="w-full px-3 py-2 border border-holding-blue-light/30 rounded-md focus:outline-none focus:ring-2 focus:ring-holding-blue-light focus:border-transparent bg-holding-blue-profound/90 text-holding-white"
                >
                  <option value="">Selecione um tipo de acesso</option>
                  {tiposAcesso.map(tipo => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nome} - Nível {tipo.nivel}
                    </option>
                  ))}
                </select>
              </div>

              {perfilForm.tipoAcessoNome && (
                <div className="p-4 bg-holding-blue-light/10 border border-holding-blue-light/30 rounded-lg">
                  <p className="text-sm text-holding-blue-light">
                    <strong>Tipo selecionado:</strong>{' '}
                    {perfilForm.tipoAcessoNome}
                  </p>
                </div>
              )}
            </div>

            {/* Configuração de Permissões */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-holding-white border-b border-holding-blue-light/30 pb-2">
                Configurar Permissões por Categoria
              </h3>

              {/* USUÁRIOS */}
              <Card className="glass-effect-accent border-holding-accent/30 p-6 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-holding-white">
                      Usuários
                    </h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setPerfilForm(prev => ({
                          ...prev,
                          permissoes: {
                            ...prev.permissoes,
                            usuarios: {
                              visualizar: true,
                              criar: true,
                              editar: true,
                              excluir: true,
                              aprovar: true,
                              proprios: true,
                            },
                          },
                        }));
                      }}
                      className="text-xs px-3 py-1 border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-500/50 transition-all duration-200"
                    >
                      Selecionar Todos
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setPerfilForm(prev => ({
                          ...prev,
                          permissoes: {
                            ...prev.permissoes,
                            usuarios: {
                              visualizar: false,
                              criar: false,
                              editar: false,
                              excluir: false,
                              aprovar: false,
                              proprios: false,
                            },
                          },
                        }));
                      }}
                      className="text-xs px-3 py-1 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-200"
                    >
                      Desmarcar Todos
                    </Button>
                    <div className="flex items-center space-x-2 ml-2 pl-2 border-l border-yellow-500/30">
                      <input
                        type="checkbox"
                        id="perfil-usuarios-proprios-header"
                        checked={perfilForm.permissoes.usuarios.proprios}
                        onChange={e => {
                          const isChecked = e.target.checked;
                          setPerfilForm(prev => ({
                            ...prev,
                            permissoes: {
                              ...prev.permissoes,
                              usuarios: {
                                visualizar: isChecked,
                                criar: isChecked,
                                editar: isChecked,
                                excluir: isChecked,
                                aprovar: isChecked,
                                proprios: isChecked,
                              },
                            },
                          }));
                        }}
                        className="rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500"
                      />
                      <label
                        htmlFor="perfil-usuarios-proprios-header"
                        className="text-xs text-yellow-400 font-medium cursor-pointer"
                      >
                        Apenas Registros Próprios
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-green-50/10 border border-green-200/30 rounded-xl hover:bg-green-50/20 hover:border-green-200/50 transition-all duration-200">
                    <input
                      type="checkbox"
                      id="perfil-usuarios-visualizar"
                      checked={perfilForm.permissoes.usuarios.visualizar}
                      onChange={e =>
                        setPerfilForm(prev => ({
                          ...prev,
                          permissoes: {
                            ...prev.permissoes,
                            usuarios: {
                              ...prev.permissoes.usuarios,
                              visualizar: e.target.checked,
                            },
                          },
                        }))
                      }
                      className="rounded border-green-300 text-green-600 focus:ring-green-500"
                    />
                    <label
                      htmlFor="perfil-usuarios-visualizar"
                      className="text-holding-white cursor-pointer"
                    >
                      Visualizar Usuários
                    </label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-green-50/10 border border-green-200/30 rounded-xl hover:bg-green-50/20 hover:border-green-200/50 transition-all duration-200">
                    <input
                      type="checkbox"
                      id="perfil-usuarios-criar"
                      checked={perfilForm.permissoes.usuarios.criar}
                      onChange={e =>
                        setPerfilForm(prev => ({
                          ...prev,
                          permissoes: {
                            ...prev.permissoes,
                            usuarios: {
                              ...prev.permissoes.usuarios,
                              criar: e.target.checked,
                            },
                          },
                        }))
                      }
                      className="rounded border-green-300 text-green-600 focus:ring-green-500"
                    />
                    <label
                      htmlFor="perfil-usuarios-criar"
                      className="text-holding-white cursor-pointer"
                    >
                      Criar Usuários
                    </label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-green-50/10 border border-green-200/30 rounded-xl hover:bg-green-50/20 hover:border-green-200/50 transition-all duration-200">
                    <input
                      type="checkbox"
                      id="perfil-usuarios-editar"
                      checked={perfilForm.permissoes.usuarios.editar}
                      onChange={e =>
                        setPerfilForm(prev => ({
                          ...prev,
                          permissoes: {
                            ...prev.permissoes,
                            usuarios: {
                              ...prev.permissoes.usuarios,
                              editar: e.target.checked,
                            },
                          },
                        }))
                      }
                      className="rounded border-green-300 text-green-600 focus:ring-green-500"
                    />
                    <label
                      htmlFor="perfil-usuarios-editar"
                      className="text-holding-white cursor-pointer"
                    >
                      Editar Usuários
                    </label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-green-50/10 border border-green-200/30 rounded-xl hover:bg-green-50/20 hover:border-green-200/50 transition-all duration-200">
                    <input
                      type="checkbox"
                      id="perfil-usuarios-excluir"
                      checked={perfilForm.permissoes.usuarios.excluir}
                      onChange={e =>
                        setPerfilForm(prev => ({
                          ...prev,
                          permissoes: {
                            ...prev.permissoes,
                            usuarios: {
                              ...prev.permissoes.usuarios,
                              excluir: e.target.checked,
                            },
                          },
                        }))
                      }
                      className="rounded border-green-300 text-green-600 focus:ring-green-500"
                    />
                    <label
                      htmlFor="perfil-usuarios-excluir"
                      className="text-holding-white cursor-pointer"
                    >
                      Excluir Usuários
                    </label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-green-50/10 border border-green-200/30 rounded-xl hover:bg-green-50/20 hover:border-green-200/50 transition-all duration-200">
                    <input
                      type="checkbox"
                      id="perfil-usuarios-aprovar"
                      checked={perfilForm.permissoes.usuarios.aprovar}
                      onChange={e =>
                        setPerfilForm(prev => ({
                          ...prev,
                          permissoes: {
                            ...prev.permissoes,
                            usuarios: {
                              ...prev.permissoes.usuarios,
                              aprovar: e.target.checked,
                            },
                          },
                        }))
                      }
                      className="rounded border-green-300 text-green-600 focus:ring-green-500"
                    />
                    <label
                      htmlFor="perfil-usuarios-aprovar"
                      className="text-holding-white cursor-pointer"
                    >
                      Aprovar Usuários
                    </label>
                  </div>
                </div>
              </Card>

              {/* CLIENTES */}
              <Card className="glass-effect-accent border-holding-accent/30 p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-holding-white">
                      Clientes
                    </h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setPerfilForm(prev => ({
                          ...prev,
                          permissoes: {
                            ...prev.permissoes,
                            clientes: {
                              visualizar: true,
                              criar: true,
                              editar: true,
                              excluir: true,
                              proprios: true,
                            },
                          },
                        }));
                      }}
                      className="text-xs px-3 py-1 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all duration-200"
                    >
                      Selecionar Todos
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setPerfilForm(prev => ({
                          ...prev,
                          permissoes: {
                            ...prev.permissoes,
                            clientes: {
                              visualizar: false,
                              criar: false,
                              editar: false,
                              excluir: false,
                              proprios: false,
                            },
                          },
                        }));
                      }}
                      className="text-xs px-3 py-1 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-200"
                    >
                      Desmarcar Todos
                    </Button>
                    <div className="flex items-center space-x-2 ml-2 pl-2 border-l border-yellow-500/30">
                      <input
                        type="checkbox"
                        id="perfil-clientes-proprios-header"
                        checked={perfilForm.permissoes.clientes.proprios}
                        onChange={e => {
                          const isChecked = e.target.checked;
                          setPerfilForm(prev => ({
                            ...prev,
                            permissoes: {
                              ...prev.permissoes,
                              clientes: {
                                visualizar: isChecked,
                                criar: isChecked,
                                editar: isChecked,
                                excluir: isChecked,
                                proprios: isChecked,
                              },
                            },
                          }));
                        }}
                        className="rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500"
                      />
                      <label
                        htmlFor="perfil-clientes-proprios-header"
                        className="text-xs text-yellow-400 font-medium cursor-pointer"
                      >
                        Apenas Registros Próprios
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-blue-50/10 border border-blue-200/30 rounded-xl hover:bg-blue-50/20 hover:border-blue-200/50 transition-all duration-200">
                    <input
                      type="checkbox"
                      id="perfil-clientes-visualizar"
                      checked={perfilForm.permissoes.clientes.visualizar}
                      onChange={e =>
                        setPerfilForm(prev => ({
                          ...prev,
                          permissoes: {
                            ...prev.permissoes,
                            clientes: {
                              ...prev.permissoes.clientes,
                              visualizar: e.target.checked,
                            },
                          },
                        }))
                      }
                      className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="perfil-clientes-visualizar"
                      className="text-holding-white cursor-pointer"
                    >
                      Visualizar Clientes
                    </label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-blue-50/10 border border-blue-200/30 rounded-xl hover:bg-blue-50/20 hover:border-blue-200/50 transition-all duration-200">
                    <input
                      type="checkbox"
                      id="perfil-clientes-criar"
                      checked={perfilForm.permissoes.clientes.criar}
                      onChange={e =>
                        setPerfilForm(prev => ({
                          ...prev,
                          permissoes: {
                            ...prev.permissoes,
                            clientes: {
                              ...prev.permissoes.clientes,
                              criar: e.target.checked,
                            },
                          },
                        }))
                      }
                      className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="perfil-clientes-criar"
                      className="text-holding-white cursor-pointer"
                    >
                      Criar Clientes
                    </label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-blue-50/10 border border-blue-200/30 rounded-xl hover:bg-blue-50/20 hover:border-blue-200/50 transition-all duration-200">
                    <input
                      type="checkbox"
                      id="perfil-clientes-editar"
                      checked={perfilForm.permissoes.clientes.editar}
                      onChange={e =>
                        setPerfilForm(prev => ({
                          ...prev,
                          permissoes: {
                            ...prev.permissoes,
                            clientes: {
                              ...prev.permissoes.clientes,
                              editar: e.target.checked,
                            },
                          },
                        }))
                      }
                      className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="perfil-clientes-editar"
                      className="text-holding-white cursor-pointer"
                    >
                      Editar Clientes
                    </label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-blue-50/10 border border-blue-200/30 rounded-xl hover:bg-blue-50/20 hover:border-blue-200/50 transition-all duration-200">
                    <input
                      type="checkbox"
                      id="perfil-clientes-excluir"
                      checked={perfilForm.permissoes.clientes.excluir}
                      onChange={e =>
                        setPerfilForm(prev => ({
                          ...prev,
                          permissoes: {
                            ...prev.permissoes,
                            clientes: {
                              ...prev.permissoes.clientes,
                              excluir: e.target.checked,
                            },
                          },
                        }))
                      }
                      className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="perfil-clientes-excluir"
                      className="text-holding-white cursor-pointer"
                    >
                      Excluir Clientes
                    </label>
                  </div>
                </div>
              </Card>

              {/* DASHBOARD */}
              <Card className="glass-effect-accent border-holding-accent/30 p-6 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-purple-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-holding-white">
                      Dashboard
                    </h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setPerfilForm(prev => ({
                          ...prev,
                          permissoes: {
                            ...prev.permissoes,
                            dashboard: {
                              acessoTotal: true,
                              acessoLimitado: true,
                              proprios: true,
                            },
                          },
                        }));
                      }}
                      className="text-xs px-3 py-1 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all duration-200"
                    >
                      Selecionar Todos
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setPerfilForm(prev => ({
                          ...prev,
                          permissoes: {
                            ...prev.permissoes,
                            dashboard: {
                              acessoTotal: false,
                              acessoLimitado: false,
                              proprios: false,
                            },
                          },
                        }));
                      }}
                      className="text-xs px-3 py-1 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-200"
                    >
                      Desmarcar Todos
                    </Button>
                    <div className="flex items-center space-x-2 ml-2 pl-2 border-l border-yellow-500/30">
                      <input
                        type="checkbox"
                        id="perfil-dashboard-proprios-header"
                        checked={perfilForm.permissoes.dashboard.proprios}
                        onChange={e => {
                          const isChecked = e.target.checked;
                          setPerfilForm(prev => ({
                            ...prev,
                            permissoes: {
                              ...prev.permissoes,
                              dashboard: {
                                acessoTotal: isChecked,
                                acessoLimitado: isChecked,
                                proprios: isChecked,
                              },
                            },
                          }));
                        }}
                        className="rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500"
                      />
                      <label
                        htmlFor="perfil-dashboard-proprios-header"
                        className="text-xs text-yellow-400 font-medium cursor-pointer"
                      >
                        Apenas Dados Próprios
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-purple-50/10 border border-purple-200/30 rounded-xl hover:bg-purple-50/20 hover:border-purple-200/50 transition-all duration-200">
                    <input
                      type="checkbox"
                      id="perfil-dashboard-total"
                      checked={perfilForm.permissoes.dashboard.acessoTotal}
                      onChange={e =>
                        setPerfilForm(prev => ({
                          ...prev,
                          permissoes: {
                            ...prev.permissoes,
                            dashboard: {
                              ...prev.permissoes.dashboard,
                              acessoTotal: e.target.checked,
                            },
                          },
                        }))
                      }
                      className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                    />
                    <label
                      htmlFor="perfil-dashboard-total"
                      className="text-holding-white cursor-pointer"
                    >
                      Acesso Total
                    </label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-purple-50/10 border border-purple-200/30 rounded-xl hover:bg-purple-50/20 hover:border-purple-200/50 transition-all duration-200">
                    <input
                      type="checkbox"
                      id="perfil-dashboard-limitado"
                      checked={perfilForm.permissoes.dashboard.acessoLimitado}
                      onChange={e =>
                        setPerfilForm(prev => ({
                          ...prev,
                          permissoes: {
                            ...prev.permissoes,
                            dashboard: {
                              ...prev.permissoes.dashboard,
                              acessoLimitado: e.target.checked,
                            },
                          },
                        }))
                      }
                      className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                    />
                    <label
                      htmlFor="perfil-dashboard-limitado"
                      className="text-holding-white cursor-pointer"
                    >
                      Acesso Limitado
                    </label>
                  </div>
                </div>
              </Card>

              {/* SISTEMA */}
              <Card className="glass-effect-accent border-holding-accent/30 p-6 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                      <Settings className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-holding-white">
                      Sistema
                    </h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setPerfilForm(prev => ({
                          ...prev,
                          permissoes: {
                            ...prev.permissoes,
                            sistema: {
                              tiposAcesso: true,
                              configuracoes: true,
                              relatorios: true,
                              proprios: true,
                            },
                          },
                        }));
                      }}
                      className="text-xs px-3 py-1 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all duration-200"
                    >
                      Selecionar Todos
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setPerfilForm(prev => ({
                          ...prev,
                          permissoes: {
                            ...prev.permissoes,
                            sistema: {
                              tiposAcesso: false,
                              configuracoes: false,
                              relatorios: false,
                              proprios: false,
                            },
                          },
                        }));
                      }}
                      className="text-xs px-3 py-1 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-200"
                    >
                      Desmarcar Todos
                    </Button>
                    <div className="flex items-center space-x-2 ml-2 pl-2 border-l border-yellow-500/30">
                      <input
                        type="checkbox"
                        id="perfil-sistema-proprios-header"
                        checked={perfilForm.permissoes.sistema.proprios}
                        onChange={e => {
                          const isChecked = e.target.checked;
                          setPerfilForm(prev => ({
                            ...prev,
                            permissoes: {
                              ...prev.permissoes,
                              sistema: {
                                tiposAcesso: isChecked,
                                configuracoes: isChecked,
                                relatorios: isChecked,
                                proprios: isChecked,
                              },
                            },
                          }));
                        }}
                        className="rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500"
                      />
                      <label
                        htmlFor="perfil-sistema-proprios-header"
                        className="text-xs text-yellow-400 font-medium cursor-pointer"
                      >
                        Apenas Configurações Próprias
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-indigo-50/10 border border-indigo-200/30 rounded-xl hover:bg-indigo-50/20 hover:border-indigo-200/50 transition-all duration-200">
                    <input
                      type="checkbox"
                      id="perfil-sistema-tipos-acesso"
                      checked={perfilForm.permissoes.sistema.tiposAcesso}
                      onChange={e =>
                        setPerfilForm(prev => ({
                          ...prev,
                          permissoes: {
                            ...prev.permissoes,
                            sistema: {
                              ...prev.permissoes.sistema,
                              tiposAcesso: e.target.checked,
                            },
                          },
                        }))
                      }
                      className="rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor="perfil-sistema-tipos-acesso"
                      className="text-holding-white cursor-pointer"
                    >
                      Gerenciar Tipos de Acesso
                    </label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-indigo-50/10 border border-indigo-200/30 rounded-xl hover:bg-indigo-50/20 hover:border-indigo-200/50 transition-all duration-200">
                    <input
                      type="checkbox"
                      id="perfil-sistema-configuracoes"
                      checked={perfilForm.permissoes.sistema.configuracoes}
                      onChange={e =>
                        setPerfilForm(prev => ({
                          ...prev,
                          permissoes: {
                            ...prev.permissoes,
                            sistema: {
                              ...prev.permissoes.sistema,
                              configuracoes: e.target.checked,
                            },
                          },
                        }))
                      }
                      className="rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor="perfil-sistema-configuracoes"
                      className="text-holding-white cursor-pointer"
                    >
                      Configurações do Sistema
                    </label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-indigo-50/10 border border-indigo-200/30 rounded-xl hover:bg-indigo-50/20 hover:border-indigo-200/50 transition-all duration-200">
                    <input
                      type="checkbox"
                      id="perfil-sistema-relatorios"
                      checked={perfilForm.permissoes.sistema.relatorios}
                      onChange={e =>
                        setPerfilForm(prev => ({
                          ...prev,
                          permissoes: {
                            ...prev.permissoes,
                            sistema: {
                              ...prev.permissoes.sistema,
                              relatorios: e.target.checked,
                            },
                          },
                        }))
                      }
                      className="rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor="perfil-sistema-relatorios"
                      className="text-holding-white cursor-pointer"
                    >
                      Gerenciar Relatórios
                    </label>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <DialogFooter className="p-6 bg-holding-blue-profound/90 border-t border-holding-blue-light/30">
            <Button
              variant="outline"
              onClick={() => setShowPerfilModal(false)}
              className="border-holding-blue-light/30 text-holding-blue-light hover:bg-holding-blue-light/10"
            >
              Cancelar
            </Button>
            <Button
              onClick={
                editandoPerfil ? handleSalvarEdicaoPerfil : handleCriarPerfil
              }
              className="bg-holding-blue-light hover:bg-holding-blue-light/80 text-holding-white"
              disabled={!perfilForm.tipoAcessoId}
            >
              {editandoPerfil ? 'Salvar Alterações' : 'Configurar Permissões'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Permissão */}
      <Dialog open={showPermissaoModal} onOpenChange={setShowPermissaoModal}>
        <DialogContent className="sm:max-w-md glass-effect-accent border-holding-accent/30 bg-holding-blue-profound/95">
          <DialogHeader className="bg-gradient-to-r from-holding-blue-deep to-holding-blue-dark text-white p-6 rounded-t-lg">
            <DialogTitle className="text-xl font-semibold text-white">
              {editandoPermissao ? 'Editar Permissão' : 'Nova Permissão'}
            </DialogTitle>
            <DialogDescription className="text-holding-blue-light">
              {editandoPermissao
                ? 'Edite as informações da permissão'
                : 'Crie uma nova permissão para o sistema'}
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-4 bg-holding-blue-profound/80">
            <div className="space-y-2">
              <Label htmlFor="nomePermissao" className="text-holding-white">
                Nome da Permissão
              </Label>
              <Input
                id="nomePermissao"
                value={permissaoForm.nome}
                onChange={e =>
                  setPermissaoForm(prev => ({ ...prev, nome: e.target.value }))
                }
                placeholder="Ex: Criar Usuários, Visualizar Clientes"
                className="w-full px-3 py-2 border border-holding-blue-light/30 rounded-md focus:outline-none focus:ring-2 focus:ring-holding-blue-light focus:border-transparent bg-holding-blue-profound/90 text-holding-white placeholder-holding-blue-light/50"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="descricaoPermissao"
                className="text-holding-white"
              >
                Descrição
              </Label>
              <Input
                id="descricaoPermissao"
                value={permissaoForm.descricao}
                onChange={e =>
                  setPermissaoForm(prev => ({
                    ...prev,
                    descricao: e.target.value,
                  }))
                }
                placeholder="Descreva o que esta permissão permite fazer"
                className="w-full px-3 py-2 border border-holding-blue-light/30 rounded-md focus:outline-none focus:ring-2 focus:ring-holding-blue-light focus:border-transparent bg-holding-blue-profound/90 text-holding-white placeholder-holding-blue-light/50"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="categoriaPermissao"
                className="text-holding-white"
              >
                Categoria
              </Label>
              <select
                id="categoriaPermissao"
                value={permissaoForm.categoria}
                onChange={e =>
                  setPermissaoForm(prev => ({
                    ...prev,
                    categoria: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-holding-blue-light/30 rounded-md focus:outline-none focus:ring-2 focus:ring-holding-blue-light focus:border-transparent bg-holding-blue-profound/90 text-holding-white"
              >
                <option value="usuarios">Usuários</option>
                <option value="clientes">Clientes</option>
                <option value="dashboard">Dashboard</option>
                <option value="sistema">Sistema</option>
                <option value="proprios">Registros Próprios</option>
              </select>
            </div>
          </div>

          <DialogFooter className="p-6 bg-holding-blue-profound/90 border-t border-holding-blue-light/30">
            <Button
              variant="outline"
              onClick={() => setShowPermissaoModal(false)}
              className="border-holding-blue-light/30 text-holding-blue-light hover:bg-holding-blue-light/10"
            >
              Cancelar
            </Button>
            <Button
              onClick={
                editandoPermissao
                  ? handleSalvarEdicaoPermissao
                  : handleCriarPermissao
              }
              className="bg-holding-blue-light hover:bg-holding-blue-light/80 text-holding-white"
              disabled={!permissaoForm.nome.trim()}
            >
              {editandoPermissao ? 'Salvar Alterações' : 'Criar Permissão'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Tipo de Acesso */}
      <Dialog open={showTipoAcessoModal} onOpenChange={setShowTipoAcessoModal}>
        <DialogContent className="sm:max-w-md glass-effect-accent border-holding-accent/30 bg-holding-blue-profound/95">
          <DialogHeader className="bg-gradient-to-r from-holding-blue-deep to-holding-blue-dark text-white p-6 rounded-t-lg">
            <DialogTitle className="text-xl font-semibold text-white">
              {editandoTipoAcesso
                ? 'Editar Tipo de Acesso'
                : 'Novo Tipo de Acesso'}
            </DialogTitle>
            <DialogDescription className="text-holding-blue-light">
              {editandoTipoAcesso
                ? 'Edite as informações do tipo de acesso'
                : 'Crie um novo tipo de acesso para o sistema'}
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-4 bg-holding-blue-profound/80">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-holding-white">
                Nome
              </Label>
              <Input
                id="nome"
                value={tipoAcessoForm.nome}
                onChange={e =>
                  setTipoAcessoForm(prev => ({ ...prev, nome: e.target.value }))
                }
                placeholder="Ex: Submaster, Operador, Visualizador"
                className="w-full px-3 py-2 border border-holding-blue-light/30 rounded-md focus:outline-none focus:ring-2 focus:ring-holding-blue-light focus:border-transparent bg-holding-blue-profound/90 text-holding-white placeholder-holding-blue-light/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao" className="text-holding-white">
                Descrição
              </Label>
              <Input
                id="descricao"
                value={tipoAcessoForm.descricao}
                onChange={e =>
                  setTipoAcessoForm(prev => ({
                    ...prev,
                    descricao: e.target.value,
                  }))
                }
                placeholder="Descreva as responsabilidades deste tipo de acesso"
                className="w-full px-3 py-2 border border-holding-blue-light/30 rounded-md focus:outline-none focus:ring-2 focus:ring-holding-blue-light focus:border-transparent bg-holding-blue-profound/90 text-holding-white placeholder-holding-blue-light/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nivel" className="text-holding-white">
                Nível de Acesso
              </Label>
              <select
                id="nivel"
                value={tipoAcessoForm.nivel}
                onChange={e =>
                  setTipoAcessoForm(prev => ({
                    ...prev,
                    nivel: parseInt(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border border-holding-blue-light/30 rounded-md focus:outline-none focus:ring-2 focus:ring-holding-blue-light focus:border-transparent bg-holding-blue-profound/90 text-holding-white"
              >
                <option value={1}>1 - Básico</option>
                <option value={2}>2 - Intermediário</option>
                <option value={3}>3 - Avançado</option>
                <option value={4}>4 - Administrador</option>
                <option value={5}>5 - Master</option>
              </select>
            </div>
          </div>

          <DialogFooter className="p-6 bg-holding-blue-profound/90 border-t border-holding-blue-light/30">
            <Button
              variant="outline"
              onClick={() => setShowTipoAcessoModal(false)}
              className="border-holding-blue-light/30 text-holding-blue-light hover:bg-holding-blue-light/10"
            >
              Cancelar
            </Button>
            <Button
              onClick={
                editandoTipoAcesso
                  ? handleSalvarEdicaoTipoAcesso
                  : handleCriarTipoAcesso
              }
              className="bg-holding-blue-light hover:bg-holding-blue-light/80 text-holding-white"
              disabled={!tipoAcessoForm.nome.trim()}
            >
              {editandoTipoAcesso
                ? 'Salvar Alterações'
                : 'Criar Tipo de Acesso'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Estilos CSS para animações */}
      <style jsx>{`
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
