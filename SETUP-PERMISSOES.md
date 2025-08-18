# 🔧 Setup das Permissões - Supabase

## ❌ **Problema Identificado:**

O sistema está apresentando erros 404 porque a tabela `permissoes` não existe no banco de dados.

## ✅ **Solução:**

### **Opção 1: Via Painel do Supabase (Recomendado)**

1. **Acesse o Supabase:**
   - Vá para [https://supabase.com](https://supabase.com)
   - Faça login na sua conta
   - Acesse o projeto da Holding Promotora

2. **SQL Editor:**
   - No menu lateral, clique em **"SQL Editor"**
   - Clique em **"New Query"**

3. **Execute o Script:**
   - Copie e cole o conteúdo do arquivo `src/lib/setup-permissoes-simples.sql`
   - Clique em **"Run"**

### **Opção 2: Via Linha de Comando**

```bash
# Navegar para o projeto
cd holding-promotora

# Executar script de setup
npm run setup-db

# Ou executar diretamente
node scripts/setup-database.js
```

### **Opção 3: Via API (Teste)**

```bash
# Fazer POST para a API de setup
curl -X POST http://localhost:3001/api/setup-permissoes
```

## 📋 **Arquivos SQL Necessários:**

1. **`setup-permissoes-simples.sql`** - Script simplificado e seguro (RECOMENDADO)
2. **`permissoes.sql`** - Script completo (use apenas se necessário)
3. **`database.sql`** - Estrutura básica do banco
4. **`usuarios.sql`** - Tabela de usuários

## 🚀 **Após a Execução:**

- ✅ Erros 404 serão resolvidos
- ✅ Sistema de permissões funcionará
- ✅ Logs de erro desaparecerão
- ✅ Cadastro de pessoas jurídicas funcionará normalmente

## ⚠️ **Importante:**

- Execute os scripts na **ordem correta**
- Verifique se não há erros de sintaxe
- Faça backup antes de executar (se necessário)
- Teste o sistema após a execução

## 🆘 **Se Houver Problemas:**

1. Verifique os logs do Supabase
2. Confirme se as tabelas foram criadas
3. Verifique se há erros de sintaxe SQL
4. Entre em contato com o suporte se necessário

---

**Status:** ⏳ Aguardando execução manual no Supabase
**Prioridade:** 🔴 Alta (resolve erros críticos do sistema)
