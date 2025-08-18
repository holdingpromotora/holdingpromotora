-- Verificar a constraint da coluna tipo_conta
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'pessoas_juridicas'::regclass 
AND conname = 'pessoas_juridicas_tipo_conta_check';

-- Verificar os valores válidos para tipo_conta
SELECT DISTINCT tipo_conta 
FROM pessoas_juridicas 
WHERE tipo_conta IS NOT NULL;
