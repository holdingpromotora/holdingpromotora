-- 🚀 LIBERAR USUÁRIOS JÁ CADASTRADOS - Holding Promotora
-- Script para ativar todos os usuários existentes no sistema

-- 1. Verificar usuários existentes
SELECT 
    'Usuários existentes:' as info,
    COUNT(*) as total
FROM usuarios;

-- 2. Ativar todos os usuários cadastrados
UPDATE usuarios 
SET ativo = true 
WHERE ativo = false;

-- 3. Verificar usuários sem tipo de acesso
SELECT 
    'Usuários sem tipo de acesso:' as info,
    COUNT(*) as total
FROM usuarios 
WHERE tipo_acesso_id IS NULL;

-- 4. Atribuir tipo de acesso padrão para usuários sem tipo
UPDATE usuarios 
SET tipo_acesso_id = (
    SELECT id FROM tipos_acesso WHERE nome = 'Convidado' LIMIT 1
)
WHERE tipo_acesso_id IS NULL;

-- 5. Verificar se existe tipo 'Convidado', se não, criar
INSERT INTO tipos_acesso (nome, descricao, nivel, cor, icone) 
VALUES ('Convidado', 'Usuário com acesso básico ao sistema', 7, 'bg-blue-600', 'User')
ON CONFLICT (nome) DO NOTHING;

-- 6. Criar nível de acesso padrão para usuários sem nível
INSERT INTO niveis_acesso (tipo_acesso_id, permissoes) 
SELECT 
    ta.id,
    ARRAY[
        'dashboard_visualizar',
        'usuarios_visualizar',
        'clientes_visualizar'
    ]
FROM tipos_acesso ta 
WHERE ta.nome = 'Convidado'
AND NOT EXISTS (
    SELECT 1 FROM niveis_acesso na WHERE na.tipo_acesso_id = ta.id
);

-- 7. Verificar status final dos usuários
SELECT 
    'Status final dos usuários:' as info,
    u.nome,
    u.email,
    u.ativo,
    ta.nome as tipo_acesso,
    ta.nivel as nivel_acesso
FROM usuarios u
LEFT JOIN tipos_acesso ta ON u.tipo_acesso_id = ta.id
ORDER BY ta.nivel DESC, u.nome;

-- 8. Contagem final
SELECT 
    'Resumo final:' as info,
    COUNT(*) as total_usuarios,
    COUNT(CASE WHEN u.ativo = true THEN 1 END) as usuarios_ativos,
    COUNT(CASE WHEN u.tipo_acesso_id IS NOT NULL THEN 1 END) as usuarios_com_tipo_acesso
FROM usuarios u;
