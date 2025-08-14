import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ferlknesyqrhdvapqqso.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlcmxrbmVzeXFyaGR2YXBxcXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMjEwNDUsImV4cCI6MjA3MDY5NzA0NX0.RRzg8_OqaU-FA47OOxL1XCaFaWZOWGNaXC5Qu2jNl5Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função para criar tabelas
export async function createTables() {
  try {
    // Verificar se a tabela bancos existe, se não, criar
    const { data: bancosExistentes, error: bancosError } = await supabase
      .from('bancos')
      .select('count')
      .limit(1);

    if (bancosError && bancosError.code === 'PGRST116') {
      console.log(
        'Tabela bancos não existe. Será criada manualmente no Supabase.'
      );
      // A tabela será criada manualmente via SQL Editor
    }

    // Verificar se a tabela pessoas_fisicas existe, se não, criar
    const { data: pessoasExistentes, error: pessoasError } = await supabase
      .from('pessoas_fisicas')
      .select('count')
      .limit(1);

    if (pessoasError && pessoasError.code === 'PGRST116') {
      console.log(
        'Tabela pessoas_fisicas não existe. Será criada manualmente no Supabase.'
      );
      // A tabela será criada manualmente via SQL Editor
    }

    // Verificar se a tabela pessoas_juridicas existe, se não, criar
    const { data: pessoasJuridicasExistentes, error: pessoasJuridicasError } =
      await supabase.from('pessoas_juridicas').select('count').limit(1);

    if (pessoasJuridicasError && pessoasJuridicasError.code === 'PGRST116') {
      console.log(
        'Tabela pessoas_juridicas não existe. Será criada manualmente no Supabase.'
      );
      // A tabela será criada manualmente via SQL Editor
    }

    // Inserir bancos se não existirem
    const { data: bancosData, error: bancosInsertError } = await supabase
      .from('bancos')
      .select('*');

    if (!bancosData || bancosData.length === 0) {
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
        console.error('Erro ao inserir bancos:', insertError);
      } else {
        console.log('Bancos inseridos com sucesso!');
      }
    }

    console.log('Tabelas verificadas com sucesso!');
    return { success: true };
  } catch (error) {
    console.error('Erro ao verificar tabelas:', error);
    return { success: false, error };
  }
}
