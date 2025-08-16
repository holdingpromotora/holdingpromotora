# 🔧 RESOLVENDO USUÁRIOS PENDENTES QUE NÃO APARECEM

## 🚨 PROBLEMA IDENTIFICADO:

- **2 empresas pendentes** existem na tabela `pessoas_juridicas`
- **Triggers não foram criados** no banco de dados
- **Usuários não foram criados automaticamente** para essas empresas
- **Só aparece 1 usuário** na aba de aprovação
- **❌ NOVO PROBLEMA:** Coluna `senha_hash` tem constraint NOT NULL

## 🛠️ SOLUÇÃO:

### **Passo 1: Corrigir Constraint da Tabela**

1. **Acesse o Supabase** → SQL Editor
2. **Execute primeiro** o script de `src/lib/corrigir_senha_hash.sql`
3. **Confirme** que a coluna `senha_hash` permite NULL

### **Passo 2: Criar Usuários Pendentes**

1. **Após corrigir a constraint**, execute o script de criação
2. **Confirme** que foram criados novos usuários
3. **Verifique** que não há erros de constraint

### **Passo 3: Testar na Aplicação**

1. **Acesse:** `/usuarios/aprovacao`
2. **Verifique se aparecem** as 2 empresas pendentes
3. **Confirme que** podem ser aprovadas/rejeitadas

## 📋 SCRIPT SQL PARA EXECUTAR (PASSO 1):

```sql
-- 1. Verificar estrutura atual
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'usuarios'
  AND column_name = 'senha_hash';

-- 2. Corrigir constraint NOT NULL
ALTER TABLE usuarios ALTER COLUMN senha_hash DROP NOT NULL;

-- 3. Verificar se foi corrigido
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'usuarios'
  AND column_name = 'senha_hash';
```

## 📋 SCRIPT SQL PARA EXECUTAR (PASSO 2):

```sql
-- 4. Criar usuários pendentes (agora sem erro de constraint)
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
SELECT COUNT(*) as total_pendentes FROM usuarios WHERE aprovado = false;
```

## 🎯 RESULTADO ESPERADO:

- **Constraint corrigida:** `senha_hash` permite NULL
- **Total de usuários pendentes:** 3 (1 existente + 2 novos)
- **Empresas pendentes aparecem** na aba de aprovação
- **Sistema funciona** conforme esperado

## ⚠️ IMPORTANTE:

- **Execute os scripts na ordem correta** (primeiro corrigir constraint, depois criar usuários)
- **Verifique o resultado** de cada passo antes de prosseguir
- **Teste na aplicação** após a execução completa

## 🔍 SE HOUVER PROBLEMAS:

1. **Verifique logs** no console do navegador
2. **Confirme** que a constraint foi corrigida
3. **Verifique** permissões do usuário do banco
4. **Execute** os scripts em partes menores se necessário

## 💡 LÓGICA DA SOLUÇÃO:

- **Usuários pendentes** não precisam de senha até serem aprovados
- **Após aprovação**, a senha será definida no processo de ativação
- **Isso resolve** o problema de constraint e permite o fluxo correto
