import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://ferlknesyqrhdvapqqso.supabase.co';
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlcmxrbmVzeXFyaGR2YXBxcXNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTEyMTA0NSwiZXhwIjoyMDcwNjk3MDQ1fQ.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('🔐 Tentativa de login:', { email, password: '***' });

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar usuário no banco de dados
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select(
        `
        id,
        nome,
        email,
        senha_hash,
        ativo,
        tipo_acesso_id
      `
      )
      .eq('email', email)
      .eq('ativo', true)
      .single();

    if (usuariosError || !usuarios) {
      console.log('❌ Usuário não encontrado:', email);
      return NextResponse.json(
        { success: false, error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Buscar tipo de acesso do usuário
    const { data: tipoAcesso, error: tipoAcessoError } = await supabase
      .from('tipos_acesso')
      .select('id, nome, nivel')
      .eq('id', usuarios.tipo_acesso_id)
      .single();

    if (usuariosError || !usuarios) {
      console.log('❌ Usuário não encontrado:', email);
      return NextResponse.json(
        { success: false, error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Verificar se a senha está correta
    // Por enquanto, comparando diretamente (em produção, usar hash)
    if (usuarios.senha_hash !== password) {
      console.log('❌ Senha incorreta para usuário:', email);
      return NextResponse.json(
        { success: false, error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Buscar permissões do usuário
    const { data: niveisAcesso, error: niveisError } = await supabase
      .from('niveis_acesso')
      .select('permissoes')
      .eq('tipo_acesso_id', usuarios.tipo_acesso_id)
      .eq('ativo', true)
      .single();

    // Preparar dados do usuário para retorno
    const userData = {
      id: usuarios.id,
      email: usuarios.email,
      nome: usuarios.nome,
      perfil_id: tipoAcesso?.id?.toString() || '1',
      perfil_nome: tipoAcesso?.nome || 'Usuário',
      nivel_acesso: tipoAcesso?.nivel || 1,
      aprovado: usuarios.ativo,
      ativo: usuarios.ativo,
      status: usuarios.ativo ? 'aprovado' : 'pendente',
      permissoes: niveisAcesso?.permissoes || [],
    };

    console.log('✅ Login bem-sucedido para usuário:', email);

    return NextResponse.json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error('❌ Erro durante autenticação:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
