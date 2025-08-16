-- Script para remover a constraint UNIQUE do campo nivel
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se a constraint existe
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    tc.constraint_type
FROM 
    information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
WHERE 
    tc.table_name = 'tipos_acesso' 
    AND kcu.column_name = 'nivel'
    AND tc.constraint_type = 'UNIQUE';

-- 2. Remover a constraint UNIQUE do campo nivel
-- (Execute apenas se a constraint existir)
ALTER TABLE tipos_acesso DROP CONSTRAINT IF EXISTS tipos_acesso_nivel_key;

-- 3. Verificar se a constraint foi removida
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    tc.constraint_type
FROM 
    information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
WHERE 
    tc.table_name = 'tipos_acesso' 
    AND kcu.column_name = 'nivel';

-- 4. Verificar a estrutura atual da tabela
\d tipos_acesso;
