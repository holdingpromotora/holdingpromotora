import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🔍 Debugando sistema de aprovação...');

    // 1. Buscar todos os usuários com detalhes
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*')
      .order('created_at', { ascending: false });

    if (usuariosError) {
      console.error('❌ Erro ao buscar usuários:', usuariosError);
      return NextResponse.json(
        { error: 'Erro ao buscar usuários' },
        { status: 500 }
      );
    }

    // 2. Buscar pessoas jurídicas
    const { data: pjData, error: pjError } = await supabase
      .from('pessoas_juridicas')
      .select('*');

    // 3. Buscar pessoas físicas
    const { data: pfData, error: pfError } = await supabase
      .from('pessoas_fisicas')
      .select('*');

    // 4. Calcular contagens reais
    const totalUsuarios = usuarios?.length || 0;
    const pendentes =
      usuarios?.filter(u => !u.aprovado && !u.rejeitado)?.length || 0;
    const aprovados = usuarios?.filter(u => u.aprovado && u.ativo)?.length || 0;
    const rejeitados = usuarios?.filter(u => u.rejeitado)?.length || 0;
    const ativos = usuarios?.filter(u => u.ativo)?.length || 0;

    // 5. Verificar triggers
    let triggerStatus = 'NÃO EXISTE';
    try {
      const { data: triggerData } = await supabase
        .from('information_schema.triggers')
        .select('trigger_name')
        .eq('trigger_name', 'trigger_criar_usuario_pj');

      if (triggerData && triggerData.length > 0) {
        triggerStatus = 'EXISTE';
      }
    } catch (error) {
      console.log(
        'ℹ️ Não foi possível verificar triggers via information_schema'
      );
    }

    const resultado = {
      success: true,
      timestamp: new Date().toISOString(),
      contagens: {
        total_usuarios: totalUsuarios,
        pendentes: pendentes,
        aprovados: aprovados,
        rejeitados: rejeitados,
        ativos: ativos,
      },
      tabelas: {
        usuarios: {
          total: usuarios?.length || 0,
          dados: usuarios?.slice(0, 3) || [], // Primeiros 3 para debug
        },
        pessoas_juridicas: {
          total: pjData?.length || 0,
          dados: pjData?.slice(0, 3) || [],
        },
        pessoas_fisicas: {
          total: pfData?.length || 0,
          dados: pfData?.slice(0, 3) || [],
        },
      },
      usuarios_detalhados:
        usuarios?.map(u => ({
          id: u.id,
          nome: u.nome,
          email: u.email,
          aprovado: u.aprovado,
          ativo: u.ativo,
          rejeitado: u.rejeitado,
          perfil_id: u.perfil_id,
          status:
            `${u.aprovado ? 'Aprovado' : ''} ${u.rejeitado ? 'Rejeitado' : ''} ${u.ativo ? 'Ativo' : 'Inativo'}`.trim(),
        })) || [],
      triggers: {
        trigger_criar_usuario_pj: triggerStatus,
      },
      analise: {
        problema: 'Verificação de contagens e status',
        observacoes: [
          `Total usuários: ${totalUsuarios}`,
          `Pendentes: ${pendentes}`,
          `Aprovados: ${aprovados}`,
          `Rejeitados: ${rejeitados}`,
          `Ativos: ${ativos}`,
        ],
      },
    };

    console.log('✅ Debug concluído:', resultado);
    return NextResponse.json(resultado);
  } catch (error) {
    console.error('❌ Erro no debug:', error);
    return NextResponse.json(
      { error: 'Erro interno', details: error },
      { status: 500 }
    );
  }
}
