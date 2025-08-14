-- Banco de dados para Holding Promotora

-- Tabela de Bancos
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

-- Tabela de Pessoas Físicas
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

-- Índices para melhor performance
CREATE INDEX idx_pessoas_fisicas_cpf ON pessoas_fisicas(cpf);
CREATE INDEX idx_pessoas_fisicas_email ON pessoas_fisicas(email);
CREATE INDEX idx_pessoas_fisicas_banco_id ON pessoas_fisicas(banco_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pessoas_fisicas_updated_at 
    BEFORE UPDATE ON pessoas_fisicas 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
