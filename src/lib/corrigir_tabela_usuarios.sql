-- Script para corrigir a tabela usuarios
-- Adiciona as colunas que estão faltando: status, perfil_id, perfil_nome

-- Verificar se a coluna status existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'status'
    ) THEN
        -- Adicionar coluna status
        ALTER TABLE usuarios ADD COLUMN status VARCHAR(50) DEFAULT 'pendente';
        
        -- Atualizar status baseado nas colunas existentes
        UPDATE usuarios 
        SET status = CASE 
            WHEN aprovado = true AND ativo = true THEN 'aprovado'
            WHEN aprovado = false THEN 'pendente'
            WHEN rejeitado = true THEN 'rejeitado'
            WHEN aprovado = true AND ativo = false THEN 'inativo'
            ELSE 'pendente'
        END;
        
        -- Criar índice para melhor performance
        CREATE INDEX IF NOT EXISTS idx_usuarios_status ON usuarios(status);
        
        RAISE NOTICE 'Coluna status adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna status já existe';
    END IF;
END $$;

-- Verificar se a coluna perfil_id existe (para compatibilidade)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'perfil_id'
    ) THEN
        -- Adicionar coluna perfil_id como alias para tipo_acesso_id
        ALTER TABLE usuarios ADD COLUMN perfil_id INTEGER;
        
        -- Atualizar perfil_id com o valor de tipo_acesso_id
        UPDATE usuarios SET perfil_id = tipo_acesso_id;
        
        -- Criar índice para melhor performance
        CREATE INDEX IF NOT EXISTS idx_usuarios_perfil_id ON usuarios(perfil_id);
        
        RAISE NOTICE 'Coluna perfil_id adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna perfil_id já existe';
    END IF;
END $$;

-- Verificar se a coluna perfil_nome existe (para compatibilidade)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'perfil_nome'
    ) THEN
        -- Adicionar coluna perfil_nome como VARCHAR
        ALTER TABLE usuarios ADD COLUMN perfil_nome VARCHAR(100);
        
        -- Atualizar perfil_nome baseado no tipo_acesso_id
        UPDATE usuarios 
        SET perfil_nome = CASE 
            WHEN tipo_acesso_id = 1 THEN 'Master'
            WHEN tipo_acesso_id = 2 THEN 'Submaster'
            WHEN tipo_acesso_id = 3 THEN 'Parceiro'
            WHEN tipo_acesso_id = 4 THEN 'Colaborador'
            WHEN tipo_acesso_id = 5 THEN 'Operador'
            WHEN tipo_acesso_id = 6 THEN 'Visualizador'
            WHEN tipo_acesso_id = 7 THEN 'Convidado'
            ELSE 'Usuário'
        END;
        
        -- Criar índice para melhor performance
        CREATE INDEX IF NOT EXISTS idx_usuarios_perfil_nome ON usuarios(perfil_nome);
        
        RAISE NOTICE 'Coluna perfil_nome adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna perfil_nome já existe';
    END IF;
END $$;

-- Atualizar a view usuarios_completos para incluir as novas colunas
CREATE OR REPLACE VIEW usuarios_completos AS
SELECT 
    u.id,
    u.nome,
    u.email,
    u.ativo,
    u.ultimo_acesso,
    u.created_at,
    u.updated_at,
    u.aprovado,
    u.rejeitado,
    u.data_aprovacao,
    u.aprovado_por,
    u.data_cadastro,
    u.status,
    u.perfil_id,
    u.perfil_nome,
    ta.id as tipo_acesso_id,
    ta.nome as tipo_acesso_nome,
    ta.nivel as tipo_acesso_nivel,
    ta.descricao as tipo_acesso_descricao
FROM usuarios u
LEFT JOIN tipos_acesso ta ON u.tipo_acesso_id = ta.id;

-- Verificar a estrutura final
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
ORDER BY ordinal_position;
