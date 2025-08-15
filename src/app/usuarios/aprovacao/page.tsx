'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  Save,
  User,
  Shield,
} from 'lucide-react';
import Link from 'next/link';

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
  descricao: string;
  nivel_acesso: string;
  ativo: boolean;
}

export default function AprovacaoUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [perfis, setPerfis] = useState<PerfilUsuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [filterPerfil, setFilterPerfil] = useState<string>('todos');

  // Carregar dados existentes
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    // Simular carregamento de dados existentes
    setIsLoading(true);

    setTimeout(() => {
      // Dados de usuários existentes
      const usuariosExistentes: Usuario[] = [
        {
          id: 1,
          nome: 'João Silva',
          email: 'joao@holding.com',
          perfil_id: '',
          perfil_nome: 'Sem perfil',
          ativo: false,
          aprovado: false,
          status: 'pendente',
          data_cadastro: '2024-01-15',
        },
        {
          id: 2,
          nome: 'Maria Santos',
          email: 'maria@holding.com',
          perfil_id: '2',
          perfil_nome: 'Operador',
          ativo: true,
          aprovado: true,
          status: 'aprovado',
          data_cadastro: '2024-01-10',
          data_aprovacao: '2024-01-12',
          aprovado_por: 'Administrador',
        },
        {
          id: 3,
          nome: 'Pedro Costa',
          email: 'pedro@holding.com',
          perfil_id: '3',
          perfil_nome: 'Visualizador',
          ativo: true,
          aprovado: true,
          status: 'aprovado',
          data_cadastro: '2024-01-08',
          data_aprovacao: '2024-01-09',
          aprovado_por: 'Administrador',
        },
        {
          id: 4,
          nome: 'Ana Oliveira',
          email: 'ana@holding.com',
          perfil_id: '',
          perfil_nome: 'Sem perfil',
          ativo: false,
          aprovado: false,
          status: 'pendente',
          data_cadastro: '2024-01-20',
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
          data_cadastro: '2024-01-22',
        },
      ];

      // Dados de perfis existentes
      const perfisExistentes: PerfilUsuario[] = [
        {
          id: '1',
          nome: 'Master',
          descricao: 'Acesso total ao sistema',
          nivel_acesso: 'Master',
          ativo: true,
        },
        {
          id: '2',
          nome: 'Administrador',
          descricao: 'Gerenciamento completo',
          nivel_acesso: 'Administrador',
          ativo: true,
        },
        {
          id: '3',
          nome: 'Operador',
          descricao: 'Operações básicas',
          nivel_acesso: 'Operador',
          ativo: true,
        },
        {
          id: '4',
          nome: 'Visualizador',
          descricao: 'Apenas visualização',
          nivel_acesso: 'Visualizador',
          ativo: true,
        },
      ];

      setUsuarios(usuariosExistentes);
      setPerfis(perfisExistentes);
      setIsLoading(false);
    }, 1000);
  };

  const handleAprovarUsuario = (usuarioId: number) => {
    setUsuarios(prev =>
      prev.map(usuario =>
        usuario.id === usuarioId
          ? {
              ...usuario,
              status: 'aprovado',
              aprovado: true,
              ativo: true,
              data_aprovacao: new Date().toISOString().split('T')[0],
              aprovado_por: 'Administrador',
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
              status: 'rejeitado',
              aprovado: false,
              ativo: false,
            }
          : usuario
      )
    );
  };

  const handleAlterarPerfil = (usuarioId: number, perfilId: string) => {
    const perfil = perfis.find(p => p.id === perfilId);
    if (perfil) {
      setUsuarios(prev =>
        prev.map(usuario =>
          usuario.id === usuarioId
            ? {
                ...usuario,
                perfil_id: perfilId,
                perfil_nome: perfil.nome,
              }
            : usuario
        )
      );
    }
  };

  const handleToggleAtivo = (usuarioId: number) => {
    setUsuarios(prev =>
      prev.map(usuario =>
        usuario.id === usuarioId
          ? { ...usuario, ativo: !usuario.ativo }
          : usuario
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'aprovado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejeitado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Clock className="w-4 h-4" />;
      case 'aprovado':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejeitado':
        return <XCircle className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
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
                  Aprovação de Usuários
                </h1>
                <p className="text-holding-accent-light text-lg">
                  Gerencie a aprovação e perfis dos usuários do sistema
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

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total de Usuários
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {estatisticas.total}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Pendentes
                    </p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {estatisticas.pendentes}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Aprovados
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      {estatisticas.aprovados}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Rejeitados
                    </p>
                    <p className="text-3xl font-bold text-red-600">
                      {estatisticas.rejeitados}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ativos</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {estatisticas.ativos}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search" className="text-gray-700">
                  Buscar
                </Label>
                <Input
                  id="search"
                  placeholder="Nome ou email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="status" className="text-gray-700">
                  Status
                </Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Status</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="aprovado">Aprovado</SelectItem>
                    <SelectItem value="rejeitado">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="perfil" className="text-gray-700">
                  Perfil
                </Label>
                <Select value={filterPerfil} onValueChange={setFilterPerfil}>
                  <SelectTrigger className="mt-1">
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

              <div className="flex items-end">
                <Button
                  onClick={carregarDados}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Atualizar
                </Button>
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
                            <Badge className={getStatusColor(usuario.status)}>
                              {getStatusIcon(usuario.status)}
                              <span className="ml-1 capitalize">
                                {usuario.status}
                              </span>
                            </Badge>
                            <Badge
                              className={
                                usuario.ativo
                                  ? 'bg-green-100 text-green-800 border-green-200'
                                  : 'bg-red-100 text-red-800 border-red-200'
                              }
                            >
                              {usuario.ativo ? 'Ativo' : 'Inativo'}
                            </Badge>
                            {usuario.perfil_nome !== 'Sem perfil' && (
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                {usuario.perfil_nome}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Cadastrado em: {usuario.data_cadastro}
                            {usuario.data_aprovacao &&
                              ` | Aprovado em: ${usuario.data_aprovacao} por ${usuario.aprovado_por}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Ações para usuários pendentes */}
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

                      {/* Alterar perfil */}
                      <div className="min-w-[200px]">
                        <Select
                          value={usuario.perfil_id}
                          onValueChange={value =>
                            handleAlterarPerfil(usuario.id, value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar perfil" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Sem perfil</SelectItem>
                            {perfis.map(perfil => (
                              <SelectItem key={perfil.id} value={perfil.id}>
                                {perfil.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Toggle ativo/inativo */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleAtivo(usuario.id)}
                        className={`${usuario.ativo ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : 'text-green-600 hover:text-green-700 hover:bg-green-50'}`}
                      >
                        {usuario.ativo ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {usuariosFiltrados.length === 0 && (
              <Card className="bg-white border-gray-200">
                <CardContent className="p-12 text-center">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum usuário encontrado
                  </h3>
                  <p className="text-gray-600">
                    Tente ajustar os filtros ou cadastrar novos usuários.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
