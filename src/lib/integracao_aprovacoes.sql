-- 🚀 Integração Automática: Cadastro → Aprovações
-- Sistema de Aprovação Automática da Holding Promotora

-- ========================================
-- ADICIONAR COLUNAS DE APROVAÇÃO NA TABELA usuarios
-- ========================================

-- Adicionar colunas de aprovação se não existirem
DO $$
BEGIN
    -- Coluna aprovado
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'usuarios' AND column_name = 'aprovado') THEN
        ALTER TABLE usuarios ADD COLUMN aprovado BOOLEAN DEFAULT false;
    END IF;
    
    -- Coluna data_aprovacao
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'usuarios' AND column_name = 'data_aprovacao') THEN
        ALTER TABLE usuarios ADD COLUMN data_aprovacao TIMESTAMP;
    END IF;
    
    -- Coluna aprovado_por
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'usuarios' AND column_name = 'aprovado_por') THEN
        ALTER TABLE usuarios ADD COLUMN aprovado_por VARCHAR(200);
    END IF;
    
    -- Coluna data_cadastro (renomear created_at se necessário)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'usuarios' AND column_name = 'data_cadastro') THEN
        ALTER TABLE usuarios ADD COLUMN data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- ========================================
-- FUNÇÃO PARA CRIAR USUÁRIO AUTOMATICAMENTE
-- ========================================

CREATE OR REPLACE FUNCTION criar_usuario_automatico(
    p_nome VARCHAR(200),
    p_email VARCHAR(100),
    p_senha_hash VARCHAR(255),
    p_tipo_pessoa VARCHAR(20) -- 'fisica' ou 'juridica'
)
RETURNS INTEGER AS $$
DECLARE
    novo_usuario_id INTEGER;
    tipo_acesso_padrao_id INTEGER;
BEGIN
    -- Buscar tipo de acesso padrão
    SELECT id INTO tipo_acesso_padrao_id 
    FROM tipos_acesso 
    WHERE nome ILIKE '%visualizador%' OR nome ILIKE '%operador%'
    LIMIT 1;
    
    -- Se não encontrar, usar o primeiro disponível
    IF tipo_acesso_padrao_id IS NULL THEN
        SELECT id INTO tipo_acesso_padrao_id 
        FROM tipos_acesso 
        WHERE ativo = true 
        LIMIT 1;
    END IF;
    
    -- Inserir usuário com status pendente
    INSERT INTO usuarios (
        nome, 
        email, 
        senha_hash, 
        perfil_id,
        ativo, 
        aprovado,
        data_cadastro,
        created_at,
        updated_at
    ) VALUES (
        p_nome, 
        p_email, 
        p_senha_hash, 
        tipo_acesso_padrao_id,
        false, -- Inativo até aprovação
        false, -- Não aprovado
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ) RETURNING id INTO novo_usuario_id;
    
    RETURN novo_usuario_id;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- TRIGGER PARA PESSOAS FÍSICAS
-- ========================================

CREATE OR REPLACE FUNCTION trigger_criar_usuario_pf()
RETURNS TRIGGER AS $$
BEGIN
    -- Criar usuário automaticamente quando pessoa física for inserida
    PERFORM criar_usuario_automatico(
        NEW.nome,
        NEW.email,
        NEW.senha_hash,
        'fisica'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger se não existir
DROP TRIGGER IF EXISTS trigger_criar_usuario_pf ON pessoas_fisicas;
CREATE TRIGGER trigger_criar_usuario_pf
    AFTER INSERT ON pessoas_fisicas
    FOR EACH ROW
    EXECUTE FUNCTION trigger_criar_usuario_pf();

-- ========================================
-- TRIGGER PARA PESSOAS JURÍDICAS
-- ========================================

CREATE OR REPLACE FUNCTION trigger_criar_usuario_pj()
RETURNS TRIGGER AS $$
BEGIN
    -- Criar usuário automaticamente quando pessoa jurídica for inserida
    PERFORM criar_usuario_automatico(
        NEW.razao_social,
        NEW.proprietario_email,
        NEW.senha_hash,
        'juridica'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger se não existir
DROP TRIGGER IF EXISTS trigger_criar_usuario_pj ON pessoas_juridicas;
CREATE TRIGGER trigger_criar_usuario_pj
    AFTER INSERT ON pessoas_juridicas
    FOR EACH ROW
    EXECUTE FUNCTION trigger_criar_usuario_pj();

-- ========================================
-- FUNÇÃO PARA VERIFICAR APROVAÇÕES PENDENTES
-- ========================================

CREATE OR REPLACE FUNCTION verificar_aprovacoes_pendentes()
RETURNS TABLE (
    id INTEGER,
    nome VARCHAR(200),
    email VARCHAR(100),
    tipo_pessoa VARCHAR(20),
    data_cadastro TIMESTAMP,
    status VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.nome,
        u.email,
        CASE 
            WHEN EXISTS (SELECT 1 FROM pessoas_fisicas pf WHERE pf.email = u.email) THEN 'Física'
            WHEN EXISTS (SELECT 1 FROM pessoas_juridicas pj WHERE pj.proprietario_email = u.email) THEN 'Jurídica'
            ELSE 'Sistema'
        END as tipo_pessoa,
        u.data_cadastro,
        CASE 
            WHEN u.aprovado THEN 'Aprovado'
            WHEN u.ativo = false AND u.aprovado = false THEN 'Rejeitado'
            ELSE 'Pendente'
        END as status
    FROM usuarios u
    WHERE u.aprovado = false OR u.ativo = false
    ORDER BY u.data_cadastro DESC;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- ÍNDICES PARA PERFORMANCE
-- ========================================

-- Índices para aprovações
CREATE INDEX IF NOT EXISTS idx_usuarios_aprovado ON usuarios(aprovado);
CREATE INDEX IF NOT EXISTS idx_usuarios_data_cadastro ON usuarios(data_cadastro);
CREATE INDEX IF NOT EXISTS idx_usuarios_status ON usuarios(aprovado, ativo);

-- ========================================
-- COMENTÁRIOS
-- ========================================

COMMENT ON FUNCTION criar_usuario_automatico IS 'Cria usuário automaticamente com status pendente';
COMMENT ON FUNCTION trigger_criar_usuario_pf IS 'Trigger para criar usuário quando pessoa física for cadastrada';
COMMENT ON FUNCTION trigger_criar_usuario_pj IS 'Trigger para criar usuário quando pessoa jurídica for cadastrada';
COMMENT ON FUNCTION verificar_aprovacoes_pendentes IS 'Retorna todas as aprovações pendentes do sistema';

-- ========================================
-- VERIFICAÇÃO FINAL
-- ========================================

-- Verificar se as colunas foram criadas
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
AND column_name IN ('aprovado', 'data_aprovacao', 'aprovado_por', 'data_cadastro')
ORDER BY column_name;

-- Verificar triggers criados
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name IN ('trigger_criar_usuario_pf', 'trigger_criar_usuario_pj')
ORDER BY trigger_name;
