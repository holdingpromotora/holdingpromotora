import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🔍 Testando conexão com banco de dados...');

    // Teste 1: Verificar se a tabela pessoas_fisicas existe
    console.log('📋 Testando tabela pessoas_fisicas...');
    const { data: pfTest, error: pfError } = await supabase
      .from('pessoas_fisicas')
      .select('count')
      .limit(1);

    if (pfError) {
      console.error('❌ Erro na tabela pessoas_fisicas:', pfError);
      return NextResponse.json(
        {
          success: false,
          error: 'Erro na tabela pessoas_fisicas',
          details: pfError,
        },
        { status: 500 }
      );
    }

    // Teste 2: Verificar se a tabela pessoas_juridicas existe
    console.log('📋 Testando tabela pessoas_juridicas...');
    const { data: pjTest, error: pjError } = await supabase
      .from('pessoas_juridicas')
      .select('count')
      .limit(1);

    if (pjError) {
      console.error('❌ Erro na tabela pessoas_juridicas:', pjError);
      return NextResponse.json(
        {
          success: false,
          error: 'Erro na tabela pessoas_juridicas',
          details: pjError,
        },
        { status: 500 }
      );
    }

    // Teste 3: Buscar dados reais das tabelas
    console.log('🔍 Buscando dados das tabelas...');

    const { data: pfData, error: pfDataError } = await supabase
      .from('pessoas_fisicas')
      .select(
        'id, nome, cpf, email, telefone, endereco, cidade, estado, ativo, created_at'
      )
      .eq('ativo', true)
      .limit(5);

    if (pfDataError) {
      console.error('❌ Erro ao buscar dados PF:', pfDataError);
      return NextResponse.json(
        {
          success: false,
          error: 'Erro ao buscar dados PF',
          details: pfDataError,
        },
        { status: 500 }
      );
    }

    const { data: pjData, error: pjDataError } = await supabase
      .from('pessoas_juridicas')
      .select(
        'id, razao_social, cnpj, proprietario_email, proprietario_telefone, endereco, cidade, estado, ativo, created_at'
      )
      .eq('ativo', true)
      .limit(5);

    if (pjDataError) {
      console.error('❌ Erro ao buscar dados PJ:', pjDataError);
      return NextResponse.json(
        {
          success: false,
          error: 'Erro ao buscar dados PJ',
          details: pjDataError,
        },
        { status: 500 }
      );
    }

    console.log('✅ Conexão e consultas funcionando!');
    console.log(`📊 PF encontrados: ${pfData?.length || 0}`);
    console.log(`📊 PJ encontrados: ${pjData?.length || 0}`);

    return NextResponse.json({
      success: true,
      message: 'Conexão com banco funcionando perfeitamente!',
      data: {
        pessoas_fisicas: {
          count: pfData?.length || 0,
          sample: pfData?.slice(0, 2) || [],
        },
        pessoas_juridicas: {
          count: pjData?.length || 0,
          sample: pjData?.slice(0, 2) || [],
        },
      },
    });
  } catch (error) {
    console.error('❌ Erro geral no teste:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
