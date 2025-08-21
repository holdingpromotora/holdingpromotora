-- 🚀 LIBERAR ACESSO MASTER - Holding Promotora
-- Usuário: grupoarmandogomes@gmail.com
-- Senha: @252980Hol
-- Acesso: Master com todas as permissões

-- 1. Verificar se a tabela usuarios existe, se não, criar
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    nivel_acesso VARCHAR(20) NOT NULL CHECK (nivel_acesso IN ('admin', 'gerente', 'operador', 'visualizador', 'master')),
    ativo BOOLEAN DEFAULT true,
    ultimo_acesso TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Verificar se a tabela tipos_acesso existe, se não, criar
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

-- 3. Verificar se a tabela permissoes existe, se não, criar
CREATE TABLE IF NOT EXISTS permissoes (
    id VARCHAR(100) PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(50) NOT NULL CHECK (
        categoria IN (
            'usuarios', 'sistema', 'relatorios', 'proprios', 
            'financeiro', 'marketing', 'cadastros', 'dashboard',
            'clientes', 'aprovacoes', 'configuracoes'
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
    nivel_minimo INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Verificar se a tabela niveis_acesso existe, se não, criar
CREATE TABLE IF NOT EXISTS niveis_acesso (
    id SERIAL PRIMARY KEY,
    tipo_acesso_id INTEGER NOT NULL REFERENCES tipos_acesso(id) ON DELETE CASCADE,
    permissoes TEXT[] NOT NULL DEFAULT '{}',
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Adicionar colunas se não existirem na tabela usuarios
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS tipo_acesso_id INTEGER REFERENCES tipos_acesso(id);
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS permissoes_especiais TEXT[] DEFAULT '{}';

-- 6. Criar tipo de acesso MASTER se não existir
INSERT INTO tipos_acesso (nome, descricao, nivel, cor, icone) 
VALUES ('MASTER', 'Usuário com acesso total ao sistema', 10, 'bg-red-600', 'Crown')
ON CONFLICT (nome) DO UPDATE SET 
    descricao = 'Usuário com acesso total ao sistema',
    nivel = 10,
    cor = 'bg-red-600',
    icone = 'Crown';

-- 7. Inserir ou atualizar usuário master
INSERT INTO usuarios (nome, email, senha_hash, nivel_acesso, tipo_acesso_id) 
VALUES (
    'Armando Gomes - Master', 
    'grupoarmandogomes@gmail.com', 
    '@252980Hol', 
    'master',
    (SELECT id FROM tipos_acesso WHERE nome = 'MASTER')
)
ON CONFLICT (email) DO UPDATE SET 
    nome = 'Armando Gomes - Master',
    senha_hash = '@252980Hol',
    nivel_acesso = 'master',
    tipo_acesso_id = (SELECT id FROM tipos_acesso WHERE nome = 'MASTER'),
    ativo = true,
    updated_at = CURRENT_TIMESTAMP;

-- 8. Inserir todas as permissões disponíveis se não existirem
INSERT INTO permissoes (id, nome, descricao, categoria, acao, recurso, nivel_minimo) VALUES
-- Usuários
('usuarios_visualizar', 'Visualizar Usuários', 'Pode visualizar lista de usuários', 'usuarios', 'visualizar', 'usuarios', 1),
('usuarios_criar', 'Criar Usuários', 'Pode criar novos usuários', 'usuarios', 'criar', 'usuarios', 1),
('usuarios_editar', 'Editar Usuários', 'Pode editar usuários existentes', 'usuarios', 'editar', 'usuarios', 1),
('usuarios_excluir', 'Excluir Usuários', 'Pode excluir usuários', 'usuarios', 'excluir', 'usuarios', 1),
('usuarios_gerenciar', 'Gerenciar Usuários', 'Pode gerenciar configurações de usuários', 'usuarios', 'gerenciar', 'usuarios', 1),
('usuarios_proprios', 'Registros Próprios', 'Pode gerenciar apenas seus próprios registros', 'usuarios', 'gerenciar', 'usuarios', 1),

-- Clientes
('clientes_visualizar', 'Visualizar Clientes', 'Pode visualizar lista de clientes', 'clientes', 'visualizar', 'clientes', 1),
('clientes_criar', 'Criar Clientes', 'Pode criar novos clientes', 'clientes', 'criar', 'clientes', 1),
('clientes_editar', 'Editar Clientes', 'Pode editar clientes existentes', 'clientes', 'editar', 'clientes', 1),
('clientes_excluir', 'Excluir Clientes', 'Pode excluir clientes', 'clientes', 'excluir', 'clientes', 1),
('clientes_gerenciar', 'Gerenciar Clientes', 'Pode gerenciar configurações de clientes', 'clientes', 'gerenciar', 'clientes', 1),
('clientes_proprios', 'Registros Próprios', 'Pode gerenciar apenas seus próprios registros', 'clientes', 'gerenciar', 'clientes', 1),

-- Sistema
('sistema_visualizar', 'Visualizar Sistema', 'Pode visualizar configurações do sistema', 'sistema', 'visualizar', 'sistema', 1),
('sistema_configurar', 'Configurar Sistema', 'Pode alterar configurações do sistema', 'sistema', 'gerenciar', 'sistema', 1),
('sistema_manutencao', 'Manutenção Sistema', 'Pode executar tarefas de manutenção', 'sistema', 'gerenciar', 'sistema', 1),

-- Dashboard
('dashboard_visualizar', 'Visualizar Dashboard', 'Pode acessar o dashboard principal', 'dashboard', 'visualizar', 'dashboard', 1),
('dashboard_estatisticas', 'Estatísticas Dashboard', 'Pode visualizar estatísticas avançadas', 'dashboard', 'visualizar', 'dashboard', 1),
('dashboard_exportar', 'Exportar Dashboard', 'Pode exportar dados do dashboard', 'dashboard', 'exportar', 'dashboard', 1),

-- Relatórios
('relatorios_visualizar', 'Visualizar Relatórios', 'Pode visualizar relatórios', 'relatorios', 'visualizar', 'relatorios', 1),
('relatorios_criar', 'Criar Relatórios', 'Pode criar novos relatórios', 'relatorios', 'criar', 'relatorios', 1),
('relatorios_exportar', 'Exportar Relatórios', 'Pode exportar relatórios', 'relatorios', 'exportar', 'relatorios', 1),

-- Aprovações
('aprovacoes_visualizar', 'Visualizar Aprovações', 'Pode visualizar solicitações de aprovação', 'aprovacoes', 'visualizar', 'aprovacoes', 1),
('aprovacoes_aprovar', 'Aprovar Solicitações', 'Pode aprovar solicitações', 'aprovacoes', 'aprovar', 'aprovacoes', 1),
('aprovacoes_rejeitar', 'Rejeitar Solicitações', 'Pode rejeitar solicitações', 'aprovacoes', 'rejeitar', 'aprovacoes', 1),

-- Configurações
('configuracoes_visualizar', 'Visualizar Configurações', 'Pode visualizar configurações', 'configuracoes', 'visualizar', 'configuracoes', 1),
('configuracoes_alterar', 'Alterar Configurações', 'Pode alterar configurações', 'configuracoes', 'gerenciar', 'configuracoes', 1)
ON CONFLICT (id) DO NOTHING;

-- 9. Criar nível de acesso MASTER com todas as permissões
INSERT INTO niveis_acesso (tipo_acesso_id, permissoes) 
VALUES (
    (SELECT id FROM tipos_acesso WHERE nome = 'MASTER'),
    ARRAY(
        SELECT id FROM permissoes WHERE ativo = true
    )
)
ON CONFLICT (tipo_acesso_id) DO UPDATE SET 
    permissoes = ARRAY(
        SELECT id FROM permissoes WHERE ativo = true
    ),
    updated_at = CURRENT_TIMESTAMP;

-- 10. Atualizar usuário master com permissões especiais
UPDATE usuarios 
SET permissoes_especiais = ARRAY(
    SELECT id FROM permissoes WHERE ativo = true
)
WHERE email = 'grupoarmandogomes@gmail.com';

-- 11. Verificar se tudo foi criado corretamente
SELECT 
    'Usuário Master criado/atualizado:' as status,
    u.nome,
    u.email,
    u.nivel_acesso,
    u.ativo,
    COUNT(p.id) as total_permissoes
FROM usuarios u
LEFT JOIN permissoes p ON p.ativo = true
WHERE u.email = 'grupoarmandogomes@gmail.com'
GROUP BY u.id, u.nome, u.email, u.nivel_acesso, u.ativo;

-- 12. Mostrar todas as permissões disponíveis
SELECT 
    'Permissões disponíveis:' as info,
    COUNT(*) as total
FROM permissoes 
WHERE ativo = true;

-- 13. Mostrar tipos de acesso criados
SELECT 
    'Tipos de acesso:' as info,
    nome,
    nivel,
    ativo
FROM tipos_acesso 
ORDER BY nivel DESC;
