import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    console.log('🔧 Criando usuários pendentes para empresas existentes...');

    // 1. Buscar empresas jurídicas que não têm usuários correspondentes
    const { data: pjData, error: pjError } = await supabase
      .from('pessoas_juridicas')
      .select('*')
      .eq('ativo', false); // Apenas as pendentes

    if (pjError) {
      console.error('❌ Erro ao buscar pessoas jurídicas:', pjError);
      return NextResponse.json(
        { error: 'Erro ao buscar pessoas jurídicas', details: pjError },
        { status: 500 }
      );
    }

    console.log(`📋 Encontradas ${pjData?.length || 0} empresas pendentes`);

    const usuariosCriados = [];
    const erros = [];

    // 2. Para cada empresa pendente, criar usuário se não existir
    for (const empresa of pjData || []) {
      try {
        // Verificar se já existe usuário para este email
        const { data: usuarioExistente, error: checkError } = await supabase
          .from('usuarios')
          .select('id')
          .eq('email', empresa.proprietario_email)
          .limit(1);

        if (checkError) {
          console.error(
            `❌ Erro ao verificar usuário para ${empresa.razao_social}:`,
            checkError
          );
          erros.push({ empresa: empresa.razao_social, erro: checkError });
          continue;
        }

        if (usuarioExistente && usuarioExistente.length > 0) {
          console.log(`ℹ️ Usuário já existe para ${empresa.razao_social}`);
          continue;
        }

        // Criar usuário pendente
        const { data: novoUsuario, error: createError } = await supabase
          .from('usuarios')
          .insert({
            nome: empresa.razao_social,
            email: empresa.proprietario_email,
            aprovado: false,
            ativo: false,
            perfil_id: null, // Será definido na aprovação
            data_cadastro: new Date().toISOString(),
          })
          .select()
          .single();

        if (createError) {
          console.error(
            `❌ Erro ao criar usuário para ${empresa.razao_social}:`,
            createError
          );
          erros.push({ empresa: empresa.razao_social, erro: createError });
        } else {
          console.log(
            `✅ Usuário criado para ${empresa.razao_social}:`,
            novoUsuario
          );
          usuariosCriados.push({
            empresa: empresa.razao_social,
            usuario: novoUsuario,
          });
        }
      } catch (error) {
        console.error(`❌ Erro ao processar ${empresa.razao_social}:`, error);
        erros.push({ empresa: empresa.razao_social, erro: error });
      }
    }

    // 3. Fazer o mesmo para pessoas físicas
    const { data: pfData, error: pfError } = await supabase
      .from('pessoas_fisicas')
      .select('*')
      .eq('ativo', false);

    if (!pfError && pfData) {
      console.log(`📋 Encontradas ${pfData.length} pessoas físicas pendentes`);

      for (const pessoa of pfData) {
        try {
          // Verificar se já existe usuário
          const { data: usuarioExistente } = await supabase
            .from('usuarios')
            .select('id')
            .eq('email', pessoa.email)
            .limit(1);

          if (usuarioExistente && usuarioExistente.length > 0) {
            console.log(`ℹ️ Usuário já existe para ${pessoa.nome}`);
            continue;
          }

          // Criar usuário pendente
          const { data: novoUsuario, error: createError } = await supabase
            .from('usuarios')
            .insert({
              nome: pessoa.nome,
              email: pessoa.email,
              aprovado: false,
              ativo: false,
              perfil_id: null,
              data_cadastro: new Date().toISOString(),
            })
            .select()
            .single();

          if (createError) {
            console.error(
              `❌ Erro ao criar usuário para ${pessoa.nome}:`,
              createError
            );
            erros.push({ pessoa: pessoa.nome, erro: createError });
          } else {
            console.log(`✅ Usuário criado para ${pessoa.nome}:`, novoUsuario);
            usuariosCriados.push({
              pessoa: pessoa.nome,
              usuario: novoUsuario,
            });
          }
        } catch (error) {
          console.error(`❌ Erro ao processar ${pessoa.nome}:`, error);
          erros.push({ pessoa: pessoa.nome, erro: error });
        }
      }
    }

    const resultado = {
      success: true,
      timestamp: new Date().toISOString(),
      resumo: {
        usuarios_criados: usuariosCriados.length,
        erros: erros.length,
      },
      usuarios_criados: usuariosCriados,
      erros,
      mensagem: `Processamento concluído. ${usuariosCriados.length} usuários criados, ${erros.length} erros.`,
    };

    console.log('✅ Processamento concluído:', resultado);
    return NextResponse.json(resultado);
  } catch (error) {
    console.error('❌ Erro geral:', error);
    return NextResponse.json(
      { error: 'Erro interno', details: error },
      { status: 500 }
    );
  }
}
