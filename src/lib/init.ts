import { initializeSystem } from './supabase';

// Função para inicializar o sistema quando o app iniciar
export async function initializeApp() {
  try {
    console.log('🚀 Iniciando aplicação Holding Promotora...');

    // Inicializar sistema (tabelas e permissões)
    const result = await initializeSystem();

    if (result.success) {
      console.log('✅ Sistema inicializado com sucesso!');
    } else {
      console.warn(
        '⚠️ Sistema não pôde ser inicializado completamente:',
        result.warning || 'Erro desconhecido'
      );
      // Não falhar se houver erro, apenas logar
    }

    return result;
  } catch (error) {
    console.error('❌ Erro ao inicializar aplicação:', error);
    // Retornar sucesso mesmo com erro para não falhar o app
    return {
      success: true,
      warning: 'Aplicação iniciada com algumas limitações',
    };
  }
}

// Função para verificar status do sistema
export async function checkSystemStatus() {
  try {
    console.log('🔍 Verificando status do sistema...');

    // Verificar conexão com Supabase
    const supabaseModule = await import('./supabase');
    const { error } = await supabaseModule.supabase
      .from('tipos_acesso')
      .select('count')
      .limit(1);

    if (error) {
      console.warn(
        '⚠️ Sistema de permissões não está disponível:',
        error.message
      );
      return {
        status: 'warning',
        message: 'Sistema de permissões não está disponível',
        error: error.message,
      };
    }

    console.log('✅ Sistema está funcionando normalmente');
    return {
      status: 'success',
      message: 'Sistema funcionando normalmente',
    };
  } catch (error) {
    console.error('❌ Erro ao verificar status do sistema:', error);
    return {
      status: 'error',
      message: 'Erro ao verificar sistema',
      error: error,
    };
  }
}

// Função para limpar cache e reinicializar
export async function resetSystem() {
  try {
    console.log('🔄 Reinicializando sistema...');

    // Limpar localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('holding_user');
      console.log('🗑️ Cache limpo');
    }

    // Reinicializar sistema
    const result = await initializeSystem();

    if (result.success) {
      console.log('✅ Sistema reinicializado com sucesso!');
    } else {
      console.warn(
        '⚠️ Sistema não pôde ser reinicializado:',
        result.warning || 'Erro desconhecido'
      );
    }

    return result;
  } catch (error) {
    console.error('❌ Erro ao reinicializar sistema:', error);
    return { success: false, error };
  }
}
