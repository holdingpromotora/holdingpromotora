import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Buscar todos os tipos de acesso
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tipos_acesso')
      .select('*')
      .order('nivel', { ascending: true });

    if (error) {
      console.error('Erro ao buscar tipos de acesso:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar tipos de acesso' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro inesperado:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Criar novo tipo de acesso
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, descricao, nivel } = body;

    // Validar dados obrigatórios
    if (!nome || !nivel) {
      return NextResponse.json(
        { error: 'Nome e nível são obrigatórios' },
        { status: 400 }
      );
    }

    // Nota: Nível pode ser duplicado - múltiplos tipos podem ter a mesma prioridade

    // Verificar se o nome já existe
    const { data: nomeExistente, error: nomeCheckError } = await supabase
      .from('tipos_acesso')
      .select('id, nivel')
      .eq('nome', nome)
      .single();

    if (nomeCheckError && nomeCheckError.code !== 'PGRST116') {
      console.error('Erro ao verificar nome existente:', nomeCheckError);
      return NextResponse.json(
        { error: 'Erro ao verificar nome existente' },
        { status: 500 }
      );
    }

    if (nomeExistente) {
      return NextResponse.json(
        {
          error: 'Nome já existe',
          details: `O nome "${nome}" já está sendo usado pelo nível ${nomeExistente.nivel}`,
          code: 'DUPLICATE_NAME',
        },
        { status: 409 }
      );
    }

    // Inserir novo tipo de acesso
    const { data: novoTipo, error: insertError } = await supabase
      .from('tipos_acesso')
      .insert([
        {
          nome,
          descricao: descricao || '',
          nivel,
          ativo: true,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Erro ao inserir tipo de acesso:', insertError);
      return NextResponse.json(
        {
          error: 'Erro ao criar tipo de acesso',
          details: insertError.message,
          code: insertError.code,
        },
        { status: 500 }
      );
    }

    console.log(
      `✅ Tipo de acesso "${nome}" criado com sucesso (nível ${nivel})`
    );
    return NextResponse.json(novoTipo, { status: 201 });
  } catch (error) {
    console.error('Erro inesperado:', error);
    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
