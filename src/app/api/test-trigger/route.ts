import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    console.log('🧪 Testando trigger com dados completos...');

    // Dados completos para pessoa jurídica (todos os campos obrigatórios)
    const pessoaJuridica = {
      cnpj: '12.345.678/0001-90',
      razao_social: 'Empresa Teste LTDA',
      nome_fantasia: 'Empresa Teste',
      cep: '12345-678',
      endereco: 'Rua Teste, 123',
      numero: '123',
      complemento: 'Sala 1',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      proprietario_nome: 'João Silva',
      proprietario_rg: '12.345.678-9',
      proprietario_cpf: '123.456.789-00',
      proprietario_data_nascimento: '1990-01-01',
      proprietario_email: 'teste@empresa.com',
      proprietario_telefone: '(11) 99999-9999',
      banco_id: 1,
      agencia: '0001',
      conta_digito: '12345-6',
      tipo_conta: 'Corrente',
      tipo_pix: 'CPF',
      chave_pix: '123.456.789-00',
      usuario: 'teste@empresa.com',
      senha_hash: 'senha123',
    };

    // Inserir pessoa jurídica (deve disparar o trigger)
    const { data: pjData, error: pjError } = await supabase
      .from('pessoas_juridicas')
      .insert(pessoaJuridica)
      .select()
      .single();

    if (pjError) {
      console.error('Erro ao inserir pessoa jurídica:', pjError);
      return NextResponse.json(
        {
          success: false,
          error: 'Erro ao inserir pessoa jurídica',
          details: pjError,
        },
        { status: 500 }
      );
    }

    console.log('✅ Pessoa jurídica inserida:', pjData);

    // Aguardar um pouco para o trigger executar
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verificar se o usuário foi criado automaticamente
    const { data: usuariosData, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', 'teste@empresa.com')
      .order('created_at', { ascending: false })
      .limit(1);

    if (usuariosError) {
      console.error('Erro ao verificar usuários:', usuariosError);
    }

    // Verificar se a função RPC funciona
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

    return NextResponse.json({
      success: true,
      message: 'Teste de trigger executado',
      data: {
        pessoa_juridica: pjData,
        usuario_criado: usuariosData?.[0] || null,
        rpc: {
          resultado: rpcResult,
          erro: rpcError,
        },
        trigger_funcionou: usuariosData && usuariosData.length > 0,
      },
    });
  } catch (error) {
    console.error('Erro no teste de trigger:', error);
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
    console.log('📋 Verificando status atual...');

    // Verificar pessoas jurídicas existentes
    const { data: pjData, error: pjError } = await supabase
      .from('pessoas_juridicas')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    // Verificar usuários existentes
    const { data: usuariosData, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

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

    return NextResponse.json({
      success: true,
      message: 'Status verificado',
      data: {
        pessoas_juridicas: pjData || [],
        usuarios: usuariosData || [],
        rpc: {
          resultado: rpcResult,
          erro: rpcError,
        },
        total_pj: pjData?.length || 0,
        total_usuarios: usuariosData?.length || 0,
      },
    });
  } catch (error) {
    console.error('Erro ao verificar status:', error);
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
