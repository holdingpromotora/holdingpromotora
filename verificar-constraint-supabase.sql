-- Verificar detalhes da constraint tipo_conta
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition,
    conrelid::regclass as table_name
FROM pg_constraint 
WHERE conrelid = 'pessoas_juridicas'::regclass 
AND conname = 'pessoas_juridicas_tipo_conta_check';

-- Verificar se a tabela existe e sua estrutura
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'pessoas_juridicas'
ORDER BY ordinal_position;

-- Verificar valores válidos para tipo_conta
SELECT DISTINCT tipo_conta 
FROM pessoas_juridicas 
WHERE tipo_conta IS NOT NULL;

-- Tentar inserir com diferentes valores para testar
-- (Execute uma por vez para ver qual funciona)

-- Teste 1: corrente (minúsculo)
-- INSERT INTO pessoas_juridicas (tipo_conta) VALUES ('corrente');

-- Teste 2: CORRENTE (maiúsculo)
-- INSERT INTO pessoas_juridicas (tipo_conta) VALUES ('CORRENTE');

-- Teste 3: Conta Corrente (com espaço)
-- INSERT INTO pessoas_juridicas (tipo_conta) VALUES ('Conta Corrente');

-- Teste 4: 1 (número)
-- INSERT INTO pessoas_juridicas (tipo_conta) VALUES ('1');

-- Teste 5: C (letra única)
-- INSERT INTO pessoas_juridicas (tipo_conta) VALUES ('C');
