'use client';

import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { PermissionCategory, PermissionAction } from '@/types/permissions';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: string;
  categoria?: PermissionCategory;
  acao?: PermissionAction;
  recurso?: string;
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  categoria,
  acao,
  recurso,
  fallback,
  showFallback = true,
}) => {
  const { can, canDo, canAccess } = usePermissions();

  // Verificar permissão específica
  if (permission && !can(permission)) {
    return showFallback ? fallback || null : null;
  }

  // Verificar permissão por categoria e ação
  if (categoria && acao && !canDo(categoria, acao, recurso)) {
    return showFallback ? fallback || null : null;
  }

  // Verificar acesso ao recurso
  if (categoria && !canAccess(categoria, acao || 'visualizar')) {
    return showFallback ? fallback || null : null;
  }

  return <>{children}</>;
};

// Componente para mostrar/esconder baseado em permissão
export const ShowIf: React.FC<PermissionGuardProps> = props => {
  return <PermissionGuard {...props} showFallback={false} />;
};

// Componente para mostrar conteúdo alternativo baseado em permissão
export const ShowIfNot: React.FC<PermissionGuardProps> = ({
  children,
  fallback,
  ...props
}) => {
  const { can, canDo, canAccess } = usePermissions();

  let hasPermission = false;

  if (props.permission) {
    hasPermission = can(props.permission);
  } else if (props.categoria && props.acao) {
    hasPermission = canDo(props.categoria, props.acao, props.recurso);
  } else if (props.categoria) {
    hasPermission = canAccess(props.categoria, props.acao || 'visualizar');
  }

  if (!hasPermission) {
    return <>{children}</>;
  }

  return <>{fallback || null}</>;
};

// Componente para renderização condicional baseada em permissão
export const ConditionalRender: React.FC<{
  children: React.ReactNode;
  permission?: string;
  categoria?: PermissionCategory;
  acao?: PermissionAction;
  recurso?: string;
  fallback?: React.ReactNode;
  condition?: boolean;
}> = ({
  children,
  permission,
  categoria,
  acao,
  recurso,
  fallback,
  condition,
}) => {
  const { can, canDo, canAccess } = usePermissions();

  let hasPermission = true;

  if (condition !== undefined) {
    hasPermission = condition;
  } else if (permission) {
    hasPermission = can(permission);
  } else if (categoria && acao) {
    hasPermission = canDo(categoria, acao, recurso);
  } else if (categoria) {
    hasPermission = canAccess(categoria, acao || 'visualizar');
  }

  if (hasPermission) {
    return <>{children}</>;
  }

  return <>{fallback || null}</>;
};

// Componente para botões com permissão
export const PermissionButton: React.FC<{
  children: React.ReactNode;
  permission?: string;
  categoria?: PermissionCategory;
  acao?: PermissionAction;
  recurso?: string;
  fallback?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}> = ({
  children,
  permission,
  categoria,
  acao,
  recurso,
  fallback,
  disabled = false,
  className = '',
  onClick,
  variant = 'default',
  size = 'default',
  ...props
}) => {
  const { can, canDo, canAccess } = usePermissions();

  let hasPermission = true;

  if (permission) {
    hasPermission = can(permission);
  } else if (categoria && acao) {
    hasPermission = canDo(categoria, acao, recurso);
  } else if (categoria) {
    hasPermission = canAccess(categoria, acao || 'visualizar');
  }

  if (!hasPermission) {
    return <>{fallback || null}</>;
  }

  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Componente para links com permissão
export const PermissionLink: React.FC<{
  children: React.ReactNode;
  href: string;
  permission?: string;
  categoria?: PermissionCategory;
  acao?: PermissionAction;
  recurso?: string;
  fallback?: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}> = ({
  children,
  href,
  permission,
  categoria,
  acao,
  recurso,
  fallback,
  className = '',
  target,
  rel,
  ...props
}) => {
  const { can, canDo, canAccess } = usePermissions();

  let hasPermission = true;

  if (permission) {
    hasPermission = can(permission);
  } else if (categoria && acao) {
    hasPermission = canDo(categoria, acao, recurso);
  } else if (categoria) {
    hasPermission = canAccess(categoria, acao || 'visualizar');
  }

  if (!hasPermission) {
    return <>{fallback || null}</>;
  }

  return (
    <a href={href} className={className} target={target} rel={rel} {...props}>
      {children}
    </a>
  );
};

// Hook para verificar múltiplas permissões
export const useMultiplePermissions = () => {
  const { can, canDo, canAccess } = usePermissions();

  const checkMultiple = (
    checks: Array<{
      permission?: string;
      categoria?: PermissionCategory;
      acao?: PermissionAction;
      recurso?: string;
    }>
  ): boolean => {
    return checks.every(check => {
      if (check.permission) {
        return can(check.permission);
      }
      if (check.categoria && check.acao) {
        return canDo(check.categoria, check.acao, check.recurso);
      }
      if (check.categoria) {
        return canAccess(check.categoria, check.acao || 'visualizar');
      }
      return true;
    });
  };

  const checkAny = (
    checks: Array<{
      permission?: string;
      categoria?: PermissionCategory;
      acao?: PermissionAction;
      recurso?: string;
    }>
  ): boolean => {
    return checks.some(check => {
      if (check.permission) {
        return can(check.permission);
      }
      if (check.categoria && check.acao) {
        return canDo(check.categoria, check.acao, check.recurso);
      }
      if (check.categoria) {
        return canAccess(check.categoria, check.acao || 'visualizar');
      }
      return false;
    });
  };

  return {
    checkMultiple,
    checkAny,
  };
};
