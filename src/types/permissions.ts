// Tipos de Permissões do Sistema
export type PermissionCategory = 
  | 'usuarios' 
  | 'sistema' 
  | 'relatorios' 
  | 'proprios' 
  | 'financeiro' 
  | 'marketing' 
  | 'cadastros'
  | 'dashboard';

export type PermissionAction = 
  | 'visualizar' 
  | 'criar' 
  | 'editar' 
  | 'excluir' 
  | 'gerenciar' 
  | 'aprovar' 
  | 'rejeitar' 
  | 'exportar';

export interface Permission {
  id: string;
  nome: string;
  descricao: string;
  categoria: PermissionCategory;
  acao: PermissionAction;
  recurso: string;
  ativo: boolean;
  nivelMinimo: number;
  created_at: Date;
  updated_at: Date;
}

export interface PermissionGroup {
  categoria: PermissionCategory;
  nome: string;
  descricao: string;
  permissoes: Permission[];
  nivelMinimo: number;
}

// Tipos de Acesso
export interface AccessType {
  id: string;
  nome: string;
  descricao: string;
  nivel: number;
  cor: string;
  icone: string;
  ativo: boolean;
  created_at: Date;
  updated_at: Date;
}

// Níveis de Acesso com Permissões
export interface AccessLevel {
  id: string;
  tipoAcessoId: string;
  tipoAcessoNome: string;
  permissoes: string[];
  ativo: boolean;
  created_at: Date;
  updated_at: Date;
}

// Usuário com Nível de Acesso
export interface UserWithAccess {
  id: number;
  email: string;
  nome: string;
  nivel_acesso: string;
  tipoAcesso: AccessType;
  permissoes: Permission[];
  ativo: boolean;
  ultimo_acesso?: Date;
  created_at: Date;
}

// Verificação de Permissões
export interface PermissionCheck {
  usuario: UserWithAccess;
  permissao: string;
  recurso?: string;
  acao?: PermissionAction;
  categoria?: PermissionCategory;
}

// Resultado da Verificação
export interface PermissionResult {
  permitido: boolean;
  motivo?: string;
  nivelNecessario?: number;
  permissaoEncontrada?: Permission;
}

// Constantes do Sistema
export const ACCESS_LEVELS = {
  MASTER: 1,
  ADMIN: 2,
  GERENTE: 3,
  SUPERVISOR: 4,
  OPERADOR: 5,
  VISUALIZADOR: 6,
  CONVIDADO: 7
} as const;

export const ACCESS_LEVEL_NAMES = {
  [ACCESS_LEVELS.MASTER]: 'Master',
  [ACCESS_LEVELS.ADMIN]: 'Administrador',
  [ACCESS_LEVELS.GERENTE]: 'Gerente',
  [ACCESS_LEVELS.SUPERVISOR]: 'Supervisor',
  [ACCESS_LEVELS.OPERADOR]: 'Operador',
  [ACCESS_LEVELS.VISUALIZADOR]: 'Visualizador',
  [ACCESS_LEVELS.CONVIDADO]: 'Convidado'
} as const;

export const ACCESS_LEVEL_COLORS = {
  [ACCESS_LEVELS.MASTER]: 'bg-red-600',
  [ACCESS_LEVELS.ADMIN]: 'bg-purple-600',
  [ACCESS_LEVELS.GERENTE]: 'bg-blue-600',
  [ACCESS_LEVELS.SUPERVISOR]: 'bg-indigo-600',
  [ACCESS_LEVELS.OPERADOR]: 'bg-green-600',
  [ACCESS_LEVELS.VISUALIZADOR]: 'bg-amber-600',
  [ACCESS_LEVELS.CONVIDADO]: 'bg-gray-600'
} as const;

