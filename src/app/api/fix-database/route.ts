import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    console.log('🔄 Iniciando correção da estrutura do banco de dados...');

    // 1. Verificar se a coluna perfil_nome já existe
    const { data: checkColumn, error: checkError } = await supabase
      .from('usuarios')
      .select('perfil_nome')
      .limit(1);

    if (!checkError) {
      console.log('✅ Coluna perfil_nome já existe!');
      return NextResponse.json({
        success: true,
        message: 'Coluna perfil_nome já existe no banco',
        alreadyFixed: true,
      });
    }

    console.log('📋 Coluna perfil_nome não existe. Criando...');

    // 2. Criar a coluna perfil_nome usando SQL direto
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE usuarios ADD COLUMN perfil_nome VARCHAR(255);',
    });

    if (alterError) {
      console.log(
        '⚠️ Erro ao criar coluna via RPC, tentando método alternativo...'
      );

      // Método alternativo: inserir um registro com a nova coluna
      const { error: insertError } = await supabase.from('usuarios').insert({
        nome: 'TEMP_USER_FOR_COLUMN_CREATION',
        email: 'temp@temp.com',
        perfil_nome: 'TEMP',
      });

      if (insertError) {
        console.error('❌ Erro ao criar coluna:', insertError);
        return NextResponse.json(
          {
            success: false,
            error:
              'Não foi possível criar a coluna perfil_nome automaticamente',
            details: insertError,
            instructions: 'Execute manualmente o script SQL no Supabase',
          },
          { status: 500 }
        );
      }

      // Remover o usuário temporário
      await supabase.from('usuarios').delete().eq('email', 'temp@temp.com');
    }

    console.log('✅ Coluna perfil_nome criada com sucesso!');

    // 3. Atualizar registros existentes
    const { data: tiposAcesso, error: tiposError } = await supabase
      .from('tipos_acesso')
      .select('id, nome');

    if (tiposError) {
      console.error('❌ Erro ao buscar tipos de acesso:', tiposError);
      return NextResponse.json(
        {
          success: false,
          error: 'Erro ao buscar tipos de acesso',
          details: tiposError,
        },
        { status: 500 }
      );
    }

    // 4. Atualizar cada usuário com o nome do perfil
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('id, tipo_acesso_id');

    if (usuariosError) {
      console.error('❌ Erro ao buscar usuários:', usuariosError);
      return NextResponse.json(
        {
          success: false,
          error: 'Erro ao buscar usuários',
          details: usuariosError,
        },
        { status: 500 }
      );
    }

    let updatedCount = 0;
    for (const usuario of usuarios || []) {
      if (usuario.tipo_acesso_id) {
        const tipoAcesso = tiposAcesso?.find(
          ta => ta.id === usuario.tipo_acesso_id
        );
        if (tipoAcesso) {
          const { error: updateError } = await supabase
            .from('usuarios')
            .update({ perfil_nome: tipoAcesso.nome })
            .eq('id', usuario.id);

          if (!updateError) {
            updatedCount++;
          }
        }
      } else {
        // Usuário sem tipo_acesso_id
        const { error: updateError } = await supabase
          .from('usuarios')
          .update({ perfil_nome: 'N/A' })
          .eq('id', usuario.id);

        if (!updateError) {
          updatedCount++;
        }
      }
    }

    console.log(`✅ ${updatedCount} usuários atualizados com sucesso!`);

    return NextResponse.json({
      success: true,
      message: 'Estrutura do banco corrigida com sucesso!',
      columnCreated: true,
      usersUpdated: updatedCount,
      totalUsers: usuarios?.length || 0,
    });
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro inesperado ao corrigir banco',
        details: error,
      },
      { status: 500 }
    );
  }
}
