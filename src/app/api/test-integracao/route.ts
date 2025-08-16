import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🧪 Testando integração...');

    // 1. Verificar se a tabela usuarios tem as colunas necessárias
    const { data: columnsData, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', 'usuarios')
      .in('column_name', [
        'aprovado',
        'data_aprovacao',
        'aprovado_por',
        'data_cadastro',
      ]);

    if (columnsError) {
      console.error('Erro ao verificar colunas:', columnsError);
      return NextResponse.json(
        {
          success: false,
          error: 'Erro ao verificar colunas',
          details: columnsError,
        },
        { status: 500 }
      );
    }

    console.log('📋 Colunas encontradas:', columnsData);

    // 2. Verificar se a função RPC existe
    let rpcResult = null;
    let rpcError = null;

    try {
      const { data, error } = await supabase.rpc(
        'verificar_aprovacoes_pendentes'
      );
      rpcResult = data;
      rpcError = error;
    } catch (error) {
      rpcError = error;
    }

    // 3. Verificar dados diretos da tabela usuarios
    const { data: usuariosData, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    // 4. Verificar pessoas jurídicas pendentes
    const { data: pjData, error: pjError } = await supabase
      .from('pessoas_juridicas')
      .select('*')
      .limit(5);

    // 5. Verificar pessoas físicas
    const { data: pfData, error: pfError } = await supabase
      .from('pessoas_fisicas')
      .select('*')
      .limit(5);

    return NextResponse.json({
      success: true,
      message: 'Teste de integração executado',
      data: {
        colunas: columnsData,
        rpc: {
          resultado: rpcResult,
          erro: rpcError,
        },
        usuarios: usuariosData,
        pessoas_juridicas: pjData,
        pessoas_fisicas: pfData,
        erros: {
          usuarios: usuariosError,
          pj: pjError,
          pf: pfError,
        },
      },
    });
  } catch (error) {
    console.error('Erro no teste de integração:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        details: error,
      },
      { status: 500 }
    );
  }
}
