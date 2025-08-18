-- 🚀 Correção das Constraints da Tabela pessoas_juridicas
-- Primeiro limpar dados inválidos, depois adicionar constraints CHECK

-- 1. LIMPAR DADOS INVÁLIDOS EXISTENTES
-- Corrigir valores de tipo_conta para valores válidos
UPDATE pessoas_juridicas 
SET tipo_conta = 'Corrente' 
WHERE tipo_conta NOT IN ('Corrente', 'Poupança') 
   OR tipo_conta IS NULL;

-- Corrigir valores de tipo_pix para valores válidos
UPDATE pessoas_juridicas 
SET tipo_pix = 'E-mail' 
WHERE tipo_pix NOT IN ('CNPJ', 'CPF', 'Telefone', 'E-mail') 
   OR tipo_pix IS NULL;

-- 2. ADICIONAR CONSTRAINTS CHECK
DO $$
BEGIN
    -- Adicionar constraint para tipo_conta se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'pessoas_juridicas_tipo_conta_check'
    ) THEN
        ALTER TABLE pessoas_juridicas 
        ADD CONSTRAINT pessoas_juridicas_tipo_conta_check 
        CHECK (tipo_conta IN ('Corrente', 'Poupança'));
        
        RAISE NOTICE '✅ Constraint para tipo_conta adicionada com sucesso';
    ELSE
        RAISE NOTICE 'ℹ️ Constraint para tipo_conta já existe';
    END IF;
    
    -- Adicionar constraint para tipo_pix se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'pessoas_juridicas_tipo_pix_check'
    ) THEN
        ALTER TABLE pessoas_juridicas 
        ADD CONSTRAINT pessoas_juridicas_tipo_pix_check 
        CHECK (tipo_pix IN ('CNPJ', 'CPF', 'Telefone', 'E-mail'));
        
        RAISE NOTICE '✅ Constraint para tipo_pix adicionada com sucesso';
    ELSE
        RAISE NOTICE 'ℹ️ Constraint para tipo_pix já existe';
    END IF;
END $$;

-- 3. VERIFICAR RESULTADO
-- Mostrar as constraints criadas
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'pessoas_juridicas' 
  AND constraint_type = 'CHECK';

-- Mostrar os dados corrigidos
SELECT 
    id,
    cnpj,
    tipo_conta,
    tipo_pix,
    chave_pix
FROM pessoas_juridicas 
WHERE tipo_conta IS NOT NULL 
   OR tipo_pix IS NOT NULL
ORDER BY id;
