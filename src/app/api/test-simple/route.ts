import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🧪 Teste simples de conexão...');

    // Teste básico de conexão
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nome, email')
      .limit(1);

    if (error) {
      console.error('Erro na consulta:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Erro na consulta ao banco',
          details: error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Conexão com Supabase funcionando',
      data: data,
      count: data?.length || 0,
    });
  } catch (error) {
    console.error('Erro no teste simples:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        details: error,
      },
      { status: 500 }
    );
  }
}
