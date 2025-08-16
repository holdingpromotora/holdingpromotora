import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    console.log('🔧 Recriando triggers...');

    // 1. Recriar função para criar usuário automaticamente
    const { error: functionError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION criar_usuario_automatico(
            p_nome VARCHAR(200),
            p_email VARCHAR(100),
            p_senha_hash VARCHAR(255),
            p_tipo_pessoa VARCHAR(20)
        )
        RETURNS INTEGER AS $$
        DECLARE
            novo_usuario_id INTEGER;
            perfil_padrao_id INTEGER;
        BEGIN
            -- Buscar tipo de acesso padrão (Visualizador ou similar)
            SELECT id INTO perfil_padrao_id 
            FROM tipos_acesso 
            WHERE nome ILIKE '%visualizador%' OR nome ILIKE '%operador%'
            LIMIT 1;
            
            -- Se não encontrar tipo de acesso, usar o primeiro disponível
            IF perfil_padrao_id IS NULL THEN
                SELECT id INTO perfil_padrao_id 
                FROM tipos_acesso 
                WHERE ativo = true 
                LIMIT 1;
            END IF;
            
            -- Inserir usuário com status pendente
            INSERT INTO usuarios (
                nome, email, senha_hash, perfil_id, ativo, aprovado,
                data_cadastro, created_at, updated_at
            ) VALUES (
                p_nome, p_email, p_senha_hash, perfil_padrao_id,
                false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            ) RETURNING id INTO novo_usuario_id;
            
            RETURN novo_usuario_id;
        END;
        $$ LANGUAGE plpgsql;
      `,
    });

    if (functionError) {
      console.log(
        'Função RPC não disponível, tentando criar via SQL direto...'
      );
    }

    // 2. Recriar trigger para pessoas jurídicas
    const { error: triggerPJError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Recriar trigger para pessoas jurídicas
        DROP TRIGGER IF EXISTS trigger_criar_usuario_pj ON pessoas_juridicas;
        
        CREATE OR REPLACE FUNCTION trigger_criar_usuario_pj()
        RETURNS TRIGGER AS $$
        BEGIN
            -- Criar usuário automaticamente quando pessoa jurídica for inserida
            PERFORM criar_usuario_automatico(
                NEW.razao_social,
                NEW.proprietario_email,
                NEW.senha_hash,
                'juridica'
            );
            
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        CREATE TRIGGER trigger_criar_usuario_pj
            AFTER INSERT ON pessoas_juridicas
            FOR EACH ROW
            EXECUTE FUNCTION trigger_criar_usuario_pj();
      `,
    });

    // 3. Recriar trigger para pessoas físicas
    const { error: triggerPFError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Recriar trigger para pessoas físicas
        DROP TRIGGER IF EXISTS trigger_criar_usuario_pf ON pessoas_fisicas;
        
        CREATE OR REPLACE FUNCTION trigger_criar_usuario_pf()
        RETURNS TRIGGER AS $$
        BEGIN
            -- Criar usuário automaticamente quando pessoa física for inserida
            PERFORM criar_usuario_automatico(
                NEW.nome,
                NEW.email,
                NEW.senha_hash,
                'fisica'
            );
            
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        CREATE TRIGGER trigger_criar_usuario_pf
            AFTER INSERT ON pessoas_fisicas
            FOR EACH ROW
            EXECUTE FUNCTION trigger_criar_usuario_pf();
      `,
    });

    // 4. Recriar função para verificar aprovações pendentes
    const { error: rpcError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION verificar_aprovacoes_pendentes()
        RETURNS TABLE (
            id INTEGER,
            nome VARCHAR(200),
            email VARCHAR(100),
            tipo_pessoa VARCHAR(20),
            data_cadastro TIMESTAMP,
            status VARCHAR(20)
        ) AS $$
        BEGIN
            RETURN QUERY
            SELECT 
                u.id, u.nome, u.email,
                CASE 
                    WHEN EXISTS (SELECT 1 FROM pessoas_fisicas pf WHERE pf.email = u.email) THEN 'Física'
                    WHEN EXISTS (SELECT 1 FROM pessoas_juridicas pj WHERE pj.proprietario_email = u.email) THEN 'Jurídica'
                    ELSE 'Sistema'
                END as tipo_pessoa,
                u.data_cadastro,
                CASE 
                    WHEN u.aprovado THEN 'Aprovado'
                    WHEN u.ativo = false AND u.aprovado = false THEN 'Rejeitado'
                    ELSE 'Pendente'
                END as status
            FROM usuarios u
            WHERE u.aprovado = false OR u.ativo = false
            ORDER BY u.data_cadastro DESC;
        END;
        $$ LANGUAGE plpgsql;
      `,
    });

    console.log('✅ Triggers recriados');

    // 5. Testar inserção de uma pessoa jurídica para verificar se o trigger funciona
    const pessoaJuridica = {
      cnpj: '98.765.432/0001-10',
      razao_social: 'Empresa Teste 2 LTDA',
      nome_fantasia: 'Empresa Teste 2',
      cep: '54321-098',
      endereco: 'Av Teste, 456',
      numero: '456',
      complemento: 'Sala 2',
      bairro: 'Centro',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      proprietario_nome: 'Maria Santos',
      proprietario_rg: '98.765.432-1',
      proprietario_cpf: '987.654.321-00',
      proprietario_data_nascimento: '1985-05-15',
      proprietario_email: 'teste2@empresa.com',
      proprietario_telefone: '(21) 88888-8888',
      banco_id: 1,
      agencia: '0002',
      conta_digito: '65432-1',
      tipo_conta: 'Corrente',
      tipo_pix: 'CPF',
      chave_pix: '987.654.321-00',
      usuario: 'teste2@empresa.com',
      senha_hash: 'senha456',
    };

    // Inserir pessoa jurídica (deve disparar o trigger)
    const { data: pjData, error: pjError } = await supabase
      .from('pessoas_juridicas')
      .insert(pessoaJuridica)
      .select()
      .single();

    if (pjError) {
      console.error('Erro ao inserir pessoa jurídica de teste:', pjError);
      return NextResponse.json(
        {
          success: false,
          error: 'Erro ao inserir pessoa jurídica de teste',
          details: pjError,
        },
        { status: 500 }
      );
    }

    console.log('✅ Pessoa jurídica de teste inserida:', pjData);

    // Aguardar um pouco para o trigger executar
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verificar se o usuário foi criado automaticamente
    const { data: usuariosData, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', 'teste2@empresa.com')
      .order('created_at', { ascending: false })
      .limit(1);

    // Verificar se a função RPC funciona agora
    let rpcResult = null;
    let rpcErrorTest = null;

    try {
      const { data, error } = await supabase.rpc(
        'verificar_aprovacoes_pendentes'
      );
      rpcResult = data;
      rpcErrorTest = error;
    } catch (error) {
      rpcErrorTest = error;
    }

    return NextResponse.json({
      success: true,
      message: 'Triggers recriados e testados',
      data: {
        pessoa_juridica_teste: pjData,
        usuario_criado: usuariosData?.[0] || null,
        trigger_funcionou: usuariosData && usuariosData.length > 0,
        rpc: {
          resultado: rpcResult,
          erro: rpcErrorTest,
        },
        erros: {
          function: functionError,
          trigger_pj: triggerPJError,
          trigger_pf: triggerPFError,
          rpc: rpcErrorTest,
        },
      },
    });
  } catch (error) {
    console.error('Erro ao recriar triggers:', error);
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

export async function GET() {
  try {
    console.log('📋 Verificando status dos triggers...');

    // Verificar se os triggers existem
    const { data: triggersData, error: triggersError } = await supabase
      .from('information_schema.triggers')
      .select('trigger_name, event_manipulation, event_object_table')
      .in('trigger_name', [
        'trigger_criar_usuario_pf',
        'trigger_criar_usuario_pj',
      ]);

    // Verificar se a função RPC existe
    let rpcResult = null;
    let rpcError = null;

    try {
      const { data, error } = await supabase.rpc(
        'verificar_aprovacoes_pendentes'
      );
      rpcResult = data;
      rpcError = error;
    } catch (error) {
      rpcError = error;
    }

    // Verificar usuários existentes
    const { data: usuariosData, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    return NextResponse.json({
      success: true,
      message: 'Status dos triggers verificado',
      data: {
        triggers: triggersData || [],
        rpc: {
          resultado: rpcResult,
          erro: rpcError,
        },
        usuarios: usuariosData || [],
        total_usuarios: usuariosData?.length || 0,
      },
    });
  } catch (error) {
    console.error('Erro ao verificar status dos triggers:', error);
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
