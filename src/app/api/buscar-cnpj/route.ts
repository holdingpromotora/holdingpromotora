import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cnpj = searchParams.get('cnpj');

    if (!cnpj) {
      return NextResponse.json(
        { error: 'CNPJ é obrigatório' },
        { status: 400 }
      );
    }

    const cnpjLimpo = cnpj.replace(/\D/g, '');

    if (cnpjLimpo.length !== 14) {
      return NextResponse.json(
        { error: 'CNPJ deve ter 14 dígitos' },
        { status: 400 }
      );
    }

    // Usar API pública da Receita Federal (simulada para desenvolvimento)
    // Em produção, você pode usar: https://receitaws.com.br/v1/cnpj/{cnpj}

    // Simulação de dados para desenvolvimento
    const dadosEmpresa = {
      cnpj: cnpjLimpo,
      razao_social: `Empresa Teste ${cnpjLimpo.slice(-4)}`,
      nome_fantasia: `Fantasia ${cnpjLimpo.slice(-4)}`,
      cep: '01001-000',
      endereco: 'Rua da Empresa, 123',
      numero: '123',
      complemento: 'Sala 201',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      situacao: 'ATIVA',
      data_abertura: '2020-01-01',
      tipo: 'MATRIZ',
      porte: 'Pequeno Porte',
      natureza_juridica: '213-5 - Empresário Individual',
      capital_social: '10000.00',
    };

    // Aguardar um pouco para simular latência da API
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      data: dadosEmpresa,
    });
  } catch (error) {
    console.error('Erro ao buscar CNPJ:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
