# 🚀 INSTRUÇÕES PARA INTEGRAÇÃO AUTOMÁTICA

## 📋 **OBJETIVO**

Conectar automaticamente o sistema de cadastro (Pessoa Física e Jurídica) com o sistema de aprovações, para que quando um usuário for cadastrado, ele seja automaticamente criado na tabela de usuários com status pendente.

## 🔧 **PASSOS PARA EXECUÇÃO**

### **1. Executar Script SQL de Integração**

```sql
-- Copiar e executar o conteúdo do arquivo:
-- src/lib/integracao_aprovacoes.sql
```

### **2. Verificar Status da Integração**

```bash
# Verificar se as colunas foram criadas
GET /api/setup-integracao
```

### **3. Configurar Integração (se necessário)**

```bash
# Executar configuração automática
POST /api/setup-integracao
```

## 📊 **ESTRUTURA IMPLEMENTADA**

### **Colunas Adicionadas na Tabela `usuarios`:**

- ✅ `aprovado` - Status de aprovação (boolean)
- ✅ `data_aprovacao` - Data da aprovação (timestamp)
- ✅ `aprovado_por` - Quem aprovou (varchar)
- ✅ `data_cadastro` - Data do cadastro (timestamp)

### **Funções Criadas:**

- ✅ `criar_usuario_automatico()` - Cria usuário automaticamente
- ✅ `verificar_aprovacoes_pendentes()` - Lista aprovações pendentes

### **Triggers Implementados:**

- ✅ `trigger_criar_usuario_pf` - Para pessoas físicas
- ✅ `trigger_criar_usuario_pj` - Para pessoas jurídicas

## 🔄 **FLUXO AUTOMÁTICO**

### **Cadastro de Pessoa Física:**

1. Usuário preenche formulário em `/usuarios/cadastro-pf`
2. Dados são inseridos na tabela `pessoas_fisicas`
3. **TRIGGER** executa automaticamente
4. Usuário é criado na tabela `usuarios` com status pendente
5. Aparece automaticamente na aba de aprovações

### **Cadastro de Pessoa Jurídica:**

1. Usuário preenche formulário em `/usuarios/cadastro-pj`
2. Dados são inseridos na tabela `pessoas_juridicas`
3. **TRIGGER** executa automaticamente
4. Usuário é criado na tabela `usuarios` com status pendente
5. Aparece automaticamente na aba de aprovações

## 🎯 **RESULTADO ESPERADO**

- **Cadastros automáticos** na tabela de usuários
- **Status pendente** para todos os novos usuários
- **Aprovação manual** necessária para ativação
- **Rastreamento completo** do processo de aprovação
- **Integração transparente** entre cadastro e aprovação

## ⚠️ **IMPORTANTE**

- Os triggers são executados **APENAS** após a inserção bem-sucedida
- Se houver erro no cadastro, o usuário **NÃO** será criado
- Todos os novos usuários começam com perfil padrão (Visualizador/Operador)
- A aprovação é **SEMPRE** manual por segurança

## 🔍 **VERIFICAÇÃO**

Após executar a integração, verificar:

1. **Colunas criadas** na tabela `usuarios`
2. **Triggers funcionando** nas tabelas de cadastro
3. **Função RPC** `verificar_aprovacoes_pendentes` disponível
4. **Novos cadastros** aparecendo automaticamente na aprovação

## 📞 **SUPORTE**

Em caso de problemas:

1. Verificar logs do Supabase
2. Executar `GET /api/setup-integracao` para diagnóstico
3. Verificar se as tabelas existem e têm as colunas corretas
4. Confirmar se os triggers foram criados com sucesso
