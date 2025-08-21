-- Script para adicionar campo complemento na tabela clientes_pessoa_juridica
-- Execute este script no SQL Editor do Supabase

-- Adicionar campo complemento na tabela clientes_pessoa_juridica
ALTER TABLE clientes_pessoa_juridica 
ADD COLUMN IF NOT EXISTS complemento VARCHAR(100);

-- Verificar se o campo foi adicionado
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'clientes_pessoa_juridica' 
AND column_name = 'complemento';

-- Comentário do campo
COMMENT ON COLUMN clientes_pessoa_juridica.complemento IS 'Complemento do endereço (apto, sala, etc.)';
