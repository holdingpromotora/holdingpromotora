export interface User {
  id: number;
  email: string;
  nome: string;
  perfil_id?: string;
  perfil_nome?: string;
  aprovado?: boolean;
  ativo?: boolean;
  status?: 'pendente' | 'aprovado' | 'rejeitado';
  data_cadastro?: string;
  data_aprovacao?: string;
  aprovado_por?: string;
  ultimo_acesso?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  user?: User;
  error?: string;
  pending?: boolean;
  rejected?: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  hasApprovedProfile: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
}

export type AccessLevel = 'admin' | 'gerente' | 'operador' | 'visualizador';

export const ACCESS_LEVELS: Record<AccessLevel, number> = {
  visualizador: 1,
  operador: 2,
  gerente: 3,
  admin: 4,
};

export const hasPermission = (
  userLevel: AccessLevel,
  requiredLevel: AccessLevel
): boolean => {
  return ACCESS_LEVELS[userLevel] >= ACCESS_LEVELS[requiredLevel];
};
