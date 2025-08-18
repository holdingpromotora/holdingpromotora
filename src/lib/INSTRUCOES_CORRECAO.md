# 🚀 INSTRUÇÕES PARA CORRIGIR O FORMULÁRIO DE PESSOA JURÍDICA

## **PROBLEMA IDENTIFICADO:**

O formulário está falhando porque a tabela `pessoas_juridicas` não tem as constraints CHECK para validar os tipos de PIX e conta, **E** já tem dados com valores inválidos.

## **SOLUÇÃO COMPLETA:**

Execute o script SQL corrigido que primeiro limpa os dados inválidos e depois adiciona as constraints.

### **1. Executar o Script de Correção:**

```sql
-- Copie e cole este script no Supabase SQL Editor
-- Execute o arquivo: src/lib/corrigir_constraint_nivel.sql
```

### **2. O que o Script Faz:**

1. **🔧 LIMPA DADOS INVÁLIDOS:**
   - Corrige `tipo_conta` inválidos para 'Corrente' (padrão)
   - Corrige `tipo_pix` inválidos para 'E-mail' (padrão)

2. **✅ ADICIONA CONSTRAINTS:**
   - `tipo_conta` deve ser 'Corrente' ou 'Poupança'
   - `tipo_pix` deve ser 'CNPJ', 'CPF', 'Telefone' ou 'E-mail'

### **3. Verificar se Funcionou:**

Após executar o script, você deve ver mensagens como:

- "✅ Constraint para tipo_conta adicionada com sucesso"
- "✅ Constraint para tipo_pix adicionada com sucesso"

### **4. Testar o Formulário:**

1. Acesse o formulário de pessoa jurídica
2. Preencha os campos obrigatórios
3. Selecione um tipo de PIX válido
4. Tente salvar

## **O QUE FOI CORRIGIDO:**

### **✅ Campo `status` inexistente removido**

- O código estava tentando inserir um campo `status` que não existe na tabela
- Isso causava erro de inserção no banco

### **✅ Constraints CHECK adicionadas**

- A tabela `pessoas_juridicas` agora valida os tipos de PIX e conta
- Previne inserção de dados inválidos

### **✅ Dados existentes corrigidos**

- Valores inválidos foram convertidos para valores padrão válidos
- Permite adicionar as constraints sem erro

## **RESULTADO ESPERADO:**

- ✅ Formulário salva dados no banco sem erro
- ✅ Tipos de PIX e conta são validados corretamente
- ✅ Sistema não fecha mais ao salvar
- ✅ Dados seguem fluxo de aprovação (campo `ativo = false`)

**⚠️ IMPORTANTE:** Execute o script SQL ANTES de testar o formulário!
