import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🔍 Verificando estrutura das tabelas...');

    // Verificar estrutura da tabela pessoas_fisicas
    console.log('📋 Verificando pessoas_fisicas...');
    const { data: pfStructure, error: pfStructureError } = await supabase
      .from('pessoas_fisicas')
      .select('*')
      .limit(1);

    if (pfStructureError) {
      console.error('❌ Erro ao verificar estrutura PF:', pfStructureError);
      return NextResponse.json(
        {
          success: false,
          error: 'Erro na tabela pessoas_fisicas',
          details: pfStructureError,
          table: 'pessoas_fisicas',
        },
        { status: 500 }
      );
    }

    // Verificar estrutura da tabela pessoas_juridicas
    console.log('📋 Verificando pessoas_juridicas...');
    const { data: pjStructure, error: pjStructureError } = await supabase
      .from('pessoas_juridicas')
      .select('*')
      .limit(1);

    if (pjStructureError) {
      console.error('❌ Erro ao verificar estrutura PJ:', pjStructureError);
      return NextResponse.json(
        {
          success: false,
          error: 'Erro na tabela pessoas_juridicas',
          details: pjStructureError,
          table: 'pessoas_juridicas',
        },
        { status: 500 }
      );
    }

    // Verificar se há dados nas tabelas
    console.log('🔍 Verificando dados nas tabelas...');

    const { count: pfCount, error: pfCountError } = await supabase
      .from('pessoas_fisicas')
      .select('*', { count: 'exact', head: true });

    if (pfCountError) {
      console.error('❌ Erro ao contar PF:', pfCountError);
    }

    const { count: pjCount, error: pjCountError } = await supabase
      .from('pessoas_juridicas')
      .select('*', { count: 'exact', head: true });

    if (pjCountError) {
      console.error('❌ Erro ao contar PJ:', pjCountError);
    }

    // Verificar campos específicos
    console.log('🔍 Verificando campos específicos...');

    const { data: pfSample, error: pfSampleError } = await supabase
      .from('pessoas_fisicas')
      .select(
        'id, nome, cpf, email, telefone, endereco, cidade, estado, ativo, created_at'
      )
      .limit(1);

    const { data: pjSample, error: pjSampleError } = await supabase
      .from('pessoas_juridicas')
      .select(
        'id, razao_social, cnpj, proprietario_email, proprietario_telefone, endereco, cidade, estado, ativo, created_at'
      )
      .limit(1);

    console.log('✅ Estrutura das tabelas verificada!');
    console.log(`📊 PF encontrados: ${pfCount || 0}`);
    console.log(`📊 PJ encontrados: ${pjCount || 0}`);

    return NextResponse.json({
      success: true,
      message: 'Estrutura das tabelas verificada com sucesso!',
      data: {
        pessoas_fisicas: {
          count: pfCount || 0,
          structure: pfStructure?.length > 0 ? Object.keys(pfStructure[0]) : [],
          sample: pfSample?.[0] || null,
          error: pfStructureError || pfCountError || pfSampleError,
        },
        pessoas_juridicas: {
          count: pjCount || 0,
          structure: pjStructure?.length > 0 ? Object.keys(pjStructure[0]) : [],
          sample: pjSample?.[0] || null,
          error: pjStructureError || pjCountError || pjSampleError,
        },
      },
    });
  } catch (error) {
    console.error('❌ Erro geral na verificação:', error);
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
