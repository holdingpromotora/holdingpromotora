import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Iniciando setup das permissões...');

    // Verificar se a tabela já existe
    const { data: existingData, error: checkError } = await supabase
      .from('permissoes')
      .select('*')
      .limit(1);

    if (checkError && checkError.code === 'PGRST116') {
      console.log('📋 Tabela permissoes não existe, criando...');
      
      // Como não podemos executar DDL diretamente via Supabase client,
      // vamos criar uma estrutura básica usando uma abordagem diferente
      
      // Tentar inserir dados básicos (isso pode falhar se a tabela não existir)
      const { error: insertError } = await supabase
        .from('permissoes')
        .insert([
          {
            id: 'dashboard_view',
            nome: 'Visualizar Dashboard',
            descricao: 'Acesso ao painel principal',
            categoria: 'dashboard',
            acao: 'visualizar',
            recurso: 'dashboard',
            ativo: true
          }
        ]);

      if (insertError) {
        console.log('⚠️ Não foi possível criar a tabela via API. Execute o script SQL manualmente.');
        return NextResponse.json({ 
          success: false, 
          message: 'Tabela de permissões não existe. Execute o script SQL manualmente no Supabase.',
          instructions: [
            '1. Acesse o painel do Supabase',
            '2. Vá para SQL Editor',
            '3. Execute o arquivo: src/lib/permissoes.sql',
            '4. Ou execute o comando: npm run setup-db'
          ]
        });
      }
    } else if (checkError) {
      throw new Error(`Erro ao verificar tabela: ${checkError.message}`);
    } else {
      console.log('✅ Tabela permissoes já existe');
    }

    console.log('✅ Setup das permissões concluído com sucesso!');

    return NextResponse.json({ 
      success: true, 
      message: 'Sistema de permissões verificado com sucesso!' 
    });

  } catch (error) {
    console.error('❌ Erro no setup das permissões:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      },
      { status: 500 }
    );
  }
}
