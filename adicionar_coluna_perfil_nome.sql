-- Script para adicionar a coluna perfil_nome na tabela usuarios
-- Execute este script no SQL Editor do Supabase

-- 1. Adicionar a coluna perfil_nome
ALTER TABLE usuarios 
ADD COLUMN perfil_nome VARCHAR(255);

-- 2. Atualizar registros existentes com o nome do perfil baseado no tipo_acesso_id
UPDATE usuarios 
SET perfil_nome = (
  SELECT ta.nome 
  FROM tipos_acesso ta 
  WHERE ta.id = usuarios.tipo_acesso_id
)
WHERE tipo_acesso_id IS NOT NULL;

-- 3. Para usuários sem tipo_acesso_id, definir como 'N/A'
UPDATE usuarios 
SET perfil_nome = 'N/A' 
WHERE tipo_acesso_id IS NULL;

-- 4. Verificar se a coluna foi criada e populada
SELECT 
  id, 
  nome, 
  email, 
  tipo_acesso_id, 
  perfil_nome,
  ativo
FROM usuarios 
LIMIT 10;

-- 5. Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
ORDER BY ordinal_position;
