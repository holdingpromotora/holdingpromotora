import { supabase } from './supabase';
import { Permission, PermissionCategory, PermissionAction, ACCESS_LEVELS } from '@/types/permissions';

// Configuração do sistema de permissões
export const PERMISSIONS_CONFIG = {
  // Níveis de acesso padrão
  DEFAULT_ACCESS_LEVELS: [
    {
      id: 1,
      nome: 'Master',
      descricao: 'Acesso total ao sistema',
      nivel: ACCESS_LEVELS.MASTER,
      cor: 'bg-red-600',
      icone: 'Shield',
      ativo: true
    },
    {
      id: 2,
      nome: 'Administrador',
      descricao: 'Acesso administrativo completo',
      nivel: ACCESS_LEVELS.ADMIN,
      cor: 'bg-purple-600',
      icone: 'Shield',
      ativo: true
    },
    {
      id: 3,
      nome: 'Gerente',
      descricao: 'Acesso gerencial com limitações',
      nivel: ACCESS_LEVELS.GERENTE,
      cor: 'bg-blue-600',
      icone: 'Shield',
      ativo: true
    },
    {
      id: 4,
      nome: 'Supervisor',
      descricao: 'Acesso de supervisão',
      nivel: ACCESS_LEVELS.SUPERVISOR,
      cor: 'bg-indigo-600',
      icone: 'Shield',
      ativo: true
    },
    {
      id: 5,
      nome: 'Operador',
      descricao: 'Acesso operacional básico',
      nivel: ACCESS_LEVELS.OPERADOR,
      cor: 'bg-green-600',
      icone: 'Shield',
      ativo: true
    },
    {
      id: 6,
      nome: 'Visualizador',
      descricao: 'Acesso apenas para visualização',
      nivel: ACCESS_LEVELS.VISUALIZADOR,
      cor: 'bg-amber-600',
      icone: 'Eye',
      ativo: true
    },
    {
      id: 7,
      nome: 'Convidado',
      descricao: 'Acesso limitado para convidados',
      nivel: ACCESS_LEVELS.CONVIDADO,
      cor: 'bg-gray-600',
      icone: 'User',
      ativo: true
    }
  ],

  // Permissões padrão do sistema
  DEFAULT_PERMISSIONS: [
    // Dashboard
    {
      id: 'dashboard_view',
      nome: 'Visualizar Dashboard',
      descricao: 'Acesso ao painel principal do sistema',
      categoria: 'dashboard' as PermissionCategory,
      acao: 'visualizar' as PermissionAction,
      recurso: 'dashboard',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.VISUALIZADOR
    },

    // Usuários
    {
      id: 'usuarios_view',
      nome: 'Visualizar Usuários',
      descricao: 'Ver lista de usuários do sistema',
      categoria: 'usuarios' as PermissionCategory,
      acao: 'visualizar' as PermissionAction,
      recurso: 'usuarios',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.VISUALIZADOR
    },
    {
      id: 'usuarios_create',
      nome: 'Criar Usuários',
      descricao: 'Criar novos usuários no sistema',
      categoria: 'usuarios' as PermissionCategory,
      acao: 'criar' as PermissionAction,
      recurso: 'usuarios',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.OPERADOR
    },
    {
      id: 'usuarios_edit',
      nome: 'Editar Usuários',
      descricao: 'Modificar usuários existentes',
      categoria: 'usuarios' as PermissionCategory,
      acao: 'editar' as PermissionAction,
      recurso: 'usuarios',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.OPERADOR
    },
    {
      id: 'usuarios_delete',
      nome: 'Excluir Usuários',
      descricao: 'Remover usuários do sistema',
      categoria: 'usuarios' as PermissionCategory,
      acao: 'excluir' as PermissionAction,
      recurso: 'usuarios',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.SUPERVISOR
    },
    {
      id: 'usuarios_manage',
      nome: 'Gerenciar Usuários',
      descricao: 'Controle total sobre usuários',
      categoria: 'usuarios' as PermissionCategory,
      acao: 'gerenciar' as PermissionAction,
      recurso: 'usuarios',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.GERENTE
    },

    // Cadastros
    {
      id: 'cadastros_view',
      nome: 'Visualizar Cadastros',
      descricao: 'Ver cadastros de pessoas físicas e jurídicas',
      categoria: 'cadastros' as PermissionCategory,
      acao: 'visualizar' as PermissionAction,
      recurso: 'cadastros',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.VISUALIZADOR
    },
    {
      id: 'cadastros_create',
      nome: 'Criar Cadastros',
      descricao: 'Criar novos cadastros',
      categoria: 'cadastros' as PermissionCategory,
      acao: 'criar' as PermissionAction,
      recurso: 'cadastros',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.OPERADOR
    },
    {
      id: 'cadastros_edit',
      nome: 'Editar Cadastros',
      descricao: 'Modificar cadastros existentes',
      categoria: 'cadastros' as PermissionCategory,
      acao: 'editar' as PermissionAction,
      recurso: 'cadastros',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.OPERADOR
    },
    {
      id: 'cadastros_delete',
      nome: 'Excluir Cadastros',
      descricao: 'Remover cadastros do sistema',
      categoria: 'cadastros' as PermissionCategory,
      acao: 'excluir' as PermissionAction,
      recurso: 'cadastros',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.SUPERVISOR
    },
    {
      id: 'cadastros_manage',
      nome: 'Gerenciar Cadastros',
      descricao: 'Controle total sobre cadastros',
      categoria: 'cadastros' as PermissionCategory,
      acao: 'gerenciar' as PermissionAction,
      recurso: 'cadastros',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.GERENTE
    },

    // Sistema
    {
      id: 'sistema_config',
      nome: 'Configurar Sistema',
      descricao: 'Acessar configurações do sistema',
      categoria: 'sistema' as PermissionCategory,
      acao: 'gerenciar' as PermissionAction,
      recurso: 'sistema',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.ADMIN
    },
    {
      id: 'sistema_logs',
      nome: 'Visualizar Logs',
      descricao: 'Acessar logs do sistema',
      categoria: 'sistema' as PermissionCategory,
      acao: 'visualizar' as PermissionAction,
      recurso: 'logs',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.GERENTE
    },
    {
      id: 'sistema_backup',
      nome: 'Gerenciar Backups',
      descricao: 'Criar e restaurar backups',
      categoria: 'sistema' as PermissionCategory,
      acao: 'gerenciar' as PermissionAction,
      recurso: 'backup',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.ADMIN
    },

    // Relatórios
    {
      id: 'relatorios_view',
      nome: 'Visualizar Relatórios',
      descricao: 'Acessar relatórios do sistema',
      categoria: 'relatorios' as PermissionCategory,
      acao: 'visualizar' as PermissionAction,
      recurso: 'relatorios',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.VISUALIZADOR
    },
    {
      id: 'relatorios_create',
      nome: 'Criar Relatórios',
      descricao: 'Gerar novos relatórios',
      categoria: 'relatorios' as PermissionCategory,
      acao: 'criar' as PermissionAction,
      recurso: 'relatorios',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.OPERADOR
    },
    {
      id: 'relatorios_export',
      nome: 'Exportar Relatórios',
      descricao: 'Exportar dados em diferentes formatos',
      categoria: 'relatorios' as PermissionCategory,
      acao: 'exportar' as PermissionAction,
      recurso: 'relatorios',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.OPERADOR
    },
    {
      id: 'relatorios_manage',
      nome: 'Gerenciar Relatórios',
      descricao: 'Controle total sobre relatórios',
      categoria: 'relatorios' as PermissionCategory,
      acao: 'gerenciar' as PermissionAction,
      recurso: 'relatorios',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.GERENTE
    },

    // Registros Próprios
    {
      id: 'proprios_view',
      nome: 'Visualizar Próprios',
      descricao: 'Ver apenas registros criados por si',
      categoria: 'proprios' as PermissionCategory,
      acao: 'visualizar' as PermissionAction,
      recurso: 'proprios',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.VISUALIZADOR
    },
    {
      id: 'proprios_edit',
      nome: 'Editar Próprios',
      descricao: 'Modificar apenas registros criados por si',
      categoria: 'proprios' as PermissionCategory,
      acao: 'editar' as PermissionAction,
      recurso: 'proprios',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.OPERADOR
    },
    {
      id: 'proprios_delete',
      nome: 'Excluir Próprios',
      descricao: 'Remover apenas registros criados por si',
      categoria: 'proprios' as PermissionCategory,
      acao: 'excluir' as PermissionAction,
      recurso: 'proprios',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.OPERADOR
    },
    {
      id: 'proprios_manage',
      nome: 'Gerenciar Próprios',
      descricao: 'Controle total sobre registros criados por si',
      categoria: 'proprios' as PermissionCategory,
      acao: 'gerenciar' as PermissionAction,
      recurso: 'proprios',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.OPERADOR
    },

    // Financeiro
    {
      id: 'financeiro_view',
      nome: 'Visualizar Financeiro',
      descricao: 'Ver informações financeiras',
      categoria: 'financeiro' as PermissionCategory,
      acao: 'visualizar' as PermissionAction,
      recurso: 'financeiro',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.GERENTE
    },
    {
      id: 'financeiro_edit',
      nome: 'Editar Financeiro',
      descricao: 'Modificar dados financeiros',
      categoria: 'financeiro' as PermissionCategory,
      acao: 'editar' as PermissionAction,
      recurso: 'financeiro',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.ADMIN
    },
    {
      id: 'financeiro_manage',
      nome: 'Gerenciar Financeiro',
      descricao: 'Controle total sobre finanças',
      categoria: 'financeiro' as PermissionCategory,
      acao: 'gerenciar' as PermissionAction,
      recurso: 'financeiro',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.ADMIN
    },

    // Marketing
    {
      id: 'marketing_view',
      nome: 'Visualizar Marketing',
      descricao: 'Ver campanhas de marketing',
      categoria: 'marketing' as PermissionCategory,
      acao: 'visualizar' as PermissionAction,
      recurso: 'marketing',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.SUPERVISOR
    },
    {
      id: 'marketing_create',
      nome: 'Criar Marketing',
      descricao: 'Criar novas campanhas',
      categoria: 'marketing' as PermissionCategory,
      acao: 'criar' as PermissionAction,
      recurso: 'marketing',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.GERENTE
    },
    {
      id: 'marketing_edit',
      nome: 'Editar Marketing',
      descricao: 'Modificar campanhas existentes',
      categoria: 'marketing' as PermissionCategory,
      acao: 'editar' as PermissionAction,
      recurso: 'marketing',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.GERENTE
    },
    {
      id: 'marketing_manage',
      nome: 'Gerenciar Marketing',
      descricao: 'Controle total sobre marketing',
      categoria: 'marketing' as PermissionCategory,
      acao: 'gerenciar' as PermissionAction,
      recurso: 'marketing',
      ativo: true,
      nivelMinimo: ACCESS_LEVELS.GERENTE
    }
  ]
};

