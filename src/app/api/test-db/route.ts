import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Testar conexão com banco e verificar tabelas
export async function GET() {
  try {
    // Testar conexão básica
    const { data: testData, error: testError } = await supabase
      .from('tipos_acesso')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Erro ao conectar com banco:', testError);
      return NextResponse.json(
        {
          error: 'Erro de conexão com banco',
          details: testError.message,
          code: testError.code,
          hint: 'Verifique se a tabela tipos_acesso foi criada executando o arquivo SQL',
        },
        { status: 500 }
      );
    }

    // Verificar se a tabela existe e tem dados
    const { data: countData, error: countError } = await supabase
      .from('tipos_acesso')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      return NextResponse.json(
        {
          error: 'Erro ao contar registros',
          details: countError.message,
          code: countError.code,
        },
        { status: 500 }
      );
    }

    // Tentar inserir um registro de teste
    const { data: insertData, error: insertError } = await supabase
      .from('tipos_acesso')
      .insert([
        {
          nome: 'Teste',
          descricao: 'Tipo de acesso para teste',
          nivel: 8, // Deve estar entre 1 e 10
          cor: 'bg-gray-600',
          icone: 'Test',
          ativo: true,
        },
      ])
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({
        success: false,
        message: 'Conexão com banco OK, mas erro ao inserir',
        tableExists: true,
        recordCount: countData?.length || 0,
        insertError: {
          message: insertError.message,
          code: insertError.code,
          details: insertError.details,
        },
      });
    }

    // Se inseriu com sucesso, remover o registro de teste
    await supabase.from('tipos_acesso').delete().eq('id', insertData.id);

    return NextResponse.json({
      success: true,
      message: 'Conexão com banco OK e inserção funcionando',
      tableExists: true,
      recordCount: countData?.length || 0,
      insertTest: 'OK',
    });
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
