'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

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
  Shield,
  Plus,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Key,
  Crown,
  Building,
  User,
  EyeOff,
  Lock,
  Unlock,
} from 'lucide-react';

interface PerfilUsuario {
  id: string;
  nome: string;
  descricao: string;
  nivel_acesso: string;
  permissoes: string[];
  cor: string;
  icone: string;
  ativo: boolean;
  usuarios_vinculados: number;
  created_at: string;
  updated_at: string;
}

interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil_id: string;
  perfil_nome: string;
  ativo: boolean;
  ultimo_acesso?: string;
}

export default function PerfisUsuariosPage() {
  console.log('🔄 Componente PerfisUsuariosPage renderizado');

  const [perfis, setPerfis] = useState<PerfilUsuario[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showUsuarioModal, setShowUsuarioModal] = useState(false);
  const [editingPerfil, setEditingPerfil] = useState<PerfilUsuario | null>(
    null
  );

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    nivel_acesso: '',
    cor: 'bg-blue-600',
    icone: 'Shield',
  });
  const [usuarioFormData, setUsuarioFormData] = useState({
    nome: '',
    email: '',
    perfil_id: '',
  });

  useEffect(() => {
    console.log('🔄 useEffect executado, chamando carregarDados...');
    carregarDados();
  }, []);

  const carregarDados = async () => {
    console.log('🔄 Carregando dados dos perfis...');
    setIsLoading(true);
    try {
      // Simular carregamento de perfis
      setTimeout(() => {
        console.log('⏰ Timeout executado, criando dados mock...');
        const mockPerfis: PerfilUsuario[] = [
          {
            id: '1',
            nome: 'Master',
            descricao: 'Acesso total ao sistema com todas as permissões',
            nivel_acesso: 'master',
            permissoes: [
              'dashboard:visualizar',
              'dashboard:gerenciar',
              'usuarios:visualizar',
              'usuarios:criar',
              'usuarios:editar',
              'usuarios:excluir',
              'usuarios:gerenciar',
              'cadastros:visualizar',
              'cadastros:criar',
              'cadastros:editar',
              'cadastros:excluir',
              'cadastros:gerenciar',
              'relatorios:visualizar',
              'relatorios:criar',
              'relatorios:exportar',
              'relatorios:gerenciar',
              'sistema:visualizar',
              'sistema:configurar',
              'sistema:gerenciar',
              'financeiro:visualizar',
              'financeiro:editar',
              'financeiro:gerenciar',
              'marketing:visualizar',
              'marketing:criar',
              'marketing:editar',
              'marketing:gerenciar',
            ],
            cor: 'bg-red-600',
            icone: 'Crown',
            ativo: true,
            usuarios_vinculados: 1,
            created_at: '2024-01-01',
            updated_at: '2024-01-15',
          },
          {
            id: '2',
            nome: 'Administrador',
            descricao:
              'Acesso administrativo completo com limitações de sistema',
            nivel_acesso: 'admin',
            permissoes: [
              'dashboard:visualizar',
              'dashboard:gerenciar',
              'usuarios:visualizar',
              'usuarios:criar',
              'usuarios:editar',
              'usuarios:excluir',
              'usuarios:gerenciar',
              'cadastros:visualizar',
              'cadastros:criar',
              'cadastros:editar',
              'cadastros:excluir',
              'cadastros:gerenciar',
              'relatorios:visualizar',
              'relatorios:criar',
              'relatorios:exportar',
              'relatorios:gerenciar',
              'sistema:visualizar',
              'financeiro:visualizar',
              'financeiro:editar',
              'financeiro:gerenciar',
              'marketing:visualizar',
              'marketing:criar',
              'marketing:editar',
              'marketing:gerenciar',
            ],
            cor: 'bg-purple-600',
            icone: 'Shield',
            ativo: true,
            usuarios_vinculados: 2,
            created_at: '2024-01-01',
            updated_at: '2024-01-15',
          },
          {
            id: '3',
            nome: 'Gerente',
            descricao:
              'Acesso gerencial com controle sobre equipes e operações',
            nivel_acesso: 'gerente',
            permissoes: [
              'dashboard:visualizar',
              'usuarios:visualizar',
              'usuarios:criar',
              'usuarios:editar',
              'cadastros:visualizar',
              'cadastros:criar',
              'cadastros:editar',
              'relatorios:visualizar',
              'relatorios:criar',
              'relatorios:exportar',
              'sistema:visualizar',
              'financeiro:visualizar',
              'marketing:visualizar',
              'marketing:criar',
              'marketing:editar',
            ],
            cor: 'bg-blue-600',
            icone: 'Building',
            ativo: true,
            usuarios_vinculados: 3,
            created_at: '2024-01-01',
            updated_at: '2024-01-15',
          },
          {
            id: '4',
            nome: 'Supervisor',
            descricao: 'Acesso de supervisão com controle limitado',
            nivel_acesso: 'supervisor',
            permissoes: [
              'dashboard:visualizar',
              'usuarios:visualizar',
              'cadastros:visualizar',
              'cadastros:criar',
              'cadastros:editar',
              'relatorios:visualizar',
              'relatorios:criar',
              'marketing:visualizar',
            ],
            cor: 'bg-indigo-600',
            icone: 'UserCheck',
            ativo: true,
            usuarios_vinculados: 2,
            created_at: '2024-01-01',
            updated_at: '2024-01-15',
          },
          {
            id: '5',
            nome: 'Operador',
            descricao: 'Acesso operacional para execução de tarefas',
            nivel_acesso: 'operador',
            permissoes: [
              'dashboard:visualizar',
              'cadastros:visualizar',
              'cadastros:criar',
              'cadastros:editar',
              'relatorios:visualizar',
            ],
            cor: 'bg-green-600',
            icone: 'User',
            ativo: true,
            usuarios_vinculados: 5,
            created_at: '2024-01-01',
            updated_at: '2024-01-15',
          },
          {
            id: '6',
            nome: 'Visualizador',
            descricao: 'Acesso apenas para visualização de dados',
            nivel_acesso: 'visualizador',
            permissoes: [
              'dashboard:visualizar',
              'cadastros:visualizar',
              'relatorios:visualizar',
            ],
            cor: 'bg-amber-600',
            icone: 'Eye',
            ativo: true,
            usuarios_vinculados: 8,
            created_at: '2024-01-01',
            updated_at: '2024-01-15',
          },
          {
            id: '7',
            nome: 'Convidado',
            descricao: 'Acesso limitado para convidados',
            nivel_acesso: 'convidado',
            permissoes: ['dashboard:visualizar'],
            cor: 'bg-gray-600',
            icone: 'EyeOff',
            ativo: true,
            usuarios_vinculados: 2,
            created_at: '2024-01-01',
            updated_at: '2024-01-15',
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
            ultimo_acesso: '2024-01-15 10:30:00',
          },
          {
            id: 2,
            nome: 'Maria Santos',
            email: 'maria@holding.com',
            perfil_id: '2',
            perfil_nome: 'Administrador',
            ativo: true,
            ultimo_acesso: '2024-01-15 09:15:00',
          },
          {
            id: 3,
            nome: 'Pedro Costa',
            email: 'pedro@holding.com',
            perfil_id: '3',
            perfil_nome: 'Gerente',
            ativo: true,
            ultimo_acesso: '2024-01-14 16:45:00',
          },
          {
            id: 4,
            nome: 'Ana Oliveira',
            email: 'ana@holding.com',
            perfil_id: '6',
            perfil_nome: 'Visualizador',
            ativo: false,
            ultimo_acesso: '2024-01-10 14:20:00',
          },
        ];

        console.log('✅ Dados carregados:', {
          perfis: mockPerfis,
          usuarios: mockUsuarios,
        });
        setPerfis(mockPerfis);
        setUsuarios(mockUsuarios);
        setIsLoading(false);
        console.log('✅ Estado atualizado, isLoading: false');
      }, 1000);
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
      setIsLoading(false);
    }
  };

  const handleCriarPerfil = () => {
    if (!formData.nome.trim()) return;

    const novoPerfil: PerfilUsuario = {
      id: Date.now().toString(),
      nome: formData.nome,
      descricao: formData.descricao,
      nivel_acesso: formData.nivel_acesso,
      permissoes: [],
      cor: formData.cor,
      icone: formData.icone,
      ativo: true,
      usuarios_vinculados: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setPerfis(prev => [...prev, novoPerfil]);
    setFormData({
      nome: '',
      descricao: '',
      nivel_acesso: '',
      cor: 'bg-blue-600',
      icone: 'Shield',
    });
    setShowModal(false);
  };

  const handleEditarPerfil = (perfil: PerfilUsuario) => {
    setEditingPerfil(perfil);
    setFormData({
      nome: perfil.nome,
      descricao: perfil.descricao,
      nivel_acesso: perfil.nivel_acesso,
      cor: perfil.cor,
      icone: perfil.icone,
    });
    setShowModal(true);
  };

  const handleSalvarEdicao = () => {
    if (!editingPerfil) return;

    setPerfis(prev =>
      prev.map(perfil =>
        perfil.id === editingPerfil.id
          ? { ...perfil, ...formData, updated_at: new Date().toISOString() }
          : perfil
      )
    );

    setFormData({
      nome: '',
      descricao: '',
      nivel_acesso: '',
      cor: 'bg-blue-600',
      icone: 'Shield',
    });
    setEditingPerfil(null);
    setShowModal(false);
  };

  const handleExcluirPerfil = (id: string) => {
    // Verificar se há usuários vinculados
    const usuariosVinculados = usuarios.filter(u => u.perfil_id === id);
    if (usuariosVinculados.length > 0) {
      alert(
        `Não é possível excluir o perfil. Existem ${usuariosVinculados.length} usuário(s) vinculado(s).`
      );
      return;
    }

    setPerfis(prev => prev.filter(perfil => perfil.id !== id));
  };

  const togglePerfilAtivo = (id: string) => {
    setPerfis(prev =>
      prev.map(perfil =>
        perfil.id === id
          ? {
              ...perfil,
              ativo: !perfil.ativo,
              updated_at: new Date().toISOString(),
            }
          : perfil
      )
    );
  };

  const handleCriarUsuario = () => {
    if (
      !usuarioFormData.nome.trim() ||
      !usuarioFormData.email.trim() ||
      !usuarioFormData.perfil_id
    )
      return;

    const novoUsuario: Usuario = {
      id: Date.now(),
      nome: usuarioFormData.nome,
      email: usuarioFormData.email,
      perfil_id: usuarioFormData.perfil_id,
      perfil_nome:
        perfis.find(p => p.id === usuarioFormData.perfil_id)?.nome || '',
      ativo: true,
      ultimo_acesso: new Date().toISOString(),
    };

    setUsuarios(prev => [...prev, novoUsuario]);

    // Atualizar contador de usuários vinculados ao perfil
    setPerfis(prev =>
      prev.map(perfil =>
        perfil.id === usuarioFormData.perfil_id
          ? { ...perfil, usuarios_vinculados: perfil.usuarios_vinculados + 1 }
          : perfil
      )
    );

    setUsuarioFormData({
      nome: '',
      email: '',
      perfil_id: '',
    });
    setShowUsuarioModal(false);
  };

  const handleAlterarPerfilUsuario = (
    usuarioId: number,
    novoPerfilId: string
  ) => {
    const usuario = usuarios.find(u => u.id === usuarioId);
    const perfilAntigo = perfis.find(p => p.id === usuario?.perfil_id);
    const novoPerfil = perfis.find(p => p.id === novoPerfilId);

    if (!usuario || !perfilAntigo || !novoPerfil) return;

    // Atualizar usuário
    setUsuarios(prev =>
      prev.map(u =>
        u.id === usuarioId
          ? { ...u, perfil_id: novoPerfilId, perfil_nome: novoPerfil.nome }
          : u
      )
    );

    // Atualizar contadores de perfis
    setPerfis(prev =>
      prev.map(perfil => {
        if (perfil.id === perfilAntigo.id) {
          return {
            ...perfil,
            usuarios_vinculados: perfil.usuarios_vinculados - 1,
          };
        }
        if (perfil.id === novoPerfil.id) {
          return {
            ...perfil,
            usuarios_vinculados: perfil.usuarios_vinculados + 1,
          };
        }
        return perfil;
      })
    );
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: {
      [key: string]: React.ComponentType<{ className?: string }>;
    } = {
      Crown,
      Shield,
      Building,
      UserCheck,
      User,
      Eye,
      EyeOff,
    };

    // Verificar se o ícone existe no mapa
    if (iconMap[iconName]) {
      return iconMap[iconName];
    }

    // Fallback para Shield se o ícone não for encontrado
    console.warn(
      `⚠️ Ícone não encontrado: ${iconName}, usando Shield como fallback`
    );
    return Shield;
  };

  const getNivelAcessoNome = (nivel: string) => {
    const nomeMap: { [key: string]: string } = {
      master: 'Master',
      admin: 'Administrador',
      gerente: 'Gerente',
      supervisor: 'Supervisor',
      operador: 'Operador',
      visualizador: 'Visualizador',
      convidado: 'Convidado',
    };
    return nomeMap[nivel] || nivel;
  };

  console.log('🔄 Renderizando página de perfis:', {
    isLoading,
    perfis: perfis.length,
    usuarios: usuarios.length,
  });

  if (isLoading) {
    console.log('🔄 Renderizando loading...');
    return (
      <ProtectedRoute requiredLevel="visualizador">
        <Layout>
          <div className="p-6">
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600 text-lg font-medium">
                Carregando perfis de usuários...
              </p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  console.log('🔄 Renderizando página principal...');

  return (
    <ProtectedRoute requiredLevel="visualizador">
      <Layout>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Debug Info - REMOVIDO */}

            {/* Cabeçalho */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-holding-white mb-3">
                Perfis de Usuários
              </h1>
              <p className="text-holding-accent-light text-lg">
                Gerencie perfis e níveis de acesso dos usuários do sistema
              </p>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="glass-effect border-holding-highlight/30 hover:border-holding-highlight/50 transition-all duration-300 hover:shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-holding-highlight to-holding-highlight-light rounded-2xl flex items-center justify-center shadow-lg">
                      <Users className="w-7 h-7 text-holding-white" />
                    </div>
                    <div>
                      <p className="text-holding-accent-light text-sm font-medium">
                        Total de Perfis
                      </p>
                      <p className="text-3xl font-bold text-holding-white">
                        {perfis.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-holding-highlight/30 hover:border-holding-highlight/50 transition-all duration-300 hover:shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <UserCheck className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-holding-accent-light text-sm font-medium">
                        Perfis Ativos
                      </p>
                      <p className="text-3xl font-bold text-holding-white">
                        {perfis.filter(p => p.ativo).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-holding-highlight/30 hover:border-holding-highlight/50 transition-all duration-300 hover:shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <UserX className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-holding-accent-light text-sm font-medium">
                        Perfis Inativos
                      </p>
                      <p className="text-3xl font-bold text-holding-white">
                        {perfis.filter(p => !p.ativo).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-holding-highlight/30 hover:border-holding-highlight/50 transition-all duration-300 hover:shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-holding-accent-light text-sm font-medium">
                        Níveis de Acesso
                      </p>
                      <p className="text-3xl font-bold text-holding-white">
                        {new Set(perfis.map(p => p.nivel_acesso)).size}
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
                    Lista de Perfis
                  </h2>
                  <p className="text-holding-accent-light">
                    Gerencie e configure os perfis de acesso do sistema
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => {
                      setEditingPerfil(null);
                      setFormData({
                        nome: '',
                        descricao: '',
                        nivel_acesso: '',
                        cor: 'bg-blue-600',
                        icone: 'Shield',
                      });
                      setShowModal(true);
                    }}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Novo Perfil
                  </Button>
                  <Button
                    onClick={() => {
                      setUsuarioFormData({
                        nome: '',
                        email: '',
                        perfil_id: '',
                      });
                      setShowUsuarioModal(true);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <User className="w-5 h-5 mr-2" />
                    Novo Usuário
                  </Button>
                </div>
              </div>
            </div>

            {/* Lista de Perfis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {perfis && perfis.length > 0 ? (
                perfis.map(perfil => (
                  <Card
                    key={perfil.id}
                    className="bg-white border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-2xl group"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-16 h-16 ${perfil.cor} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                          >
                            {(() => {
                              try {
                                const IconComponent = getIconComponent(
                                  perfil.icone
                                );
                                return (
                                  <IconComponent className="w-8 h-8 text-white" />
                                );
                              } catch (error) {
                                console.error(
                                  '❌ Erro ao renderizar ícone:',
                                  error
                                );
                                return (
                                  <Shield className="w-8 h-8 text-white" />
                                );
                              }
                            })()}
                          </div>
                          <div>
                            <CardTitle className="text-2xl text-gray-900 mb-2">
                              {perfil.nome}
                            </CardTitle>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant={
                                  perfil.ativo ? 'default' : 'destructive'
                                }
                                className="px-3 py-1 text-sm font-medium"
                              >
                                {perfil.ativo ? 'Ativo' : 'Inativo'}
                              </Badge>
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1 text-sm font-medium">
                                {getNivelAcessoNome(perfil.nivel_acesso)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => togglePerfilAtivo(perfil.id)}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              perfil.ativo
                                ? 'text-red-500 hover:text-red-600 hover:bg-red-50'
                                : 'text-green-500 hover:text-green-600 hover:bg-green-50'
                            }`}
                          >
                            {perfil.ativo ? (
                              <Lock className="w-4 h-4" />
                            ) : (
                              <Unlock className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditarPerfil(perfil)}
                            className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="p-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Excluir Perfil
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o perfil &quot;
                                  {perfil.nome}&quot;? Esta ação não pode ser
                                  desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleExcluirPerfil(perfil.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <p className="text-gray-700 text-base leading-relaxed">
                          {perfil.descricao}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <p className="text-gray-600 text-xs uppercase tracking-wide font-medium mb-1">
                            Usuários Vinculados
                          </p>
                          <p className="text-gray-900 text-lg font-bold">
                            {perfil.usuarios_vinculados}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <p className="text-gray-600 text-xs uppercase tracking-wide font-medium mb-1">
                            Permissões
                          </p>
                          <p className="text-gray-900 text-lg font-bold">
                            {perfil.permissoes.length}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                          <Key className="w-4 h-4 mr-2 text-blue-600" />
                          Permissões Principais
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {perfil.permissoes
                            .slice(0, 6)
                            .map((permissao, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs px-2 py-1 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                              >
                                {permissao}
                              </Badge>
                            ))}
                          {perfil.permissoes.length > 6 && (
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-1 border-blue-300 text-blue-700"
                            >
                              +{perfil.permissoes.length - 6} mais
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Usuários vinculados ao perfil */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                          <Users className="w-4 h-4 mr-2 text-blue-600" />
                          Usuários com este Perfil
                        </h4>
                        <div className="space-y-3">
                          {usuarios
                            .filter(u => u.perfil_id === perfil.id)
                            .map(usuario => (
                              <div
                                key={usuario.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="text-gray-900 text-sm font-medium">
                                      {usuario.nome}
                                    </p>
                                    <p className="text-gray-600 text-xs">
                                      {usuario.email}
                                    </p>
                                  </div>
                                </div>
                                <select
                                  value={usuario.perfil_id}
                                  onChange={e =>
                                    handleAlterarPerfilUsuario(
                                      usuario.id,
                                      e.target.value
                                    )
                                  }
                                  className="w-40 bg-white border-gray-300 text-gray-900 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  {perfis.map(p => (
                                    <option key={p.id} value={p.id}>
                                      {p.nome}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ))}
                          {usuarios.filter(u => u.perfil_id === perfil.id)
                            .length === 0 && (
                            <div className="text-center py-6">
                              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <User className="w-6 h-6 text-gray-400" />
                              </div>
                              <p className="text-gray-500 text-sm italic">
                                Nenhum usuário vinculado a este perfil
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Nenhum perfil encontrado
                  </h3>
                  <p className="text-gray-600 text-lg mb-6">
                    Crie o primeiro perfil para começar a gerenciar usuários do
                    sistema.
                  </p>
                  <Button
                    onClick={() => {
                      setEditingPerfil(null);
                      setFormData({
                        nome: '',
                        descricao: '',
                        nivel_acesso: '',
                        cor: 'bg-blue-600',
                        icone: 'Shield',
                      });
                      setShowModal(true);
                    }}
                    className="bg-gradient-to-r from-holding-highlight to-holding-highlight-light text-white font-medium px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="w-6 h-6 mr-3" />
                    Criar Primeiro Perfil
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal de Criação/Edição de Perfil */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-3xl bg-white border-gray-200">
            <DialogHeader className="pb-6">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {editingPerfil ? 'Editar Perfil' : 'Criar Novo Perfil'}
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-base">
                {editingPerfil
                  ? 'Modifique as informações do perfil selecionado.'
                  : 'Preencha as informações para criar um novo perfil de usuário.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="nome"
                    className="text-gray-700 font-medium mb-2 block"
                  >
                    Nome do Perfil
                  </Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, nome: e.target.value }))
                    }
                    placeholder="Ex: Gerente de Vendas, Analista Financeiro"
                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="nivel_acesso"
                    className="text-gray-700 font-medium mb-2 block"
                  >
                    Nível de Acesso
                  </Label>
                  <select
                    value={formData.nivel_acesso}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        nivel_acesso: e.target.value,
                      }))
                    }
                    className="bg-white border-gray-300 text-gray-900 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione o nível de acesso</option>
                    <option value="master">Master - Acesso total</option>
                    <option value="admin">
                      Administrador - Acesso administrativo
                    </option>
                    <option value="gerente">Gerente - Acesso gerencial</option>
                    <option value="supervisor">
                      Supervisor - Acesso de supervisão
                    </option>
                    <option value="operador">
                      Operador - Acesso operacional
                    </option>
                    <option value="visualizador">
                      Visualizador - Apenas visualização
                    </option>
                    <option value="convidado">
                      Convidado - Acesso limitado
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="descricao"
                  className="text-gray-700 font-medium mb-2 block"
                >
                  Descrição
                </Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      descricao: e.target.value,
                    }))
                  }
                  placeholder="Descreva as responsabilidades e permissões deste perfil"
                  rows={4}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="cor"
                    className="text-gray-700 font-medium mb-2 block"
                  >
                    Cor do Perfil
                  </Label>
                  <select
                    value={formData.cor}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, cor: e.target.value }))
                    }
                    className="bg-white border-gray-300 text-gray-900 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione a cor</option>
                    <option value="bg-red-600">Vermelho</option>
                    <option value="bg-purple-600">Roxo</option>
                    <option value="bg-blue-600">Azul</option>
                    <option value="bg-indigo-600">Índigo</option>
                    <option value="bg-green-600">Verde</option>
                    <option value="bg-amber-600">Âmbar</option>
                    <option value="bg-gray-600">Cinza</option>
                  </select>
                </div>
                <div>
                  <Label
                    htmlFor="icone"
                    className="text-gray-700 font-medium mb-2 block"
                  >
                    Ícone
                  </Label>
                  <select
                    value={formData.icone}
                    onChange={e =>
                      setFormData(prev => ({ ...prev, icone: e.target.value }))
                    }
                    className="bg-white border-gray-300 text-gray-900 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecione o ícone</option>
                    <option value="Crown">Coroa</option>
                    <option value="Shield">Escudo</option>
                    <option value="Building">Prédio</option>
                    <option value="UserCheck">Usuário Verificado</option>
                    <option value="User">Usuário</option>
                    <option value="Eye">Olho</option>
                    <option value="EyeOff">Olho Fechado</option>
                  </select>
                </div>
              </div>
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
                onClick={editingPerfil ? handleSalvarEdicao : handleCriarPerfil}
                className="bg-gradient-to-r from-holding-highlight to-holding-highlight-light hover:from-holding-highlight-light hover:to-holding-highlight text-white font-medium px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {editingPerfil ? 'Salvar Alterações' : 'Criar Perfil'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Criação de Usuário */}
        <Dialog open={showUsuarioModal} onOpenChange={setShowUsuarioModal}>
          <DialogContent className="max-w-md bg-white border-gray-200">
            <DialogHeader className="pb-6">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Criar Novo Usuário
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-base">
                Preencha as informações para criar um novo usuário e vincular a
                um perfil.
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
                  value={usuarioFormData.nome}
                  onChange={e =>
                    setUsuarioFormData(prev => ({
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
                  value={usuarioFormData.email}
                  onChange={e =>
                    setUsuarioFormData(prev => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="email@exemplo.com"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <Label
                  htmlFor="usuario-perfil"
                  className="text-gray-700 font-medium mb-2 block"
                >
                  Perfil
                </Label>
                <select
                  value={usuarioFormData.perfil_id}
                  onChange={e =>
                    setUsuarioFormData(prev => ({ ...prev, perfil_id: e.target.value }))
                  }
                  className="bg-white border-gray-300 text-gray-900 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione o perfil</option>
                  {perfis
                    .filter(p => p.ativo)
                    .map(perfil => (
                      <option key={perfil.id} value={perfil.id}>
                        {perfil.nome} - {getNivelAcessoNome(perfil.nivel_acesso)}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <DialogFooter className="pt-6">
              <Button
                variant="outline"
                onClick={() => setShowUsuarioModal(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCriarUsuario}
                className="bg-gradient-to-r from-holding-highlight to-holding-highlight-light hover:from-holding-highlight-light hover:to-holding-highlight text-white font-medium px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Criar Usuário
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Layout>
    </ProtectedRoute>
  );
}