// Função para inicializar o sistema de permissões
export async function initializePermissionsSystem() {
  try {
    console.log('🔄 Inicializando sistema de permissões...');

    // 1. Criar tipos de acesso
    const { data: tiposAcesso, error: tiposError } = await supabase
      .from('tipos_acesso')
      .select('*');

    if (tiposError) {
      console.log('📋 Criando tabela tipos_acesso...');
      // A tabela será criada via SQL
      return { success: false, error: 'Tabela tipos_acesso não existe. Execute o script SQL primeiro.' };
    }

    if (!tiposAcesso || tiposAcesso.length === 0) {
      console.log('📝 Inserindo tipos de acesso padrão...');
      const { error: insertTiposError } = await supabase
        .from('tipos_acesso')
        .insert(PERMISSIONS_CONFIG.DEFAULT_ACCESS_LEVELS);

      if (insertTiposError) {
        console.error('❌ Erro ao inserir tipos de acesso:', insertTiposError);
        return { success: false, error: insertTiposError };
      }
      console.log('✅ Tipos de acesso criados com sucesso!');
    }

    // 2. Criar permissões
    const { data: permissoes, error: permissoesError } = await supabase
      .from('permissoes')
      .select('*');

    if (permissoesError) {
      console.log('📋 Criando tabela permissoes...');
      return { success: false, error: 'Tabela permissoes não existe. Execute o script SQL primeiro.' };
    }

    if (!permissoes || permissoes.length === 0) {
      console.log('📝 Inserindo permissões padrão...');
      const { error: insertPermissoesError } = await supabase
        .from('permissoes')
        .insert(PERMISSIONS_CONFIG.DEFAULT_PERMISSIONS);

      if (insertPermissoesError) {
        console.error('❌ Erro ao inserir permissões:', insertPermissoesError);
        return { success: false, error: insertPermissoesError };
      }
      console.log('✅ Permissões criadas com sucesso!');
    }

    // 3. Criar níveis de acesso
    const { data: niveisAcesso, error: niveisError } = await supabase
      .from('niveis_acesso')
      .select('*');

    if (niveisError) {
      console.log('📋 Criando tabela niveis_acesso...');
      return { success: false, error: 'Tabela niveis_acesso não existe. Execute o script SQL primeiro.' };
    }

    if (!niveisAcesso || niveisAcesso.length === 0) {
      console.log('📝 Criando níveis de acesso padrão...');
      
      // Criar níveis de acesso para cada tipo
      const niveisParaCriar = PERMISSIONS_CONFIG.DEFAULT_ACCESS_LEVELS.map(tipo => {
        const permissoesDoTipo = PERMISSIONS_CONFIG.DEFAULT_PERMISSIONS
          .filter(p => p.nivelMinimo <= tipo.nivel)
          .map(p => p.id);

        return {
          tipo_acesso_id: tipo.id,
          permissoes: permissoesDoTipo,
          ativo: true
        };
      });

      const { error: insertNiveisError } = await supabase
        .from('niveis_acesso')
        .insert(niveisParaCriar);

      if (insertNiveisError) {
        console.error('❌ Erro ao criar níveis de acesso:', insertNiveisError);
        return { success: false, error: insertNiveisError };
      }
      console.log('✅ Níveis de acesso criados com sucesso!');
    }

    console.log('🎉 Sistema de permissões inicializado com sucesso!');
    return { success: true };

  } catch (error) {
    console.error('❌ Erro ao inicializar sistema de permissões:', error);
    return { success: false, error };
  }
}

