import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { tipo_acesso_id } = await request.json();

    if (!tipo_acesso_id) {
      return NextResponse.json(
        { error: 'ID do tipo de acesso é obrigatório' },
        { status: 400 }
      );
    }

    console.log(`🔍 Verificando permissões para tipo de acesso ID: ${tipo_acesso_id}`);

    // Buscar permissões do tipo de acesso através da função SQL
    const { data: permissoes, error } = await supabase.rpc(
      'get_tipo_acesso_permissions',
      {
        tipo_acesso_id: parseInt(tipo_acesso_id),
      }
    );

    if (error) {
      console.error('❌ Erro ao buscar permissões do tipo de acesso:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar permissões do tipo de acesso' },
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
      `✅ Permissões encontradas para tipo de acesso ${tipo_acesso_id}:`,
      permissoesOrganizadas
    );

    return NextResponse.json({
      success: true,
      permissoes: permissoesOrganizadas,
      total: permissoes.length,
    });
  } catch (error) {
    console.error('❌ Erro na API de permissões do tipo de acesso:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
