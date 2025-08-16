-- SOLUÇÃO COMPLETA PARA USUÁRIOS PENDENTES
-- Execute este script completo no Supabase SQL Editor

-- =====================================================
-- PASSO 1: CORRIGIR CONSTRAINT DA TABELA USUARIOS
-- =====================================================

-- 1.1 Verificar estrutura atual da coluna senha_hash
SELECT 
    'ESTRUTURA ATUAL' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
  AND column_name = 'senha_hash';

-- 1.2 Corrigir constraint NOT NULL na coluna senha_hash
ALTER TABLE usuarios ALTER COLUMN senha_hash DROP NOT NULL;

-- 1.3 Verificar se a correção foi aplicada
SELECT 
    'ESTRUTURA CORRIGIDA' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
  AND column_name = 'senha_hash';

-- =====================================================
-- PASSO 2: CRIAR USUÁRIOS PENDENTES PARA EMPRESAS
-- =====================================================

-- 2.1 Verificar empresas pendentes que não têm usuários
SELECT 
    'EMPRESAS PENDENTES SEM USUÁRIOS' as info,
    pj.id,
    pj.razao_social,
    pj.proprietario_email,
    pj.ativo
FROM pessoas_juridicas pj
LEFT JOIN usuarios u ON pj.proprietario_email = u.email
WHERE pj.ativo = false 
  AND u.id IS NULL
  AND pj.proprietario_email IS NOT NULL;

-- 2.2 Criar usuários para empresas jurídicas pendentes
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

-- =====================================================
-- PASSO 3: CRIAR USUÁRIOS PENDENTES PARA PESSOAS FÍSICAS
-- =====================================================

-- 3.1 Verificar pessoas físicas pendentes que não têm usuários
SELECT 
    'PESSOAS FÍSICAS PENDENTES SEM USUÁRIOS' as info,
    pf.id,
    pf.nome,
    pf.email,
    pf.ativo
FROM pessoas_fisicas pf
LEFT JOIN usuarios u ON pf.email = u.email
WHERE pf.ativo = false 
  AND u.id IS NULL
  AND pf.email IS NOT NULL;

-- 3.2 Criar usuários para pessoas físicas pendentes
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

-- =====================================================
-- PASSO 4: VERIFICAR RESULTADO FINAL
-- =====================================================

-- 4.1 Total de usuários pendentes
SELECT 
    'RESULTADO FINAL' as info,
    COUNT(*) as total_usuarios_pendentes
FROM usuarios 
WHERE aprovado = false;

-- 4.2 Lista completa de usuários pendentes
SELECT 
    'LISTA DE USUÁRIOS PENDENTES' as info,
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

-- 4.3 Resumo por tipo
SELECT 
    'RESUMO POR TIPO' as info,
    CASE 
        WHEN u.email IN (SELECT proprietario_email FROM pessoas_juridicas) THEN 'Pessoa Jurídica'
        WHEN u.email IN (SELECT email FROM pessoas_fisicas) THEN 'Pessoa Física'
        ELSE 'Sistema'
    END as tipo_pessoa,
    COUNT(*) as quantidade
FROM usuarios u
WHERE u.aprovado = false
GROUP BY 
    CASE 
        WHEN u.email IN (SELECT proprietario_email FROM pessoas_juridicas) THEN 'Pessoa Jurídica'
        WHEN u.email IN (SELECT email FROM pessoas_fisicas) THEN 'Pessoa Física'
        ELSE 'Sistema'
    END;

-- =====================================================
-- MENSAGEM DE SUCESSO
-- =====================================================
SELECT 
    '✅ SCRIPT EXECUTADO COM SUCESSO!' as mensagem,
    'Agora acesse /usuarios/aprovacao para ver os usuários pendentes' as proximo_passo;
