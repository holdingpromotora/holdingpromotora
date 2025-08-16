-- Script para criar usuários pendentes para empresas existentes
-- Execute este script no Supabase SQL Editor

-- 1. Criar usuários para empresas jurídicas pendentes que não têm usuários
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

-- 2. Criar usuários para pessoas físicas pendentes que não têm usuários
INSERT INTO usuarios (nome, email, aprovado, ativo, perfil_id, data_cadastro)
SELECT 
    pf.nome as nome,
    pf.email as email,
    false as aprovado,
    false as ativo,
    null as perfil_id,
    NOW() as data_cadastro
FROM pessoas_fisicas pf
LEFT JOIN usuarios u ON pf.email = u.email
WHERE pf.ativo = false 
  AND u.id IS NULL
  AND pf.email IS NOT NULL;

-- 3. Verificar resultado
SELECT 
    'Usuários criados' as status,
    COUNT(*) as total
FROM usuarios 
WHERE aprovado = false;

-- 4. Listar usuários pendentes
SELECT 
    id,
    nome,
    email,
    aprovado,
    ativo,
    perfil_id,
    data_cadastro
FROM usuarios 
WHERE aprovado = false
ORDER BY data_cadastro DESC;
