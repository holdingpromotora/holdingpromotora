-- Script para adicionar a coluna 'complemento' na tabela clientes_pessoa_juridica
-- Execute este script no SQL Editor do Supabase

ALTER TABLE clientes_pessoa_juridica 
ADD COLUMN complemento VARCHAR(100);

-- Verificar se a coluna foi adicionada
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'clientes_pessoa_juridica' 
AND column_name = 'complemento';
