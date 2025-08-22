import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🔄 Testando conexão com o banco de dados...');

    // Testar conexão básica
    const { data, error } = await supabase
      .from('usuarios')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Erro na conexão com o banco:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          details: error,
        },
        { status: 500 }
      );
    }

    console.log('✅ Conexão com o banco funcionando!');

    // Testar uma query mais específica
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('id, nome, email, perfil_nome, tipo_acesso_id')
      .limit(5);

    if (usuariosError) {
      console.error('❌ Erro ao buscar usuários:', usuariosError);
      return NextResponse.json(
        {
          success: false,
          error: usuariosError.message,
          details: usuariosError,
        },
        { status: 500 }
      );
    }

    console.log('✅ Query de usuários funcionando!');
    console.log('📊 Usuários encontrados:', usuarios?.length || 0);

    return NextResponse.json({
      success: true,
      message: 'Conexão com o banco funcionando perfeitamente!',
      usuariosCount: usuarios?.length || 0,
      sampleData: usuarios,
    });
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro inesperado ao testar conexão',
        details: error,
      },
      { status: 500 }
    );
  }
}
