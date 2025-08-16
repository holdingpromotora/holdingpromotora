-- 🚀 SISTEMA DE NÍVEIS DE ACESSO - Holding Promotora
-- Arquivo: niveis_acesso_perfis.sql
-- Descrição: Criação das tabelas de níveis de acesso e usuários

-- TABELA: tipos_acesso
-- Descrição: Define os tipos de acesso disponíveis no sistema
CREATE TABLE IF NOT EXISTS tipos_acesso (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    nivel INTEGER NOT NULL,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_tipos_acesso_nome ON tipos_acesso(nome);
CREATE INDEX IF NOT EXISTS idx_tipos_acesso_nivel ON tipos_acesso(nivel);
CREATE INDEX IF NOT EXISTS idx_tipos_acesso_ativo ON tipos_acesso(ativo);

-- TABELA: usuarios
-- Descrição: Usuários do sistema com seus perfis de acesso
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255),
    tipo_acesso_id INTEGER REFERENCES tipos_acesso(id),
    ativo BOOLEAN DEFAULT true,
    ultimo_acesso TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    aprovado BOOLEAN DEFAULT false,
    rejeitado BOOLEAN DEFAULT false,
    data_aprovacao TIMESTAMP WITH TIME ZONE,
    aprovado_por VARCHAR(100),
    data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_usuarios_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_usuarios_updated_at 
    BEFORE UPDATE ON usuarios 
    FOR EACH ROW 
    EXECUTE FUNCTION update_usuarios_updated_at();

-- ========================================
-- INSERIR DADOS PADRÃO
-- ========================================

-- Limpar dados existentes para evitar conflitos
DELETE FROM tipos_acesso CASCADE;

-- Resetar sequências de ID (apenas se existirem)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_name = 'tipos_acesso_id_seq') THEN
        ALTER SEQUENCE tipos_acesso_id_seq RESTART WITH 1;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_name = 'usuarios_id_seq') THEN
        ALTER SEQUENCE usuarios_id_seq RESTART WITH 1;
    END IF;
END $$;

-- Inserir tipos de acesso padrão
INSERT INTO tipos_acesso (nome, descricao, nivel, ativo) VALUES
('Master', 'Acesso total ao sistema', 1, true),
('Submaster', 'Acesso administrativo limitado', 2, true),
('Parceiro', 'Acesso a funcionalidades específicas', 3, true),
('Colaborador', 'Acesso básico ao sistema', 4, true),
('Operador', 'Acesso operacional', 5, true),
('Visualizador', 'Apenas visualização', 6, true),
('Convidado', 'Acesso limitado', 7, true);

-- ========================================
-- TRIGGERS para atualizar updated_at
-- ========================================

-- Trigger para tipos_acesso
CREATE OR REPLACE FUNCTION update_tipos_acesso_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_tipos_acesso_updated_at 
    BEFORE UPDATE ON tipos_acesso 
    FOR EACH ROW 
    EXECUTE FUNCTION update_tipos_acesso_updated_at();

-- ========================================
-- VIEWS para facilitar consultas
-- ========================================

-- View para usuários com seus perfis e tipos de acesso
CREATE OR REPLACE VIEW usuarios_completos AS
SELECT 
    u.id,
    u.nome,
    u.email,
    u.ativo,
    u.ultimo_acesso,
    u.created_at,
    u.updated_at,
    ta.id as tipo_acesso_id,
    ta.nome as tipo_acesso_nome,
    ta.nivel as tipo_acesso_nivel,
    ta.descricao as tipo_acesso_descricao
FROM usuarios u
LEFT JOIN tipos_acesso ta ON u.tipo_acesso_id = ta.id;

-- ========================================
-- COMENTÁRIOS das tabelas
-- ========================================
COMMENT ON TABLE tipos_acesso IS 'Tabela que define os níveis de acesso do sistema';
COMMENT ON TABLE usuarios IS 'Tabela de usuários do sistema com perfis e tipos de acesso';
COMMENT ON VIEW usuarios_completos IS 'View que combina usuários com seus perfis e tipos de acesso';
