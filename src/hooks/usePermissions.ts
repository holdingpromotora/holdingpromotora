import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import {
  Permission,
  PermissionCategory,
  PermissionAction,
  hasSpecificPermission,
  hasPermissionForAction,
  canAccessResource,
  getUserPermissions,
  getPermissionGroups,
  ACCESS_LEVELS,
} from '@/types/permissions';

export const usePermissions = () => {
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Verificar se usuário tem uma permissão específica
  const can = (permissionId: string): boolean => {
    if (!user || !isClient) return false;

    // Usuário master tem todas as permissões
    if (user.email === 'grupoarmandogomes@gmail.com') return true;

    // Por enquanto, retornar true para usuários aprovados
    return !!(user.aprovado && user.ativo);
  };

  // Verificar se usuário pode executar uma ação em uma categoria
  const canDo = (
    categoria: PermissionCategory,
    acao: PermissionAction,
    recurso?: string
  ): boolean => {
    if (!user || !isClient) return false;

    // Usuário master pode fazer tudo
    if (user.email === 'grupoarmandogomes@gmail.com') return true;

    // Por enquanto, retornar true para usuários aprovados
    return !!(user.aprovado && user.ativo);
  };

  // Verificar se usuário pode acessar um recurso
  const canAccess = (
    categoria: PermissionCategory,
    acao: PermissionAction = 'visualizar'
  ): boolean => {
    if (!user || !isClient) return false;

    // Usuário master pode acessar tudo
    if (user.email === 'grupoarmandogomes@gmail.com') return true;

    // Por enquanto, retornar true para usuários aprovados
    return !!(user.aprovado && user.ativo);
  };

  // Obter permissões do usuário por categoria
  const getPermissions = (categoria?: PermissionCategory): Permission[] => {
    if (!user) return [];

    // Por enquanto, retornar array vazio
    return [];
  };

  // Obter grupos de permissões organizados
  const getUserPermissionGroups = () => {
    if (!user) return [];
    return [];
  };

  // Verificar se usuário tem nível mínimo
  const hasLevel = (requiredLevel: number): boolean => {
    if (!user) return false;

    // Por enquanto, retornar true para usuários aprovados
    return !!(user.aprovado && user.ativo);
  };

  // Verificar se usuário é master
  const isMaster = (): boolean => {
    return user?.email === 'grupoarmandogomes@gmail.com';
  };

  // Verificar se usuário é admin
  const isAdmin = (): boolean => {
    return hasLevel(ACCESS_LEVELS.ADMIN) || isMaster();
  };

  // Verificar se usuário é gerente
  const isGerente = (): boolean => {
    return hasLevel(ACCESS_LEVELS.GERENTE) || isAdmin();
  };

  // Verificar se usuário é supervisor
  const isSupervisor = (): boolean => {
    return hasLevel(ACCESS_LEVELS.SUPERVISOR) || isGerente();
  };

  // Verificar se usuário é operador
  const isOperador = (): boolean => {
    return hasLevel(ACCESS_LEVELS.OPERADOR) || isSupervisor();
  };

  // Verificar se usuário é visualizador
  const isVisualizador = (): boolean => {
    return hasLevel(ACCESS_LEVELS.VISUALIZADOR) || isOperador();
  };

  // Obter número do nível de acesso
  const getAccessLevelNumber = (nivelAcesso: string): number => {
    const levelMap: { [key: string]: number } = {
      master: ACCESS_LEVELS.MASTER,
      admin: ACCESS_LEVELS.ADMIN,
      gerente: ACCESS_LEVELS.GERENTE,
      supervisor: ACCESS_LEVELS.SUPERVISOR,
      operador: ACCESS_LEVELS.OPERADOR,
      visualizador: ACCESS_LEVELS.VISUALIZADOR,
      convidado: ACCESS_LEVELS.CONVIDADO,
    };
    return levelMap[nivelAcesso.toLowerCase()] || ACCESS_LEVELS.CONVIDADO;
  };

  // Verificar se usuário pode ver todos os registros ou apenas próprios
  const canSeeAllRecords = (categoria: PermissionCategory): boolean => {
    if (!user) return false;

    // Master e admin podem ver tudo
    if (isMaster() || isAdmin()) return true;

    // Verificar se tem permissão específica para ver todos
    return canDo(categoria, 'visualizar');
  };

  // Verificar se usuário pode editar todos os registros ou apenas próprios
  const canEditAllRecords = (categoria: PermissionCategory): boolean => {
    if (!user) return false;

    // Master e admin podem editar tudo
    if (isMaster() || isAdmin()) return true;

    // Verificar se tem permissão específica para editar todos
    return canDo(categoria, 'editar');
  };

  // Verificar se usuário pode excluir todos os registros ou apenas próprios
  const canDeleteAllRecords = (categoria: PermissionCategory): boolean => {
    if (!user) return false;

    // Master e admin podem excluir tudo
    if (isMaster() || isAdmin()) return true;

    // Verificar se tem permissão específica para excluir todos
    return canDo(categoria, 'excluir');
  };

  // Verificar se usuário pode criar registros
  const canCreateRecords = (categoria: PermissionCategory): boolean => {
    if (!user) return false;
    return canDo(categoria, 'criar');
  };

  // Verificar se usuário pode exportar dados
  const canExportData = (categoria: PermissionCategory): boolean => {
    if (!user) return false;
    return canDo(categoria, 'exportar');
  };

  // Verificar se usuário pode gerenciar sistema
  const canManageSystem = (): boolean => {
    if (!user) return false;
    return canDo('sistema', 'gerenciar');
  };

  // Verificar se usuário pode ver logs
  const canViewLogs = (): boolean => {
    if (!user) return false;
    return canDo('sistema', 'visualizar', 'logs');
  };

  // Verificar se usuário pode gerenciar usuários
  const canManageUsers = (): boolean => {
    if (!user) return false;
    return canDo('usuarios', 'gerenciar') || isAdmin();
  };

  // Verificar se usuário pode criar usuários
  const canCreateUsers = (): boolean => {
    if (!user) return false;
    return canDo('usuarios', 'criar') || canManageUsers();
  };

  // Verificar se usuário pode editar usuários
  const canEditUsers = (): boolean => {
    if (!user) return false;
    return canDo('usuarios', 'editar') || canManageUsers();
  };

  // Verificar se usuário pode excluir usuários
  const canDeleteUsers = (): boolean => {
    if (!user) return false;
    return canDo('usuarios', 'excluir') || canManageUsers();
  };

  // Verificar se usuário pode ver relatórios
  const canViewReports = (): boolean => {
    if (!user) return false;
    return canDo('relatorios', 'visualizar');
  };

  // Verificar se usuário pode criar relatórios
  const canCreateReports = (): boolean => {
    if (!user) return false;
    return canDo('relatorios', 'criar');
  };

  // Verificar se usuário pode exportar relatórios
  const canExportReports = (): boolean => {
    if (!user) return false;
    return canDo('relatorios', 'exportar');
  };

  // Verificar se usuário pode ver cadastros
  const canViewCadastros = (): boolean => {
    if (!user) return false;
    return canDo('cadastros', 'visualizar');
  };

  // Verificar se usuário pode criar cadastros
  const canCreateCadastros = (): boolean => {
    if (!user) return false;
    return canDo('cadastros', 'criar');
  };

  // Verificar se usuário pode editar cadastros
  const canEditCadastros = (): boolean => {
    if (!user) return false;
    return canDo('cadastros', 'editar');
  };

  // Verificar se usuário pode excluir cadastros
  const canDeleteCadastros = (): boolean => {
    if (!user) return false;
    return canDo('cadastros', 'excluir');
  };

  return {
    // Verificações básicas
    can,
    canDo,
    canAccess,
    hasLevel,

    // Verificações de nível
    isMaster,
    isAdmin,
    isGerente,
    isSupervisor,
    isOperador,
    isVisualizador,

    // Verificações de permissões
    canSeeAllRecords,
    canEditAllRecords,
    canDeleteAllRecords,
    canCreateRecords,
    canExportData,

    // Verificações específicas do sistema
    canManageSystem,
    canViewLogs,
    canManageUsers,
    canCreateUsers,
    canEditUsers,
    canDeleteUsers,

    // Verificações de relatórios
    canViewReports,
    canCreateReports,
    canExportReports,

    // Verificações de cadastros
    canViewCadastros,
    canCreateCadastros,
    canEditCadastros,
    canDeleteCadastros,

    // Utilitários
    getPermissions,
    getUserPermissionGroups,
    getAccessLevelNumber,
  };
};
