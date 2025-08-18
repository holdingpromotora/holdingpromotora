import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    console.log('🧪 Testando API de cadastro PJ...');

    // Gerar email único baseado no timestamp
    const timestamp = Date.now();
    const emailUnico = `teste${timestamp}@teste.com`;

    // Dados de teste com email único
    const dadosTeste = {
      cnpj: `11.111.111/1111-${timestamp.toString().slice(-2)}`,
      razao_social: 'EMPRESA TESTE LTDA',
      nome_fantasia: 'EMPRESA TESTE',
      cep: '11111-111',
      endereco: 'Rua Teste',
      numero: '123',
      complemento: 'Sala 1',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      proprietario_nome: 'João Teste',
      proprietario_rg: '11.111.111-1',
      proprietario_cpf: `111.111.111-${timestamp.toString().slice(-2)}`,
      proprietario_data_nascimento: '1990-01-01',
      proprietario_email: emailUnico,
      proprietario_telefone: '(11) 1111-1111',
      banco_id: null,
      agencia: '0001',
      conta_digito: '12345-6',
      tipo_conta: 'Corrente',
      tipo_pix: 'E-mail',
      chave_pix: emailUnico,
      usuario: emailUnico,
      senha_hash: 'senha123',
      ativo: false,
    };

    console.log('📋 Dados de teste:', dadosTeste);

    // Tentar inserir no Supabase
    const { data, error } = await supabase
      .from('pessoas_juridicas')
      .insert([dadosTeste])
      .select();

    if (error) {
      console.error('❌ Erro na inserção:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code,
          details: error.details,
        },
        { status: 400 }
      );
    }

    console.log('✅ Inserção bem-sucedida:', data);

    // Limpar dados de teste
    const { error: deleteError } = await supabase
      .from('pessoas_juridicas')
      .delete()
      .eq('cnpj', dadosTeste.cnpj);

    if (deleteError) {
      console.error('⚠️ Erro ao limpar dados de teste:', deleteError);
    } else {
      console.log('🧹 Dados de teste limpos');
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Teste de cadastro PJ bem-sucedido!',
        data: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Erro geral na API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
