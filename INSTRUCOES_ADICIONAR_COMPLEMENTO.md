# 🔧 INSTRUÇÕES PARA ADICIONAR CAMPO COMPLEMENTO

## 🎯 Objetivo

Adicionar o campo `complemento` na tabela `clientes_pessoa_juridica` existente no Supabase.

## ⚠️ IMPORTANTE

**Se você ainda não criou as tabelas de clientes, use o arquivo `INSTRUCOES_TABELAS_CLIENTES.md` primeiro.**

**Este arquivo é apenas para quem já tem as tabelas criadas e precisa adicionar o campo complemento.**

## 🔧 Passos para Executar

### 1. Acessar o Supabase

- Vá para [https://supabase.com](https://supabase.com)
- Faça login na sua conta
- Acesse o projeto "holding-promotora"

### 2. Abrir o SQL Editor

- No painel esquerdo, clique em "SQL Editor"
- Clique em "New query" para criar uma nova consulta

### 3. Executar o Script SQL

Cole o seguinte script SQL no editor:

```sql
-- Adicionar campo complemento na tabela clientes_pessoa_juridica
ALTER TABLE clientes_pessoa_juridica
ADD COLUMN IF NOT EXISTS complemento VARCHAR(100);

-- Verificar se o campo foi adicionado
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'clientes_pessoa_juridica'
AND column_name = 'complemento';

-- Comentário do campo
COMMENT ON COLUMN clientes_pessoa_juridica.complemento IS 'Complemento do endereço (apto, sala, etc.)';
```

### 4. Executar a Consulta

- Clique em "Run" para executar o script
- Verifique se não há erros na execução

### 5. Verificar a Estrutura

Para confirmar que o campo foi adicionado, execute:

```sql
-- Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'clientes_pessoa_juridica'
ORDER BY ordinal_position;
```

## ✅ Resultado Esperado

Após a execução, a tabela `clientes_pessoa_juridica` deve ter o campo `complemento` com as seguintes características:

- **Nome:** `complemento`
- **Tipo:** `VARCHAR(100)`
- **Permite NULL:** Sim
- **Valor padrão:** NULL

## 🎉 Pronto!

Agora o campo `complemento` está disponível na tabela e o formulário de cadastro de pessoa jurídica funcionará corretamente com preenchimento automático.
