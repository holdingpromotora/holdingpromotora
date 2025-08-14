# 🚀 Configuração do Supabase - Holding Promotora

## 📋 **Passos para Configurar o Banco de Dados**

### **1. Acesse o Dashboard do Supabase**
- **URL**: https://supabase.com/dashboard/project/ferlknesyqrhdvapqqso
- **Projeto**: ferlknesyqrhdvapqqso

### **2. Vá para SQL Editor**
- No menu lateral, clique em **"SQL Editor"**
- Clique em **"New Query"**

### **3. Execute o Script de Criação das Tabelas**

```sql
-- Criar tabela de bancos
CREATE TABLE bancos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir bancos principais
INSERT INTO bancos (codigo, nome) VALUES
('001', 'Banco do Brasil'),
('104', 'Caixa Econômica Federal'),
('033', 'Santander'),
('341', 'Itaú'),
('237', 'Bradesco'),
('756', 'Sicoob'),
('748', 'Sicredi'),
('422', 'Safra'),
('041', 'Banrisul'),
('077', 'Inter');

-- Criar tabela de pessoas físicas
CREATE TABLE pessoas_fisicas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    rg VARCHAR(20),
    cpf VARCHAR(14) UNIQUE NOT NULL,
    data_nascimento DATE,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(15),
    
    -- Endereço
    cep VARCHAR(9),
    endereco VARCHAR(200),
    numero VARCHAR(10),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    
    -- Dados Bancários
    banco_id INTEGER REFERENCES bancos(id),
    agencia VARCHAR(10),
    conta_digito VARCHAR(20),
    tipo_conta VARCHAR(20) CHECK (tipo_conta IN ('Corrente', 'Poupança')),
    
    -- PIX
    tipo_pix VARCHAR(20) CHECK (tipo_pix IN ('CPF', 'CNPJ', 'Telefone', 'E-mail')),
    chave_pix VARCHAR(200),
    
    -- Usuário
    usuario VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    
    -- Status
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX idx_pessoas_fisicas_cpf ON pessoas_fisicas(cpf);
CREATE INDEX idx_pessoas_fisicas_email ON pessoas_fisicas(email);
CREATE INDEX idx_pessoas_fisicas_banco_id ON pessoas_fisicas(banco_id);

-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_pessoas_fisicas_updated_at 
    BEFORE UPDATE ON pessoas_fisicas 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

### **4. Configurar Políticas de Segurança (RLS)**

#### **Para a tabela `bancos`:**
```sql
-- Habilitar RLS
ALTER TABLE bancos ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública
CREATE POLICY "Bancos são visíveis para todos" ON bancos
    FOR SELECT USING (true);
```

#### **Para a tabela `pessoas_fisicas`:**
```sql
-- Habilitar RLS
ALTER TABLE pessoas_fisicas ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção
CREATE POLICY "Usuários podem inserir pessoas físicas" ON pessoas_fisicas
    FOR INSERT WITH CHECK (true);

-- Política para permitir leitura
CREATE POLICY "Usuários podem visualizar pessoas físicas" ON pessoas_fisicas
    FOR SELECT USING (true);

-- Política para permitir atualização
CREATE POLICY "Usuários podem atualizar pessoas físicas" ON pessoas_fisicas
    FOR UPDATE USING (true);
```

### **5. Verificar Configuração**
- Vá para **"Table Editor"** no menu lateral
- Verifique se as tabelas `bancos` e `pessoas_fisicas` foram criadas
- Verifique se os bancos foram inseridos na tabela `bancos`

## ✅ **Após a Configuração**

1. **Reinicie o servidor Next.js** (se estiver rodando)
2. **Acesse o formulário**: `/usuarios/cadastro-pf`
3. **Teste o cadastro** de uma pessoa física
4. **Verifique no Supabase** se os dados foram salvos

## 🔧 **Solução de Problemas**

### **Erro de Permissão:**
- Verifique se as políticas RLS estão configuradas corretamente
- Confirme se a chave anônima está sendo usada

### **Tabela não encontrada:**
- Execute novamente o script SQL
- Verifique se não há erros de sintaxe

### **Erro de conexão:**
- Confirme se as credenciais estão corretas
- Verifique se o projeto está ativo no Supabase

## 📞 **Suporte**

Se houver problemas, verifique:
1. **Console do navegador** para erros JavaScript
2. **Logs do Supabase** para erros de banco
3. **Network tab** para problemas de API
