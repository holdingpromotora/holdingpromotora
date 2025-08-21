-- Script seguro para adicionar a coluna 'complemento' na tabela clientes_pessoa_juridica
-- Execute este script no SQL Editor do Supabase

DO $$
BEGIN
    -- Verificar se a coluna 'complemento' já existe
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'clientes_pessoa_juridica' 
        AND column_name = 'complemento'
    ) THEN
        -- Adicionar a coluna se ela não existir
        ALTER TABLE clientes_pessoa_juridica 
        ADD COLUMN complemento VARCHAR(100);
        
        RAISE NOTICE 'Coluna complemento adicionada com sucesso!';
    ELSE
        RAISE NOTICE 'Coluna complemento já existe na tabela.';
    END IF;
END $$;

-- Verificar a estrutura atual da tabela
SELECT column_name, data_type, is_nullable, character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'clientes_pessoa_juridica' 
ORDER BY ordinal_position;
