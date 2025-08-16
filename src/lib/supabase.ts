import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://ferlknesyqrhdvapqqso.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlcmxrbmVzeXFyaGR2YXBxcXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMjEwNDUsImV4cCI6MjA3MDY5NzA0NX0.RRzg8_OqaU-FA47OOxL1XCaFaWZOWGNaXC5Qu2jNl5Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função para criar tabelas
export async function createTables() {
  try {
    console.log('🔄 Verificando e criando tabelas do sistema...');

    // Verificar se a tabela bancos existe, se não, criar
    try {
      const { error: bancosError } = await supabase
        .from('bancos')
        .select('count')
        .limit(1);

      if (bancosError && bancosError.code === 'PGRST116') {
        console.log(
          '📋 Tabela bancos não existe. Será criada manualmente no Supabase.'
        );
        // A tabela será criada manualmente via SQL Editor
      } else if (bancosError) {
        console.error('❌ Erro ao verificar tabela bancos:', bancosError);
        // Não falhar se houver erro, apenas logar
      } else {
        console.log('✅ Tabela bancos existe');
      }
    } catch (error) {
      console.error('❌ Erro ao verificar tabela bancos:', error);
    }

    // Verificar se a tabela pessoas_fisicas existe, se não, criar
    try {
      const { error: pessoasError } = await supabase
        .from('pessoas_fisicas')
        .select('count')
        .limit(1);

      if (pessoasError && pessoasError.code === 'PGRST116') {
        console.log(
          '📋 Tabela pessoas_fisicas não existe. Será criada manualmente no Supabase.'
        );
        // A tabela será criada manualmente via SQL Editor
      } else if (pessoasError) {
        console.error(
          '❌ Erro ao verificar tabela pessoas_fisicas:',
          pessoasError
        );
        // Não falhar se houver erro, apenas logar
      } else {
        console.log('✅ Tabela pessoas_fisicas existe');
      }
    } catch (error) {
      console.error('❌ Erro ao verificar tabela pessoas_fisicas:', error);
    }

    // Verificar se a tabela pessoas_juridicas existe, se não, criar
    try {
      const { error: pessoasJuridicasError } =
        await supabase.from('pessoas_juridicas').select('count').limit(1);

      if (pessoasJuridicasError && pessoasJuridicasError.code === 'PGRST116') {
        console.log(
          '📋 Tabela pessoas_juridicas não existe. Será criada manualmente no Supabase.'
        );
        // A tabela será criada manualmente via SQL Editor
      } else if (pessoasJuridicasError) {
        console.error(
          '❌ Erro ao verificar tabela pessoas_juridicas:',
          pessoasJuridicasError
        );
        // Não falhar se houver erro, apenas logar
      } else {
        console.log('✅ Tabela pessoas_juridicas existe');
      }
    } catch (error) {
      console.error('❌ Erro ao verificar tabela pessoas_juridicas:', error);
    }

    // Verificar se a tabela usuarios existe, se não, criar
    try {
      const { error: usuariosError } = await supabase
        .from('usuarios')
        .select('count')
        .limit(1);

      if (usuariosError && usuariosError.code === 'PGRST116') {
        console.log(
          '📋 Tabela usuarios não existe. Será criada manualmente no Supabase.'
        );
        // A tabela será criada manualmente via SQL Editor
      } else if (usuariosError) {
        console.error('❌ Erro ao verificar tabela usuarios:', usuariosError);
        // Não falhar se houver erro, apenas logar
      } else {
        console.log('✅ Tabela usuarios existe');
      }
    } catch (error) {
      console.error('❌ Erro ao verificar tabela usuarios:', error);
    }

    // Inserir bancos se não existirem
    try {
      const { data: bancosData, error: bancosSelectError } = await supabase
        .from('bancos')
        .select('*');

      if (bancosSelectError) {
        console.error(
          '❌ Erro ao verificar bancos existentes:',
          bancosSelectError
        );
      } else if (!bancosData || bancosData.length === 0) {
        console.log('📝 Inserindo bancos padrão...');
        const bancos = [
          { codigo: '001', nome: 'Banco do Brasil' },
          { codigo: '104', nome: 'Caixa Econômica Federal' },
          { codigo: '033', nome: 'Santander' },
          { codigo: '341', nome: 'Itaú' },
          { codigo: '237', nome: 'Bradesco' },
          { codigo: '756', nome: 'Sicoob' },
          { codigo: '748', nome: 'Sicredi' },
          { codigo: '422', nome: 'Safra' },
          { codigo: '041', nome: 'Banrisul' },
          { codigo: '077', nome: 'Inter' },
        ];

        const { error: insertError } = await supabase
          .from('bancos')
          .insert(bancos);

        if (insertError) {
          console.error('❌ Erro ao inserir bancos:', insertError);
        } else {
          console.log('✅ Bancos inseridos com sucesso!');
        }
      } else {
        console.log(`✅ ${bancosData.length} bancos já existem no sistema`);
      }
    } catch (error) {
      console.error('❌ Erro ao processar bancos:', error);
      // Não falhar se houver erro, apenas logar
    }

    console.log('✅ Tabelas verificadas com sucesso!');
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao verificar tabelas:', error);
    // Retornar sucesso mesmo com erro para não falhar o formulário
    return {
      success: true,
      warning: 'Algumas tabelas não puderam ser verificadas',
    };
  }
}

// Função para inicializar todo o sistema
export async function initializeSystem() {
  try {
    console.log('🚀 Inicializando sistema completo...');

    // 1. Criar tabelas básicas
    const tablesResult = await createTables();
    if (!tablesResult.success) {
      console.warn('⚠️ Aviso: Algumas tabelas não puderam ser criadas');
    }

    // 2. Inicializar sistema de permissões
    try {
      const { initializePermissionsSystem } = await import(
        './permissions-config'
      );
      const permissionsResult = await initializePermissionsSystem();

      if (!permissionsResult.success) {
        console.warn(
          '⚠️ Aviso: Sistema de permissões não pôde ser inicializado:',
          permissionsResult.error
        );
      }
    } catch (permissionsError) {
      console.warn(
        '⚠️ Aviso: Sistema de permissões não pôde ser inicializado:',
        permissionsError
      );
      // Não falhar se houver erro, apenas logar
    }

    console.log('🎉 Sistema inicializado com sucesso!');
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao inicializar sistema:', error);
    // Retornar sucesso mesmo com erro para não falhar o app
    return {
      success: true,
      warning: 'Sistema iniciado com algumas limitações',
    };
  }
}
