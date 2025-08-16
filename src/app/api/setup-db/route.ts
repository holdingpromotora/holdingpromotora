import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST - Executar setup do banco de dados
export async function POST() {
  try {
    console.log('🚀 Iniciando setup do banco de dados...');

    // Verificar se a tabela existe (simplificado)
    try {
      await supabase.from('tipos_acesso').select('id').limit(1);
    } catch (error) {
      console.error('❌ Tabela tipos_acesso não existe:', error);
      return NextResponse.json(
        {
          error: 'Tabela tipos_acesso não existe',
          details: 'Execute primeiro o arquivo SQL no Supabase',
          hint: 'Copie e execute o conteúdo de src/lib/niveis_acesso_perfis.sql no SQL Editor do Supabase',
        },
        { status: 500 }
      );
    }

    // 2. Inserir dados padrão (um por vez para evitar problemas)
    const tiposPadrao = [
      {
        nome: 'Master',
        descricao: 'Acesso total ao sistema',
        nivel: 1,
        cor: 'bg-red-600',
        icone: 'Crown',
      },
      {
        nome: 'Submaster',
        descricao: 'Acesso administrativo limitado',
        nivel: 2,
        cor: 'bg-purple-600',
        icone: 'Shield',
      },
      {
        nome: 'Parceiro',
        descricao: 'Acesso a funcionalidades específicas',
        nivel: 3,
        cor: 'bg-blue-600',
        icone: 'Building',
      },
      {
        nome: 'Colaborador',
        descricao: 'Acesso básico ao sistema',
        nivel: 4,
        cor: 'bg-green-600',
        icone: 'UserCheck',
      },
      {
        nome: 'Operador',
        descricao: 'Acesso operacional',
        nivel: 5,
        cor: 'bg-amber-600',
        icone: 'User',
      },
      {
        nome: 'Visualizador',
        descricao: 'Apenas visualização',
        nivel: 6,
        cor: 'bg-gray-600',
        icone: 'Eye',
      },
      {
        nome: 'Convidado',
        descricao: 'Acesso limitado',
        nivel: 7,
        cor: 'bg-indigo-600',
        icone: 'EyeOff',
      },
    ];

    let inseridosComSucesso = 0;
    for (const tipo of tiposPadrao) {
      const { error: insertError } = await supabase
        .from('tipos_acesso')
        .insert([tipo]);

      if (insertError) {
        console.error(`❌ Erro ao inserir ${tipo.nome}:`, insertError);
        // Continuar com os próximos mesmo se houver erro
      } else {
        inseridosComSucesso++;
      }
    }

    if (inseridosComSucesso === 0) {
      console.error('❌ Nenhum tipo de acesso foi inserido');
      return NextResponse.json(
        {
          error: 'Erro ao inserir dados padrão',
          details: 'Nenhum registro foi inserido',
        },
        { status: 500 }
      );
    }

    console.log('✅ Setup do banco concluído com sucesso!');

    return NextResponse.json({
      success: true,
      message: 'Banco de dados configurado com sucesso',
      tablesCreated: ['tipos_acesso'],
      recordsInserted: inseridosComSucesso,
    });
  } catch (error) {
    console.error('❌ Erro inesperado no setup:', error);
    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
