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

-- Habilitar RLS na tabela bancos
ALTER TABLE bancos ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública dos bancos
CREATE POLICY "Bancos são visíveis para todos" ON bancos
    FOR SELECT USING (true);

-- Habilitar RLS na tabela pessoas_fisicas
ALTER TABLE pessoas_fisicas ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de pessoas físicas
CREATE POLICY "Usuários podem inserir pessoas físicas" ON pessoas_fisicas
    FOR INSERT WITH CHECK (true);

-- Política para permitir leitura de pessoas físicas
CREATE POLICY "Usuários podem visualizar pessoas físicas" ON pessoas_fisicas
    FOR SELECT USING (true);

-- Política para permitir atualização de pessoas físicas
CREATE POLICY "Usuários podem atualizar pessoas físicas" ON pessoas_fisicas
    FOR UPDATE USING (true);
