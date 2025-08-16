import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST - Inserir dados padrão
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Iniciando inserção de dados padrão...');

    // Dados padrão para tipos de acesso
    const tiposPadrao = [
      {
        nome: 'Master',
        descricao: 'Acesso total ao sistema',
        nivel: 1,
        cor: 'bg-red-600',
        icone: 'Crown',
      },
      {
        nome: 'Administrador',
        descricao: 'Acesso administrativo completo',
        nivel: 2,
        cor: 'bg-blue-600',
        icone: 'Shield',
      },
      {
        nome: 'Gerente',
        descricao: 'Acesso gerencial',
        nivel: 3,
        cor: 'bg-green-600',
        icone: 'UserCheck',
      },
      {
        nome: 'Supervisor',
        descricao: 'Acesso de supervisão',
        nivel: 4,
        cor: 'bg-yellow-600',
        icone: 'Eye',
      },
      {
        nome: 'Colaborador',
        descricao: 'Acesso básico de colaborador',
        nivel: 5,
        cor: 'bg-purple-600',
        icone: 'Users',
      },
      {
        nome: 'Visitante',
        descricao: 'Acesso limitado de visitante',
        nivel: 6,
        cor: 'bg-gray-600',
        icone: 'User',
      },
      {
        nome: 'Convidado',
        descricao: 'Acesso mínimo de convidado',
        nivel: 7,
        cor: 'bg-orange-600',
        icone: 'UserPlus',
      },
    ];

    let inseridosComSucesso = 0;
    const dadosInseridos = [];

    // Inserir um por vez para evitar problemas de constraint
    for (const tipo of tiposPadrao) {
      try {
        console.log(`📝 Tentando inserir: ${tipo.nome} (nível ${tipo.nivel})`);

        const { data: insertedData, error: insertError } = await supabase
          .from('tipos_acesso')
          .insert([tipo])
          .select()
          .single();

        if (insertError) {
          console.error(`❌ Erro ao inserir ${tipo.nome}:`, insertError);
          continue; // Continuar com o próximo
        }

        console.log(`✅ ${tipo.nome} inserido com sucesso!`);
        inseridosComSucesso++;
        dadosInseridos.push(insertedData);
      } catch (error) {
        console.error(`❌ Erro inesperado ao inserir ${tipo.nome}:`, error);
        continue; // Continuar com o próximo
      }
    }

    if (inseridosComSucesso === 0) {
      console.error('❌ Nenhum tipo de acesso foi inserido');
      return NextResponse.json(
        {
          error: 'Erro ao inserir dados padrão',
          details: 'Nenhum registro foi inserido com sucesso',
        },
        { status: 500 }
      );
    }

    console.log(
      `🎉 Inserção concluída! ${inseridosComSucesso} de ${tiposPadrao.length} inseridos com sucesso`
    );

    return NextResponse.json({
      success: true,
      message: 'Dados padrão inseridos com sucesso',
      recordsInserted: inseridosComSucesso,
      dadosInseridos: dadosInseridos,
    });
  } catch (error) {
    console.error('❌ Erro geral:', error);
    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
