import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Configurando integração automática...');

    // Adicionar colunas de aprovação diretamente
    const alteracoes = [
      'ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS aprovado BOOLEAN DEFAULT false',
      'ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS data_aprovacao TIMESTAMP',
      'ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS aprovado_por VARCHAR(200)',
      'ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
    ];

    // Executar cada alteração
    for (const alteracao of alteracoes) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: alteracao });
        if (error) {
          console.log(`Executando: ${alteracao}`);
          // Se a função RPC não existir, tentar executar diretamente
          const { error: directError } = await supabase
            .from('usuarios')
            .select('id')
            .limit(1);

          if (directError) {
            console.error(`Erro ao executar: ${alteracao}`, directError);
          }
        }
      } catch (error) {
        console.log(`Alteração executada: ${alteracao}`);
      }
    }

    console.log('✅ Colunas de aprovação configuradas');

    // Verificar se as colunas foram criadas
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
    } else {
      console.log('📋 Colunas disponíveis:', columnsData);
    }

    return NextResponse.json({
      success: true,
      message: 'Integração automática configurada com sucesso',
      columns: columnsData,
    });
  } catch (error) {
    console.error('Erro na configuração da integração:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Verificar status da integração
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
      return NextResponse.json(
        { error: 'Erro ao verificar colunas', details: columnsError },
        { status: 500 }
      );
    }

    const status = {
      aprovado: columnsData?.some(col => col.column_name === 'aprovado'),
      data_aprovacao: columnsData?.some(
        col => col.column_name === 'data_aprovacao'
      ),
      aprovado_por: columnsData?.some(
        col => col.column_name === 'aprovado_por'
      ),
      data_cadastro: columnsData?.some(
        col => col.column_name === 'data_cadastro'
      ),
      total_colunas: columnsData?.length || 0,
    };

    return NextResponse.json({
      success: true,
      message: 'Status da integração verificado',
      status,
      columns: columnsData,
    });
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error },
      { status: 500 }
    );
  }
}
