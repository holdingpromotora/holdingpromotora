-- Script para corrigir o problema da constraint NOT NULL na coluna senha_hash
-- Execute este script no Supabase SQL Editor

-- 1. Verificar a estrutura atual da tabela usuarios
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
  AND column_name = 'senha_hash';

-- 2. Alterar a coluna senha_hash para permitir NULL (usuários pendentes não têm senha ainda)
ALTER TABLE usuarios ALTER COLUMN senha_hash DROP NOT NULL;

-- 3. Verificar se a alteração foi aplicada
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
  AND column_name = 'senha_hash';

-- 4. Agora criar usuários pendentes sem senha
INSERT INTO usuarios (nome, email, aprovado, ativo, perfil_id, data_cadastro)
SELECT 
    pj.razao_social as nome,
    pj.proprietario_email as email,
    false as aprovado,
    false as ativo,
    null as perfil_id,
    NOW() as data_cadastro
FROM pessoas_juridicas pj
LEFT JOIN usuarios u ON pj.proprietario_email = u.email
WHERE pj.ativo = false 
  AND u.id IS NULL
  AND pj.proprietario_email IS NOT NULL;

-- 5. Verificar resultado
SELECT 
    'Usuários pendentes criados' as status,
    COUNT(*) as total
FROM usuarios 
WHERE aprovado = false;

-- 6. Listar usuários pendentes
SELECT 
    id,
    nome,
    email,
    aprovado,
    ativo,
    perfil_id,
    data_cadastro,
    CASE 
        WHEN senha_hash IS NULL THEN 'Sem senha (pendente)'
        ELSE 'Com senha'
    END as status_senha
FROM usuarios 
WHERE aprovado = false
ORDER BY data_cadastro DESC;