// Permissões Padrão do Sistema
export const DEFAULT_PERMISSIONS: Permission[] = [
  // Dashboard
  {
    id: 'dashboard_view',
    nome: 'Visualizar Dashboard',
    descricao: 'Acesso ao painel principal do sistema',
    categoria: 'dashboard',
    acao: 'visualizar',
    recurso: 'dashboard',
    ativo: true,
    nivelMinimo: ACCESS_LEVELS.VISUALIZADOR,
    created_at: new Date(),
    updated_at: new Date()
  },
  
  // Usuários
  {
    id: 'usuarios_view',
    nome: 'Visualizar Usuários',
    descricao: 'Ver lista de usuários do sistema',
    categoria: 'usuarios',
    acao: 'visualizar',
    recurso: 'usuarios',
    ativo: true,
    nivelMinimo: ACCESS_LEVELS.VISUALIZADOR,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'usuarios_create',
    nome: 'Criar Usuários',
    descricao: 'Criar novos usuários no sistema',
    categoria: 'usuarios',
    acao: 'criar',
    recurso: 'usuarios',
    ativo: true,
    nivelMinimo: ACCESS_LEVELS.OPERADOR,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'usuarios_edit',
    nome: 'Editar Usuários',
    descricao: 'Modificar usuários existentes',
    categoria: 'usuarios',
    acao: 'editar',
    recurso: 'usuarios',
    ativo: true,
    nivelMinimo: ACCESS_LEVELS.OPERADOR,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'usuarios_delete',
    nome: 'Excluir Usuários',
    descricao: 'Remover usuários do sistema',
    categoria: 'usuarios',
    acao: 'excluir',
    recurso: 'usuarios',
    ativo: true,
    nivelMinimo: ACCESS_LEVELS.SUPERVISOR,
    created_at: new Date(),
    updated_at: new Date()
  },
  
  // Cadastros
  {
    id: 'cadastros_view',
    nome: 'Visualizar Cadastros',
    descricao: 'Ver cadastros de pessoas físicas e jurídicas',
    categoria: 'cadastros',
    acao: 'visualizar',
    recurso: 'cadastros',
    ativo: true,
    nivelMinimo: ACCESS_LEVELS.VISUALIZADOR,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'cadastros_create',
    nome: 'Criar Cadastros',
    descricao: 'Criar novos cadastros',
    categoria: 'cadastros',
    acao: 'criar',
    recurso: 'cadastros',
    ativo: true,
    nivelMinimo: ACCESS_LEVELS.OPERADOR,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'cadastros_edit',
    nome: 'Editar Cadastros',
    descricao: 'Modificar cadastros existentes',
    categoria: 'cadastros',
    acao: 'editar',
    recurso: 'cadastros',
    ativo: true,
    nivelMinimo: ACCESS_LEVELS.OPERADOR,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'cadastros_delete',
    nome: 'Excluir Cadastros',
    descricao: 'Remover cadastros do sistema',
    categoria: 'cadastros',
    acao: 'excluir',
    recurso: 'cadastros',
    ativo: true,
    nivelMinimo: ACCESS_LEVELS.SUPERVISOR,
    created_at: new Date(),
    updated_at: new Date()
  },
  
  // Sistema
  {
    id: 'sistema_config',
    nome: 'Configurar Sistema',
    descricao: 'Acessar configurações do sistema',
    categoria: 'sistema',
    acao: 'gerenciar',
    recurso: 'sistema',
    ativo: true,
    nivelMinimo: ACCESS_LEVELS.ADMIN,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'sistema_logs',
    nome: 'Visualizar Logs',
    descricao: 'Acessar logs do sistema',
    categoria: 'sistema',
    acao: 'visualizar',
    recurso: 'logs',
    ativo: true,
    nivelMinimo: ACCESS_LEVELS.GERENTE,
    created_at: new Date(),
    updated_at: new Date()
  },
  
  // Relatórios
  {
    id: 'relatorios_view',
    nome: 'Visualizar Relatórios',
    descricao: 'Acessar relatórios do sistema',
    categoria: 'relatorios',
    acao: 'visualizar',
    recurso: 'relatorios',
    ativo: true,
    nivelMinimo: ACCESS_LEVELS.VISUALIZADOR,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'relatorios_create',
    nome: 'Criar Relatórios',
    descricao: 'Gerar novos relatórios',
    categoria: 'relatorios',
    acao: 'criar',
    recurso: 'relatorios',
    ativo: true,
    nivelMinimo: ACCESS_LEVELS.OPERADOR,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'relatorios_export',
    nome: 'Exportar Relatórios',
    descricao: 'Exportar dados em diferentes formatos',
    categoria: 'relatorios',
    acao: 'exportar',
    recurso: 'relatorios',
    ativo: true,
    nivelMinimo: ACCESS_LEVELS.OPERADOR,
    created_at: new Date(),
    updated_at: new Date()
  },
  
  // Registros Próprios
  {
    id: 'proprios_view',
    nome: 'Visualizar Próprios',
    descricao: 'Ver apenas registros criados por si',
    categoria: 'proprios',
    acao: 'visualizar',
    recurso: 'proprios',
    ativo: true,
    nivelMinimo: ACCESS_LEVELS.VISUALIZADOR,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'proprios_edit',
    nome: 'Editar Próprios',
    descricao: 'Modificar apenas registros criados por si',
    categoria: 'proprios',
    acao: 'editar',
    recurso: 'proprios',
    ativo: true,
    nivelMinimo: ACCESS_LEVELS.OPERADOR,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'proprios_delete',
    nome: 'Excluir Próprios',
    descricao: 'Remover apenas registros criados por si',
    categoria: 'proprios',
    acao: 'excluir',
    recurso: 'proprios',
    ativo: true,
    nivelMinimo: ACCESS_LEVELS.OPERADOR,
    created_at: new Date(),
    updated_at: new Date()
  }
];

