import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { user_id } = await request.json();

    if (!user_id) {
      return NextResponse.json(
        { error: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    console.log(`🔍 Verificando permissões para usuário ID: ${user_id}`);

    // Buscar permissões do usuário através da função SQL
    const { data: permissoes, error } = await supabase.rpc(
      'get_user_permissions',
      {
        user_id: user_id,
      }
    );

    if (error) {
      console.error('❌ Erro ao buscar permissões:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar permissões do usuário' },
        { status: 500 }
      );
    }

    // Organizar permissões por categoria
    const permissoesOrganizadas = permissoes.reduce(
      (acc: any, permissao: any) => {
        if (!acc[permissao.categoria]) {
          acc[permissao.categoria] = [];
        }
        acc[permissao.categoria].push({
          id: permissao.permissao_id,
          nome: permissao.nome,
          descricao: permissao.descricao,
          acao: permissao.acao,
          recurso: permissao.recurso,
        });
        return acc;
      },
      {}
    );

    console.log(
      `✅ Permissões encontradas para usuário ${user_id}:`,
      permissoesOrganizadas
    );

    return NextResponse.json({
      success: true,
      permissoes: permissoesOrganizadas,
      total: permissoes.length,
    });
  } catch (error) {
    console.error('❌ Erro na API de permissões:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
