-- Sistema de Permissões e Níveis de Acesso
-- Holding Promotora

-- Tabela de Tipos de Acesso
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

-- Tabela de Permissões
CREATE TABLE IF NOT EXISTS permissoes (
    id VARCHAR(100) PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(50) NOT NULL CHECK (
        categoria IN (
            'usuarios', 'sistema', 'relatorios', 'proprios', 
            'financeiro', 'marketing', 'cadastros', 'dashboard'
        )
    ),
    acao VARCHAR(50) NOT NULL CHECK (
        acao IN (
            'visualizar', 'criar', 'editar', 'excluir', 
            'gerenciar', 'aprovar', 'rejeitar', 'exportar'
        )
    ),
    recurso VARCHAR(100) NOT NULL,
    ativo BOOLEAN DEFAULT true,
    nivel_minimo INTEGER NOT NULL DEFAULT 6,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Níveis de Acesso (relaciona tipos com permissões)
CREATE TABLE IF NOT EXISTS niveis_acesso (
    id SERIAL PRIMARY KEY,
    tipo_acesso_id INTEGER NOT NULL REFERENCES tipos_acesso(id) ON DELETE CASCADE,
    permissoes TEXT[] NOT NULL DEFAULT '{}',
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Usuários (atualizada para incluir tipo de acesso)
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS tipo_acesso_id INTEGER REFERENCES tipos_acesso(id);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS permissoes_especiais TEXT[] DEFAULT '{}';

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_tipos_acesso_nivel ON tipos_acesso(nivel);
CREATE INDEX IF NOT EXISTS idx_tipos_acesso_ativo ON tipos_acesso(ativo);
CREATE INDEX IF NOT EXISTS idx_permissoes_categoria ON permissoes(categoria);
CREATE INDEX IF NOT EXISTS idx_permissoes_acao ON permissoes(acao);
CREATE INDEX IF NOT EXISTS idx_permissoes_ativo ON permissoes(ativo);
CREATE INDEX IF NOT EXISTS idx_permissoes_nivel_minimo ON permissoes(nivel_minimo);
CREATE INDEX IF NOT EXISTS idx_niveis_acesso_tipo ON niveis_acesso(tipo_acesso_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_tipo_acesso ON usuarios(tipo_acesso_id);

-- Triggers para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers apenas se não existirem
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_tipos_acesso_updated_at') THEN
        CREATE TRIGGER update_tipos_acesso_updated_at 
            BEFORE UPDATE ON tipos_acesso 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_permissoes_updated_at') THEN
        CREATE TRIGGER update_permissoes_updated_at 
            BEFORE UPDATE ON permissoes 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_niveis_acesso_updated_at') THEN
        CREATE TRIGGER update_niveis_acesso_updated_at 
            BEFORE UPDATE ON niveis_acesso 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Inserir tipos de acesso padrão (apenas se não existirem)
INSERT INTO tipos_acesso (nome, descricao, nivel, cor, icone) 
SELECT * FROM (VALUES
    ('Master', 'Acesso total ao sistema', 1, 'bg-red-600', 'Shield'),
    ('Administrador', 'Acesso administrativo completo', 2, 'bg-purple-600', 'Shield'),
    ('Gerente', 'Acesso gerencial com limitações', 3, 'bg-blue-600', 'Shield'),
    ('Supervisor', 'Acesso de supervisão', 4, 'bg-indigo-600', 'Shield'),
    ('Operador', 'Acesso operacional básico', 5, 'bg-green-600', 'Shield'),
    ('Visualizador', 'Acesso apenas para visualização', 6, 'bg-amber-600', 'Eye'),
    ('Convidado', 'Acesso limitado para convidados', 7, 'bg-gray-600', 'User')
) AS v(nome, descricao, nivel, cor, icone)
WHERE NOT EXISTS (SELECT 1 FROM tipos_acesso WHERE tipos_acesso.nome = v.nome);

-- Inserir permissões padrão do sistema (apenas se não existirem)
INSERT INTO permissoes (id, nome, descricao, categoria, acao, recurso, nivel_minimo) 
SELECT * FROM (VALUES
-- Dashboard
('dashboard_view', 'Visualizar Dashboard', 'Acesso ao painel principal do sistema', 'dashboard', 'visualizar', 'dashboard', 6),

-- Usuários
('usuarios_view', 'Visualizar Usuários', 'Ver lista de usuários do sistema', 'usuarios', 'visualizar', 'usuarios', 6),
('usuarios_create', 'Criar Usuários', 'Criar novos usuários no sistema', 'usuarios', 'criar', 'usuarios', 5),
('usuarios_edit', 'Editar Usuários', 'Modificar usuários existentes', 'usuarios', 'editar', 'usuarios', 5),
('usuarios_delete', 'Excluir Usuários', 'Remover usuários do sistema', 'usuarios', 'excluir', 'usuarios', 4),
('usuarios_manage', 'Gerenciar Usuários', 'Controle total sobre usuários', 'usuarios', 'gerenciar', 'usuarios', 3),

-- Cadastros
('cadastros_view', 'Visualizar Cadastros', 'Ver cadastros de pessoas físicas e jurídicas', 'cadastros', 'visualizar', 'cadastros', 6),
('cadastros_create', 'Criar Cadastros', 'Criar novos cadastros', 'cadastros', 'criar', 'cadastros', 5),
('cadastros_edit', 'Editar Cadastros', 'Modificar cadastros existentes', 'cadastros', 'editar', 'cadastros', 5),
('cadastros_delete', 'Excluir Cadastros', 'Remover cadastros do sistema', 'cadastros', 'excluir', 'cadastros', 4),
('cadastros_manage', 'Gerenciar Cadastros', 'Controle total sobre cadastros', 'cadastros', 'gerenciar', 'cadastros', 3),

-- Sistema
('sistema_config', 'Configurar Sistema', 'Acessar configurações do sistema', 'sistema', 'gerenciar', 'sistema', 2),
('sistema_logs', 'Visualizar Logs', 'Acessar logs do sistema', 'sistema', 'visualizar', 'logs', 3),
('sistema_backup', 'Gerenciar Backups', 'Criar e restaurar backups', 'sistema', 'gerenciar', 'backup', 2),

-- Relatórios
('relatorios_view', 'Visualizar Relatórios', 'Acessar relatórios do sistema', 'relatorios', 'visualizar', 'relatorios', 6),
('relatorios_create', 'Criar Relatórios', 'Gerar novos relatórios', 'relatorios', 'criar', 'relatorios', 5),
('relatorios_export', 'Exportar Relatórios', 'Exportar dados em diferentes formatos', 'relatorios', 'exportar', 'relatorios', 5),
('relatorios_manage', 'Gerenciar Relatórios', 'Controle total sobre relatórios', 'relatorios', 'gerenciar', 'relatorios', 3),

-- Registros Próprios
('proprios_view', 'Visualizar Próprios', 'Ver apenas registros criados por si', 'proprios', 'visualizar', 'proprios', 6),
('proprios_edit', 'Editar Próprios', 'Modificar apenas registros criados por si', 'proprios', 'editar', 'proprios', 5),
('proprios_delete', 'Excluir Próprios', 'Remover apenas registros criados por si', 'proprios', 'excluir', 'proprios', 5),
('proprios_manage', 'Gerenciar Próprios', 'Controle total sobre registros criados por si', 'proprios', 'gerenciar', 'proprios', 5),

-- Financeiro
('financeiro_view', 'Visualizar Financeiro', 'Ver informações financeiras', 'financeiro', 'visualizar', 'financeiro', 3),
('financeiro_edit', 'Editar Financeiro', 'Modificar dados financeiros', 'financeiro', 'editar', 'financeiro', 2),
('financeiro_manage', 'Gerenciar Financeiro', 'Controle total sobre finanças', 'financeiro', 'gerenciar', 'financeiro', 2),

-- Marketing
('marketing_view', 'Visualizar Marketing', 'Ver campanhas de marketing', 'marketing', 'visualizar', 'marketing', 4),
('marketing_create', 'Criar Marketing', 'Criar novas campanhas', 'marketing', 'criar', 'marketing', 3),
('marketing_edit', 'Editar Marketing', 'Modificar campanhas existentes', 'marketing', 'editar', 'marketing', 3),
('marketing_manage', 'Gerenciar Marketing', 'Controle total sobre marketing', 'marketing', 'gerenciar', 'marketing', 3)
) AS v(id, nome, descricao, categoria, acao, recurso, nivel_minimo)
WHERE NOT EXISTS (SELECT 1 FROM permissoes WHERE permissoes.id = v.id);

-- Inserir níveis de acesso padrão (apenas se não existirem)
INSERT INTO niveis_acesso (tipo_acesso_id, permissoes) 
SELECT * FROM (VALUES
-- Master - Todas as permissões
(1, ARRAY[
    'dashboard_view', 'usuarios_view', 'usuarios_create', 'usuarios_edit', 'usuarios_delete', 'usuarios_manage',
    'cadastros_view', 'cadastros_create', 'cadastros_edit', 'cadastros_delete', 'cadastros_manage',
    'sistema_config', 'sistema_logs', 'sistema_backup',
    'relatorios_view', 'relatorios_create', 'relatorios_export', 'relatorios_manage',
    'proprios_view', 'proprios_edit', 'proprios_delete', 'proprios_manage',
    'financeiro_view', 'financeiro_edit', 'financeiro_manage',
    'marketing_view', 'marketing_create', 'marketing_edit', 'marketing_manage'
]),

-- Administrador - Todas exceto algumas do sistema
(2, ARRAY[
    'dashboard_view', 'usuarios_view', 'usuarios_create', 'usuarios_edit', 'usuarios_delete', 'usuarios_manage',
    'cadastros_view', 'cadastros_create', 'cadastros_edit', 'cadastros_delete', 'cadastros_manage',
    'sistema_config', 'sistema_logs',
    'relatorios_view', 'relatorios_create', 'relatorios_export', 'relatorios_manage',
    'proprios_view', 'proprios_edit', 'proprios_delete', 'proprios_manage',
    'financeiro_view', 'financeiro_edit', 'financeiro_manage',
    'marketing_view', 'marketing_create', 'marketing_edit', 'marketing_manage'
]),

-- Gerente - Acesso gerencial
(3, ARRAY[
    'dashboard_view', 'usuarios_view', 'usuarios_create', 'usuarios_edit',
    'cadastros_view', 'cadastros_create', 'cadastros_edit',
    'sistema_logs',
    'relatorios_view', 'relatorios_create', 'relatorios_export',
    'proprios_view', 'proprios_edit', 'proprios_delete', 'proprios_manage',
    'financeiro_view',
    'marketing_view', 'marketing_create', 'marketing_edit'
]),

-- Supervisor - Acesso de supervisão
(4, ARRAY[
    'dashboard_view', 'usuarios_view',
    'cadastros_view', 'cadastros_create', 'cadastros_edit',
    'relatorios_view', 'relatorios_create',
    'proprios_view', 'proprios_edit', 'proprios_delete', 'proprios_manage',
    'marketing_view'
]),

-- Operador - Acesso operacional
(5, ARRAY[
    'dashboard_view',
    'cadastros_view', 'cadastros_create', 'cadastros_edit',
    'relatorios_view',
    'proprios_view', 'proprios_edit', 'proprios_delete', 'proprios_manage'
]),

-- Visualizador - Apenas visualização
(6, ARRAY[
    'dashboard_view',
    'cadastros_view',
    'relatorios_view',
    'proprios_view'
]),

-- Convidado - Acesso mínimo
(7, ARRAY[
    'dashboard_view'
])
) AS v(tipo_acesso_id, permissoes)
WHERE NOT EXISTS (SELECT 1 FROM niveis_acesso WHERE niveis_acesso.tipo_acesso_id = v.tipo_acesso_id);

-- Atualizar usuários existentes para usar o sistema de permissões (apenas se necessário)
UPDATE usuarios 
SET tipo_acesso_id = CASE 
    WHEN nivel_acesso = 'admin' THEN 2
    WHEN nivel_acesso = 'gerente' THEN 3
    WHEN nivel_acesso = 'operador' THEN 5
    WHEN nivel_acesso = 'visualizador' THEN 6
    ELSE 6
END
WHERE tipo_acesso_id IS NULL 
AND EXISTS (SELECT 1 FROM tipos_acesso WHERE id IN (2, 3, 5, 6));

-- Função para obter permissões de um usuário
CREATE OR REPLACE FUNCTION get_user_permissions(user_id INTEGER)
RETURNS TABLE (
    permissao_id VARCHAR(100),
    nome VARCHAR(200),
    descricao TEXT,
    categoria VARCHAR(50),
    acao VARCHAR(50),
    recurso VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.nome,
        p.descricao,
        p.categoria,
        p.acao,
        p.recurso
    FROM usuarios u
    JOIN tipos_acesso ta ON u.tipo_acesso_id = ta.id
    JOIN niveis_acesso na ON ta.id = na.tipo_acesso_id
    JOIN permissoes p ON p.id = ANY(na.permissoes)
    WHERE u.id = user_id 
    AND u.ativo = true 
    AND ta.ativo = true 
    AND na.ativo = true 
    AND p.ativo = true
    AND p.nivel_minimo <= ta.nivel;
END;
$$ LANGUAGE plpgsql;

-- Função para verificar se usuário tem permissão específica
CREATE OR REPLACE FUNCTION has_user_permission(user_id INTEGER, permission_id VARCHAR(100))
RETURNS BOOLEAN AS $$
DECLARE
    has_permission BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM get_user_permissions(user_id) 
        WHERE permissao_id = permission_id
    ) INTO has_permission;
    
    RETURN has_permission;
END;
$$ LANGUAGE plpgsql;

-- Função para verificar permissão por categoria e ação
CREATE OR REPLACE FUNCTION has_user_permission_action(
    user_id INTEGER, 
    categoria_param VARCHAR(50), 
    acao_param VARCHAR(50)
)
RETURNS BOOLEAN AS $$
DECLARE
    has_permission BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM get_user_permissions(user_id) 
        WHERE categoria = categoria_param AND acao = acao_param
    ) INTO has_permission;
    
    RETURN has_permission;
END;
$$ LANGUAGE plpgsql;

-- Comentários das tabelas
COMMENT ON TABLE tipos_acesso IS 'Tipos de acesso disponíveis no sistema';
COMMENT ON TABLE permissoes IS 'Permissões específicas que podem ser atribuídas';
COMMENT ON TABLE niveis_acesso IS 'Relacionamento entre tipos de acesso e permissões';
COMMENT ON TABLE usuarios IS 'Usuários do sistema com suas permissões';

-- Comentários das colunas
COMMENT ON COLUMN tipos_acesso.nivel IS 'Nível hierárquico (1 = maior, 10 = menor)';
COMMENT ON COLUMN permissoes.nivel_minimo IS 'Nível mínimo necessário para ter esta permissão';
COMMENT ON COLUMN permissoes.categoria IS 'Categoria da permissão para organização';
COMMENT ON COLUMN permissoes.acao IS 'Ação que a permissão permite executar';
COMMENT ON COLUMN permissoes.recurso IS 'Recurso sobre o qual a ação pode ser executada';
