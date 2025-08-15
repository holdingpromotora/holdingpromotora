'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Users,
  UserCheck,
  UserX,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Search,
  Plus,
  Shield,
  Eye,
  EyeOff,
  User,
} from 'lucide-react';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil_id: string;
  perfil_nome: string;
  ativo: boolean;
  aprovado: boolean;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  data_cadastro: string;
  data_aprovacao?: string;
  aprovado_por?: string;
  ultimo_acesso?: string;
}

interface PerfilUsuario {
  id: string;
  nome: string;
  nivel_acesso: string;
  ativo: boolean;
}

export default function GerenciarUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [perfis, setPerfis] = useState<PerfilUsuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [filterPerfil, setFilterPerfil] = useState<string>('todos');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    perfil_id: '',
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setIsLoading(true);
    try {
      // Simular carregamento de dados
      setTimeout(() => {
        const mockPerfis: PerfilUsuario[] = [
          { id: '1', nome: 'Master', nivel_acesso: 'master', ativo: true },
          {
            id: '2',
            nome: 'Administrador',
            nivel_acesso: 'admin',
            ativo: true,
          },
          { id: '3', nome: 'Gerente', nivel_acesso: 'gerente', ativo: true },
          {
            id: '4',
            nome: 'Supervisor',
            nivel_acesso: 'supervisor',
            ativo: true,
          },
          { id: '5', nome: 'Operador', nivel_acesso: 'operador', ativo: true },
          {
            id: '6',
            nome: 'Visualizador',
            nivel_acesso: 'visualizador',
            ativo: true,
          },
          {
            id: '7',
            nome: 'Convidado',
            nivel_acesso: 'convidado',
            ativo: true,
          },
        ];

        const mockUsuarios: Usuario[] = [
          {
            id: 1,
            nome: 'João Silva',
            email: 'joao@holding.com',
            perfil_id: '1',
            perfil_nome: 'Master',
            ativo: true,
            aprovado: true,
            status: 'aprovado',
            data_cadastro: '2024-01-01',
            data_aprovacao: '2024-01-01',
            aprovado_por: 'Sistema',
            ultimo_acesso: '2024-01-15 10:30:00',
          },
          {
            id: 2,
            nome: 'Maria Santos',
            email: 'maria@holding.com',
            perfil_id: '2',
            perfil_nome: 'Administrador',
            ativo: true,
            aprovado: true,
            status: 'aprovado',
            data_cadastro: '2024-01-02',
            data_aprovacao: '2024-01-02',
            aprovado_por: 'João Silva',
            ultimo_acesso: '2024-01-15 09:15:00',
          },
          {
            id: 3,
            nome: 'Pedro Costa',
            email: 'pedro@holding.com',
            perfil_id: '3',
            perfil_nome: 'Gerente',
            ativo: true,
            aprovado: true,
            status: 'aprovado',
            data_cadastro: '2024-01-03',
            data_aprovacao: '2024-01-03',
            aprovado_por: 'Maria Santos',
            ultimo_acesso: '2024-01-14 16:45:00',
          },
          {
            id: 4,
            nome: 'Ana Oliveira',
            email: 'ana@holding.com',
            perfil_id: '6',
            perfil_nome: 'Visualizador',
            ativo: false,
            aprovado: false,
            status: 'rejeitado',
            data_cadastro: '2024-01-04',
            ultimo_acesso: '2024-01-10 14:20:00',
          },
          {
            id: 5,
            nome: 'Carlos Ferreira',
            email: 'carlos@holding.com',
            perfil_id: '',
            perfil_nome: 'Sem perfil',
            ativo: false,
            aprovado: false,
            status: 'pendente',
            data_cadastro: '2024-01-15',
          },
          {
            id: 6,
            nome: 'Lucia Mendes',
            email: 'lucia@holding.com',
            perfil_id: '',
            perfil_nome: 'Sem perfil',
            ativo: false,
            aprovado: false,
            status: 'pendente',
            data_cadastro: '2024-01-15',
          },
        ];

        setPerfis(mockPerfis);
        setUsuarios(mockUsuarios);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      setIsLoading(false);
    }
  };

  const handleCriarUsuario = () => {
    if (!formData.nome.trim() || !formData.email.trim()) return;

    const novoUsuario: Usuario = {
      id: Date.now(),
      nome: formData.nome,
      email: formData.email,
      perfil_id: '',
      perfil_nome: 'Sem perfil',
      ativo: false,
      aprovado: false,
      status: 'pendente',
      data_cadastro: new Date().toISOString(),
    };

    setUsuarios(prev => [...prev, novoUsuario]);
    setFormData({ nome: '', email: '', perfil_id: '' });
    setShowModal(false);
  };

  const handleEditarUsuario = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setFormData({
      nome: usuario.nome,
      email: usuario.email,
      perfil_id: usuario.perfil_id,
    });
    setShowModal(true);
  };

  const handleSalvarEdicao = () => {
    if (!editingUsuario) return;

    setUsuarios(prev =>
      prev.map(usuario =>
        usuario.id === editingUsuario.id
          ? {
              ...usuario,
              nome: formData.nome,
              email: formData.email,
              perfil_id: formData.perfil_id,
              perfil_nome:
                perfis.find(p => p.id === formData.perfil_id)?.nome ||
                'Sem perfil',
            }
          : usuario
      )
    );

    setFormData({ nome: '', email: '', perfil_id: '' });
    setEditingUsuario(null);
    setShowModal(false);
  };

  const handleAprovarUsuario = (usuarioId: number) => {
    setUsuarios(prev =>
      prev.map(usuario =>
        usuario.id === usuarioId
          ? {
              ...usuario,
              aprovado: true,
              ativo: true,
              status: 'aprovado',
              data_aprovacao: new Date().toISOString(),
              aprovado_por: 'Usuário Atual', // Em produção, pegar do contexto de auth
            }
          : usuario
      )
    );
  };

  const handleRejeitarUsuario = (usuarioId: number) => {
    setUsuarios(prev =>
      prev.map(usuario =>
        usuario.id === usuarioId
          ? {
              ...usuario,
              aprovado: false,
              ativo: false,
              status: 'rejeitado',
            }
          : usuario
      )
    );
  };

  const handleExcluirUsuario = (id: number) => {
    setUsuarios(prev => prev.filter(usuario => usuario.id !== id));
  };

  const handleToggleAtivo = (id: number) => {
    setUsuarios(prev =>
      prev.map(usuario =>
        usuario.id === id ? { ...usuario, ativo: !usuario.ativo } : usuario
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejeitado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovado':
        return <CheckCircle className="w-4 h-4" />;
      case 'pendente':
        return <Clock className="w-4 h-4" />;
      case 'rejeitado':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const usuariosFiltrados = usuarios.filter(usuario => {
    const matchSearch =
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      filterStatus === 'todos' || usuario.status === filterStatus;

    const matchPerfil =
      filterPerfil === 'todos' || usuario.perfil_id === filterPerfil;

    return matchSearch && matchStatus && matchPerfil;
  });

  const estatisticas = {
    total: usuarios.length,
    pendentes: usuarios.filter(u => u.status === 'pendente').length,
    aprovados: usuarios.filter(u => u.status === 'aprovado').length,
    rejeitados: usuarios.filter(u => u.status === 'rejeitado').length,
    ativos: usuarios.filter(u => u.ativo).length,
  };

  if (isLoading) {
    return (
      <ProtectedRoute requiredLevel="admin">
        <Layout>
          <div className="p-6">
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 text-lg font-medium">
                Carregando usuários...
              </p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredLevel="admin">
      <Layout>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Cabeçalho */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-holding-white mb-3">
                Gerenciar Usuários
              </h1>
              <p className="text-holding-accent-light text-lg">
                Aprove, rejeite e gerencie o acesso dos usuários ao sistema
              </p>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <Card className="bg-white border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {estatisticas.total}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Clock className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm font-medium">
                        Pendentes
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {estatisticas.pendentes}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <UserCheck className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm font-medium">
                        Aprovados
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {estatisticas.aprovados}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <UserX className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm font-medium">
                        Rejeitados
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {estatisticas.rejeitados}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm font-medium">
                        Ativos
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {estatisticas.ativos}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Controles */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-holding-white mb-2">
                    Lista de Usuários
                  </h2>
                  <p className="text-holding-accent-light">
                    Gerencie o acesso e aprovação dos usuários
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setEditingUsuario(null);
                    setFormData({ nome: '', email: '', perfil_id: '' });
                    setShowModal(true);
                  }}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Novo Usuário
                </Button>
              </div>
            </div>

            {/* Filtros e Busca */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-700 font-medium mb-2 block">
                    Buscar
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Nome ou email..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white border-gray-300 text-gray-900"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-700 font-medium mb-2 block">
                    Status
                  </Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Status</SelectItem>
                      <SelectItem value="pendente">Pendentes</SelectItem>
                      <SelectItem value="aprovado">Aprovados</SelectItem>
                      <SelectItem value="rejeitado">Rejeitados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-700 font-medium mb-2 block">
                    Perfil
                  </Label>
                  <Select value={filterPerfil} onValueChange={setFilterPerfil}>
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Perfis</SelectItem>
                      {perfis.map(perfil => (
                        <SelectItem key={perfil.id} value={perfil.id}>
                          {perfil.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Lista de Usuários */}
            <div className="space-y-4">
              {usuariosFiltrados.map(usuario => (
                <Card
                  key={usuario.id}
                  className="bg-white border-gray-200 hover:border-gray-300 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
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
                            <Badge className={getStatusColor(usuario.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(usuario.status)}
                                <span className="capitalize">
                                  {usuario.status}
                                </span>
                              </div>
                            </Badge>
                            <Badge
                              variant="outline"
                              className="border-gray-300 text-gray-700"
                            >
                              {usuario.perfil_nome}
                            </Badge>
                            {usuario.ativo && (
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                Ativo
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Cadastrado em:{' '}
                            {new Date(usuario.data_cadastro).toLocaleDateString(
                              'pt-BR'
                            )}
                            {usuario.data_aprovacao && (
                              <span className="ml-4">
                                Aprovado em:{' '}
                                {new Date(
                                  usuario.data_aprovacao
                                ).toLocaleDateString('pt-BR')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {usuario.status === 'pendente' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleAprovarUsuario(usuario.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Aprovar
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

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditarUsuario(usuario)}
                          className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleAtivo(usuario.id)}
                          className={`${
                            usuario.ativo
                              ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                              : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                          }`}
                        >
                          {usuario.ativo ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Excluir Usuário
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o usuário &quot;
                                {usuario.nome}&quot;? Esta ação não pode ser
                                desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleExcluirUsuario(usuario.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {usuariosFiltrados.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum usuário encontrado
                  </h3>
                  <p className="text-gray-600">
                    Tente ajustar os filtros ou criar um novo usuário.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal de Criação/Edição */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-md bg-white border-gray-200">
            <DialogHeader className="pb-6">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {editingUsuario ? 'Editar Usuário' : 'Criar Novo Usuário'}
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-base">
                {editingUsuario
                  ? 'Modifique as informações do usuário.'
                  : 'Preencha as informações para criar um novo usuário.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <Label
                  htmlFor="usuario-nome"
                  className="text-gray-700 font-medium mb-2 block"
                >
                  Nome do Usuário
                </Label>
                <Input
                  id="usuario-nome"
                  value={formData.nome}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      nome: e.target.value,
                    }))
                  }
                  placeholder="Nome completo do usuário"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <Label
                  htmlFor="usuario-email"
                  className="text-gray-700 font-medium mb-2 block"
                >
                  Email
                </Label>
                <Input
                  id="usuario-email"
                  type="email"
                  value={formData.email}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="email@exemplo.com"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              {editingUsuario && (
                <div>
                  <Label
                    htmlFor="usuario-perfil"
                    className="text-gray-700 font-medium mb-2 block"
                  >
                    Perfil
                  </Label>
                  <Select
                    value={formData.perfil_id}
                    onValueChange={value =>
                      setFormData(prev => ({ ...prev, perfil_id: value }))
                    }
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue placeholder="Selecione o perfil" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      {perfis.map(perfil => (
                        <SelectItem key={perfil.id} value={perfil.id}>
                          {perfil.nome} - {perfil.nivel_acesso}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <DialogFooter className="pt-6">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              >
                Cancelar
              </Button>
              <Button
                onClick={
                  editingUsuario ? handleSalvarEdicao : handleCriarUsuario
                }
                className="bg-gradient-to-r from-holding-highlight to-holding-highlight-light hover:from-holding-highlight-light hover:to-holding-highlight text-white font-medium px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {editingUsuario ? 'Salvar Alterações' : 'Criar Usuário'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Layout>
    </ProtectedRoute>
  );
}
