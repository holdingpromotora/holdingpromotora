# 🧪 INSTRUÇÕES PARA TESTAR E IDENTIFICAR O PROBLEMA

## **PROBLEMA ATUAL:**

O formulário de pessoa jurídica continua com os mesmos erros:

- ❌ Erro na busca do tipo de PIX
- ❌ Sistema fecha ao salvar e volta para login
- ❌ Dados não são salvos no banco

## **SOLUÇÃO IMPLEMENTADA:**

1. ✅ **Logs detalhados** adicionados em todas as funções
2. ✅ **API de teste** criada para verificar o banco
3. ✅ **Validações melhoradas** com logs

## **COMO TESTAR:**

### **1. Testar a API de Teste:**

```bash
# No terminal, execute:
curl -X POST http://localhost:3000/api/test-cadastro-pj
```

**Resultado esperado:**

- Se funcionar: `{"success": true, "message": "Teste de cadastro PJ bem-sucedido!"}`
- Se falhar: Ver detalhes do erro (código, mensagem, detalhes)

### **2. Testar o Formulário com Console Aberto:**

1. Abra o navegador
2. Acesse `/usuarios/cadastro-pj`
3. Abra o Console (F12 → Console)
4. Preencha os campos obrigatórios
5. Tente salvar
6. **Observe os logs no console**

### **3. Logs que Você Deve Ver:**

#### **Ao Preencher Tipo PIX:**

```
🔄 useEffect chave PIX executado
📋 tipoPix atual: [valor selecionado]
📋 chavePix atual: [valor atual]
🔑 Tipo [tipo] - chave: [valor]
✅ Atualizando chavePix para: [valor]
```

#### **Ao Buscar CNPJ:**

```
🔍 Iniciando busca de CNPJ: [cnpj]
📋 Dados recebidos da API: [dados]
✅ Dados preenchidos automaticamente com sucesso
🏁 Busca de CNPJ finalizada
```

#### **Ao Salvar:**

```
🚀 Iniciando submissão do formulário...
📋 Dados do formulário: [dados]
✅ Validação de campos obrigatórios passou
✅ Validação de CNPJ passou
✅ Validação de CPF passou
✅ Validação de PIX passou
✅ Validação de tipos passou
🔄 Verificando/criando tabelas...
💾 Tentando inserir no Supabase...
```

## **POSSÍVEIS PROBLEMAS:**

### **A. Se a API de teste falhar:**

- ❌ **Problema no banco** (constraints, tabela, permissões)
- ✅ **Solução:** Verificar Supabase, executar script de correção

### **B. Se a API de teste funcionar mas o formulário falhar:**

- ❌ **Problema no frontend** (validação, estado, UI)
- ✅ **Solução:** Verificar logs do console, corrigir validações

### **C. Se ambos falharem:**

- ❌ **Problema geral** (conexão, autenticação, configuração)
- ✅ **Solução:** Verificar variáveis de ambiente, conexão Supabase

## **PRÓXIMOS PASSOS:**

1. **Execute a API de teste** para verificar o banco
2. **Teste o formulário** com console aberto
3. **Me envie os logs** que aparecerem no console
4. **Me envie o resultado** da API de teste

Com essas informações, poderei identificar exatamente onde está o problema! 🔍