// Função para obter permissões de um usuário
export async function getUserPermissions(userId: number) {
  try {
    console.log(`🔍 Buscando permissões para usuário ID: ${userId}`);
    
    // Para usuário master (ID 0), retornar todas as permissões
    if (userId === 0) {
      console.log('👑 Usuário master - retornando todas as permissões');
      return PERMISSIONS_CONFIG.DEFAULT_PERMISSIONS.map(p => p.id);
    }

    // Tentar buscar permissões via RPC
    const { data, error } = await supabase
      .rpc('get_user_permissions', { user_id: userId });

    if (error) {
      console.warn('⚠️ Erro ao obter permissões via RPC, usando permissões padrão:', error);
      
      // Fallback: retornar permissões básicas baseadas no nível de acesso
      // Isso evita que o login falhe por problemas de permissões
      return [
        'dashboard_view',
        'usuarios_view',
        'perfis_view',
        'niveis_acesso_view'
      ];
    }

    console.log(`✅ Permissões obtidas para usuário ${userId}:`, data);
    return data || [];
  } catch (error) {
    console.error('❌ Erro ao obter permissões do usuário:', error);
    
    // Fallback: retornar permissões básicas em caso de erro
    return [
      'dashboard_view',
      'usuarios_view',
      'perfis_view',
      'niveis_acesso_view'
    ];
  }
}

// Função para verificar se usuário tem permissão específica
export async function hasUserPermission(userId: number, permissionId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('has_user_permission', { 
        user_id: userId, 
        permission_id: permissionId 
      });

    if (error) {
      console.error('Erro ao verificar permissão:', error);
      return false;
    }

    return data || false;
  } catch (error) {
    console.error('Erro ao verificar permissão:', error);
    return false;
  }
}

// Função para verificar permissão por categoria e ação
export async function hasUserPermissionAction(
  userId: number, 
  categoria: string, 
  acao: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('has_user_permission_action', { 
        user_id: userId, 
        categoria_param: categoria, 
        acao_param: acao 
      });

    if (error) {
      console.error('Erro ao verificar permissão por ação:', error);
      return false;
    }

    return data || false;
  } catch (error) {
    console.error('Erro ao verificar permissão por ação:', error);
    return false;
  }
}
