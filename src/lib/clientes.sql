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
