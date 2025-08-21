# 📋 INSTRUÇÕES PARA CRIAR TABELAS DE CLIENTES

## 🎯 Objetivo

Criar as tabelas necessárias para o sistema de cadastro de clientes no Supabase.

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
-- Tabela para clientes pessoa física
CREATE TABLE IF NOT EXISTS clientes_pessoa_fisica (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  nome_mae VARCHAR(255),
  rg VARCHAR(20),
  cpf VARCHAR(14) UNIQUE NOT NULL,
  numero_beneficio_matricula VARCHAR(50),
  data_nascimento DATE,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefone VARCHAR(15),

  -- Endereço
  cep VARCHAR(9),
  endereco VARCHAR(255),
  numero VARCHAR(10),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  estado VARCHAR(2),

  -- Dados bancários
  banco_id INTEGER REFERENCES bancos(id),
  agencia VARCHAR(10),
  conta_digito VARCHAR(20),
  tipo_conta VARCHAR(20) DEFAULT 'Corrente',

  -- PIX
  tipo_pix VARCHAR(20) DEFAULT 'CPF',
  chave_pix VARCHAR(255),

  -- Controle
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para clientes pessoa jurídica
CREATE TABLE IF NOT EXISTS clientes_pessoa_juridica (
  id SERIAL PRIMARY KEY,
  cnpj VARCHAR(18) UNIQUE NOT NULL,
  razao_social VARCHAR(255) NOT NULL,
  nome_fantasia VARCHAR(255),

  -- Endereço
  cep VARCHAR(9),
  endereco VARCHAR(255),
  numero VARCHAR(10),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  estado VARCHAR(2),

  -- Dados bancários
  banco_id INTEGER REFERENCES bancos(id),
  agencia VARCHAR(10),
  conta_digito VARCHAR(20),
  tipo_conta VARCHAR(20) DEFAULT 'Corrente',

  -- PIX
  tipo_pix VARCHAR(20) DEFAULT 'CNPJ',
  chave_pix VARCHAR(255),

  -- Controle
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_clientes_pf_cpf ON clientes_pessoa_fisica(cpf);
CREATE INDEX IF NOT EXISTS idx_clientes_pf_email ON clientes_pessoa_fisica(email);
CREATE INDEX IF NOT EXISTS idx_clientes_pj_cnpj ON clientes_pessoa_juridica(cnpj);

-- Comentários das tabelas
COMMENT ON TABLE clientes_pessoa_fisica IS 'Tabela para cadastro de clientes pessoa física';
COMMENT ON TABLE clientes_pessoa_juridica IS 'Tabela para cadastro de clientes pessoa jurídica';
```

### 4. Executar o Script

- Clique no botão "Run" (▶️) ou pressione `Ctrl + Enter`
- Aguarde a execução e verifique se não há erros

### 5. Verificar as Tabelas

- No painel esquerdo, clique em "Table Editor"
- Verifique se as tabelas `clientes_pessoa_fisica` e `clientes_pessoa_juridica` foram criadas

## ✅ Resultado Esperado

Após a execução bem-sucedida, você deve ver:

- ✅ Tabela `clientes_pessoa_fisica` criada
- ✅ Tabela `clientes_pessoa_juridica` criada
- ✅ Índices criados para melhor performance
- ✅ Comentários das tabelas adicionados

## 🚀 Próximos Passos

Após criar as tabelas, o sistema de cadastro de clientes estará 100% funcional:

- Formulário de cadastro de Pessoa Física: `/clientes/cadastro-pf`
- Formulário de cadastro de Pessoa Jurídica: `/clientes/cadastro-pj`
- Dashboard de gerenciamento: `/clientes`

## 🔍 Solução de Problemas

Se houver erros:

1. Verifique se a tabela `bancos` existe (referência no banco_id)
2. Certifique-se de que tem permissões de administrador no projeto
3. Verifique se não há conflitos de nomes de tabelas

---

**Data de Criação:** $(Get-Date -Format "dd/MM/yyyy HH:mm")
**Status:** ✅ Pronto para Execução