// Funções de Verificação de Permissões
export const hasPermission = (
  userLevel: number, 
  requiredLevel: number
): boolean => {
  return userLevel <= requiredLevel;
};

export const hasSpecificPermission = (
  user: UserWithAccess,
  permissionId: string
): boolean => {
  return user.permissoes.some(p => p.id === permissionId && p.ativo);
};

export const hasPermissionForAction = (
  user: UserWithAccess,
  categoria: PermissionCategory,
  acao: PermissionAction,
  recurso?: string
): boolean => {
  return user.permissoes.some(p => 
    p.categoria === categoria && 
    p.acao === acao && 
    (!recurso || p.recurso === recurso) &&
    p.ativo
  );
};

export const canAccessResource = (
  user: UserWithAccess,
  categoria: PermissionCategory,
  acao: PermissionAction = 'visualizar'
): boolean => {
  return hasPermissionForAction(user, categoria, acao);
};

export const getUserPermissions = (
  user: UserWithAccess,
  categoria?: PermissionCategory
): Permission[] => {
  if (categoria) {
    return user.permissoes.filter(p => p.categoria === categoria && p.ativo);
  }
  return user.permissoes.filter(p => p.ativo);
};

export const getPermissionGroups = (permissoes: Permission[]): PermissionGroup[] => {
  const grupos: { [key: string]: PermissionGroup } = {};
  
  permissoes.forEach(permissao => {
    if (!grupos[permissao.categoria]) {
      grupos[permissao.categoria] = {
        categoria: permissao.categoria,
        nome: getCategoryName(permissao.categoria),
        descricao: getCategoryDescription(permissao.categoria),
        permissoes: [],
        nivelMinimo: permissao.nivelMinimo
      };
    }
    grupos[permissao.categoria].permissoes.push(permissao);
  });
  
  return Object.values(grupos).sort((a, b) => a.nivelMinimo - b.nivelMinimo);
};

export const getCategoryName = (categoria: PermissionCategory): string => {
  const names: Record<PermissionCategory, string> = {
    usuarios: 'Usuários',
    sistema: 'Sistema',
    relatorios: 'Relatórios',
    proprios: 'Registros Próprios',
    financeiro: 'Financeiro',
    marketing: 'Marketing',
    cadastros: 'Cadastros',
    dashboard: 'Dashboard'
  };
  return names[categoria];
};

export const getCategoryDescription = (categoria: PermissionCategory): string => {
  const descriptions: Record<PermissionCategory, string> = {
    usuarios: 'Gerenciamento de usuários e perfis',
    sistema: 'Configurações e administração do sistema',
    relatorios: 'Geração e visualização de relatórios',
    proprios: 'Controle sobre registros criados pelo usuário',
    financeiro: 'Operações financeiras e contábeis',
    marketing: 'Campanhas e estratégias de marketing',
    cadastros: 'Cadastros de clientes e parceiros',
    dashboard: 'Painel principal e visualizações'
  };
  return descriptions[categoria];
};
