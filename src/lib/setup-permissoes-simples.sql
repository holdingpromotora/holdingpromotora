-- Script simplificado para setup das permissões
-- Execute este script no SQL Editor do Supabase

-- 1. Criar tabela de tipos de acesso (se não existir)
CREATE TABLE IF NOT EXISTS tipos_acesso (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    nivel INTEGER NOT NULL CHECK (nivel >= 1 AND nivel <= 10),
    cor VARCHAR(50) DEFAULT 'bg-blue-600',
    icone VARCHAR(100) DEFAULT 'Shield',
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Criar tabela de permissões (se não existir)
CREATE TABLE IF NOT EXISTS permissoes (
    id VARCHAR(100) PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(50),
    acao VARCHAR(50),
    recurso VARCHAR(100),
    ativo BOOLEAN DEFAULT true,
    nivel_minimo INTEGER DEFAULT 6,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Criar tabela de níveis de acesso (se não existir)
CREATE TABLE IF NOT EXISTS niveis_acesso (
    id SERIAL PRIMARY KEY,
    tipo_acesso_id INTEGER REFERENCES tipos_acesso(id) ON DELETE CASCADE,
    permissoes TEXT[] DEFAULT '{}',
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Adicionar colunas na tabela usuarios (se não existirem)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'tipo_acesso_id') THEN
        ALTER TABLE usuarios ADD COLUMN tipo_acesso_id INTEGER REFERENCES tipos_acesso(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'permissoes_especiais') THEN
        ALTER TABLE usuarios ADD COLUMN permissoes_especiais TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- 5. Inserir tipos de acesso básicos (apenas se não existirem)
INSERT INTO tipos_acesso (nome, descricao, nivel, cor, icone) 
SELECT * FROM (VALUES
    ('Master', 'Acesso total ao sistema', 1, 'bg-red-600', 'Shield'),
    ('Administrador', 'Acesso administrativo completo', 2, 'bg-purple-600', 'Shield'),
    ('Gerente', 'Acesso gerencial com limitações', 3, 'bg-blue-600', 'Shield'),
    ('Operador', 'Acesso operacional básico', 5, 'bg-green-600', 'Shield'),
    ('Visualizador', 'Acesso apenas para visualização', 6, 'bg-amber-600', 'Eye')
) AS v(nome, descricao, nivel, cor, icone)
WHERE NOT EXISTS (SELECT 1 FROM tipos_acesso WHERE tipos_acesso.nome = v.nome);

-- 6. Inserir permissões básicas (apenas se não existirem)
INSERT INTO permissoes (id, nome, descricao, categoria, acao, recurso, nivel_minimo) 
SELECT * FROM (VALUES
    ('dashboard_view', 'Visualizar Dashboard', 'Acesso ao painel principal', 'dashboard', 'visualizar', 'dashboard', 6),
    ('usuarios_view', 'Visualizar Usuários', 'Ver lista de usuários', 'usuarios', 'visualizar', 'usuarios', 6),
    ('cadastros_view', 'Visualizar Cadastros', 'Ver cadastros', 'cadastros', 'visualizar', 'cadastros', 6),
    ('cadastros_create', 'Criar Cadastros', 'Criar novos cadastros', 'cadastros', 'criar', 'cadastros', 5)
) AS v(id, nome, descricao, categoria, acao, recurso, nivel_minimo)
WHERE NOT EXISTS (SELECT 1 FROM permissoes WHERE permissoes.id = v.id);

-- 7. Inserir nível de acesso básico (apenas se não existir)
INSERT INTO niveis_acesso (tipo_acesso_id, permissoes) 
SELECT * FROM (VALUES
    (6, ARRAY['dashboard_view', 'usuarios_view', 'cadastros_view'])
) AS v(tipo_acesso_id, permissoes)
WHERE NOT EXISTS (SELECT 1 FROM niveis_acesso WHERE niveis_acesso.tipo_acesso_id = v.tipo_acesso_id);

-- 8. Verificar se tudo foi criado
SELECT 
    'tipos_acesso' as tabela,
    COUNT(*) as registros
FROM tipos_acesso
UNION ALL
SELECT 
    'permissoes' as tabela,
    COUNT(*) as registros
FROM permissoes
UNION ALL
SELECT 
    'niveis_acesso' as tabela,
    COUNT(*) as registros
FROM niveis_acesso;
