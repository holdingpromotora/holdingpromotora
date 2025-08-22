import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Buscando usuários aprovados...');

    // Buscar usuários aprovados e ativos
    const { data: usuarios, error } = await supabase
      .from('usuarios')
      .select(
        `
        id,
        nome,
        email,
        tipo_acesso_id,
        perfil_nome,
        aprovado,
        ativo,
        data_cadastro,
        data_aprovacao,
        tipos_acesso!inner(
          id,
          nome,
          nivel,
          descricao
        )
      `
      )
      .eq('aprovado', true)
      .eq('ativo', true)
      .order('nome');

    if (error) {
      console.error('❌ Erro ao buscar usuários:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar usuários aprovados' },
        { status: 500 }
      );
    }

    console.log(`✅ ${usuarios.length} usuários aprovados encontrados`);

    return NextResponse.json({
      success: true,
      usuarios: usuarios || [],
    });
  } catch (error) {
    console.error('❌ Erro na API de usuários aprovados:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
