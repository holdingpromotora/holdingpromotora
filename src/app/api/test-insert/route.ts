import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST - Testar inserção de um registro
export async function POST() {
  try {
    console.log('🧪 Testando inserção de um registro...');

    // Tentar inserir apenas um registro
    const { data, error } = await supabase
      .from('tipos_acesso')
      .insert([
        { 
          nome: 'Teste', 
          descricao: 'Tipo de acesso para teste', 
          nivel: 8, 
          cor: 'bg-gray-600', 
          icone: 'Test' 
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao inserir registro de teste:', error);
      return NextResponse.json(
        { 
          error: 'Erro ao inserir registro de teste',
          details: error.message,
          code: error.code,
          hint: error.hint || 'Verifique as constraints da tabela'
        },
        { status: 500 }
      );
    }

    console.log('✅ Registro de teste inserido com sucesso!');
    
    // Remover o registro de teste
    await supabase
      .from('tipos_acesso')
      .delete()
      .eq('id', data.id);

    return NextResponse.json({
      success: true,
      message: 'Inserção de teste funcionou',
      testRecord: data
    });

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
