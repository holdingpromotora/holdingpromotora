-- Script completo para adicionar todas as colunas faltantes na tabela clientes_pessoa_juridica
-- Execute este script no SQL Editor do Supabase

DO $$
BEGIN
    -- Adicionar coluna 'complemento' se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes_pessoa_juridica' AND column_name = 'complemento'
    ) THEN
        ALTER TABLE clientes_pessoa_juridica ADD COLUMN complemento VARCHAR(100);
        RAISE NOTICE 'Coluna complemento adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna complemento já existe.';
    END IF;

    -- Adicionar coluna 'cpf' se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes_pessoa_juridica' AND column_name = 'cpf'
    ) THEN
        ALTER TABLE clientes_pessoa_juridica ADD COLUMN cpf VARCHAR(14);
        RAISE NOTICE 'Coluna cpf adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna cpf já existe.';
    END IF;

    -- Adicionar coluna 'rg' se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes_pessoa_juridica' AND column_name = 'rg'
    ) THEN
        ALTER TABLE clientes_pessoa_juridica ADD COLUMN rg VARCHAR(20);
        RAISE NOTICE 'Coluna rg adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna rg já existe.';
    END IF;

    -- Adicionar coluna 'data_nascimento' se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes_pessoa_juridica' AND column_name = 'data_nascimento'
    ) THEN
        ALTER TABLE clientes_pessoa_juridica ADD COLUMN data_nascimento DATE;
        RAISE NOTICE 'Coluna data_nascimento adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna data_nascimento já existe.';
    END IF;

    -- Adicionar coluna 'telefone' se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes_pessoa_juridica' AND column_name = 'telefone'
    ) THEN
        ALTER TABLE clientes_pessoa_juridica ADD COLUMN telefone VARCHAR(15);
        RAISE NOTICE 'Coluna telefone adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna telefone já existe.';
    END IF;

    -- Adicionar coluna 'banco_id' se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes_pessoa_juridica' AND column_name = 'banco_id'
    ) THEN
        ALTER TABLE clientes_pessoa_juridica ADD COLUMN banco_id INTEGER;
        RAISE NOTICE 'Coluna banco_id adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna banco_id já existe.';
    END IF;

    -- Adicionar coluna 'agencia' se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes_pessoa_juridica' AND column_name = 'agencia'
    ) THEN
        ALTER TABLE clientes_pessoa_juridica ADD COLUMN agencia VARCHAR(10);
        RAISE NOTICE 'Coluna agencia adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna agencia já existe.';
    END IF;

    -- Adicionar coluna 'conta_digito' se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes_pessoa_juridica' AND column_name = 'conta_digito'
    ) THEN
        ALTER TABLE clientes_pessoa_juridica ADD COLUMN conta_digito VARCHAR(20);
        RAISE NOTICE 'Coluna conta_digito adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna conta_digito já existe.';
    END IF;

    -- Adicionar coluna 'tipo_conta' se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes_pessoa_juridica' AND column_name = 'tipo_conta'
    ) THEN
        ALTER TABLE clientes_pessoa_juridica ADD COLUMN tipo_conta VARCHAR(20) DEFAULT 'Corrente';
        RAISE NOTICE 'Coluna tipo_conta adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna tipo_conta já existe.';
    END IF;

    -- Adicionar coluna 'tipo_pix' se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes_pessoa_juridica' AND column_name = 'tipo_pix'
    ) THEN
        ALTER TABLE clientes_pessoa_juridica ADD COLUMN tipo_pix VARCHAR(20) DEFAULT 'CNPJ';
        RAISE NOTICE 'Coluna tipo_pix adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna tipo_pix já existe.';
    END IF;

    -- Adicionar coluna 'chave_pix' se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes_pessoa_juridica' AND column_name = 'chave_pix'
    ) THEN
        ALTER TABLE clientes_pessoa_juridica ADD COLUMN chave_pix VARCHAR(100);
        RAISE NOTICE 'Coluna chave_pix adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna chave_pix já existe.';
    END IF;

    -- Adicionar coluna 'ativo' se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clientes_pessoa_juridica' AND column_name = 'ativo'
    ) THEN
        ALTER TABLE clientes_pessoa_juridica ADD COLUMN ativo BOOLEAN DEFAULT true;
        RAISE NOTICE 'Coluna ativo adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna ativo já existe.';
    END IF;

    RAISE NOTICE 'Verificação de colunas concluída!';
END $$;

-- Verificar a estrutura atual da tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'clientes_pessoa_juridica' 
ORDER BY ordinal_position;
