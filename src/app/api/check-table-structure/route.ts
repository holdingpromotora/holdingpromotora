import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🔄 Verificando estrutura da tabela usuarios...');

    // Verificar se a tabela existe e sua estrutura
    const { data: tableInfo, error: tableError } = await supabase
      .from('usuarios')
      .select('*')
      .limit(0);

    if (tableError) {
      console.error('❌ Erro ao verificar tabela usuarios:', tableError);
      return NextResponse.json(
        {
          success: false,
          error: tableError.message,
          details: tableError,
        },
        { status: 500 }
      );
    }

    // Tentar buscar um usuário específico para ver a estrutura
    const { data: sampleUser, error: sampleError } = await supabase
      .from('usuarios')
      .select('*')
      .limit(1);

    if (sampleError) {
      console.error('❌ Erro ao buscar usuário de exemplo:', sampleError);
      return NextResponse.json(
        {
          success: false,
          error: sampleError.message,
          details: sampleError,
        },
        { status: 500 }
      );
    }

    // Verificar se as colunas necessárias existem
    const requiredColumns = [
      'id',
      'nome',
      'email',
      'tipo_acesso_id',
      'perfil_nome',
      'ativo',
    ];
    const availableColumns =
      sampleUser && sampleUser.length > 0 ? Object.keys(sampleUser[0]) : [];

    const missingColumns = requiredColumns.filter(
      col => !availableColumns.includes(col)
    );

    console.log('📊 Colunas disponíveis:', availableColumns);
    console.log('❌ Colunas faltando:', missingColumns);

    return NextResponse.json({
      success: true,
      message: 'Estrutura da tabela verificada',
      tableExists: true,
      availableColumns,
      missingColumns,
      sampleUser: sampleUser?.[0] || null,
      requiredColumns,
    });
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro inesperado ao verificar estrutura da tabela',
        details: error,
      },
      { status: 500 }
    );
  }
}
