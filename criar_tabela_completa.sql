-- Script para recriar a tabela clientes_pessoa_juridica com todas as colunas necessárias
-- Execute este script no SQL Editor do Supabase

-- Primeiro, vamos verificar se a tabela existe e quais colunas ela tem
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'clientes_pessoa_juridica' 
ORDER BY ordinal_position;

-- Se a tabela existir mas estiver incompleta, vamos recriá-la
DROP TABLE IF EXISTS clientes_pessoa_juridica CASCADE;

-- Criar a tabela completa com todas as colunas necessárias
CREATE TABLE clientes_pessoa_juridica (
    id SERIAL PRIMARY KEY,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    cep VARCHAR(9),
    endereco VARCHAR(255),
    numero VARCHAR(20),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    nome VARCHAR(255), -- Nome do representante
    rg VARCHAR(20), -- RG do representante
    cpf VARCHAR(14), -- CPF do representante
    data_nascimento DATE, -- Data de nascimento do representante
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(15),
    banco_id INTEGER,
    agencia VARCHAR(10),
    conta_digito VARCHAR(20),
    tipo_conta VARCHAR(20) DEFAULT 'Corrente',
    tipo_pix VARCHAR(20) DEFAULT 'CNPJ',
    chave_pix VARCHAR(100),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX idx_clientes_pj_cnpj ON clientes_pessoa_juridica(cnpj);
CREATE INDEX idx_clientes_pj_email ON clientes_pessoa_juridica(email);
CREATE INDEX idx_clientes_pj_razao_social ON clientes_pessoa_juridica(razao_social);

-- Verificar a estrutura da tabela criada
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'clientes_pessoa_juridica' 
ORDER BY ordinal_position;

-- Mostrar mensagem de sucesso
DO $$
BEGIN
    RAISE NOTICE 'Tabela clientes_pessoa_juridica criada com sucesso com todas as colunas necessárias!';
    RAISE NOTICE 'Total de colunas: %', (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'clientes_pessoa_juridica');
END $$;
