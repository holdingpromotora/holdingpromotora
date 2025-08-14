-- 🚀 Criação da Tabela pessoas_juridicas - Holding Promotora

-- Criar tabela pessoas_juridicas
CREATE TABLE IF NOT EXISTS pessoas_juridicas (
    id BIGSERIAL PRIMARY KEY,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    cep VARCHAR(9),
    endereco VARCHAR(255),
    numero VARCHAR(10),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    proprietario_nome VARCHAR(255) NOT NULL,
    proprietario_rg VARCHAR(20),
    proprietario_cpf VARCHAR(14) NOT NULL,
    proprietario_data_nascimento DATE,
    proprietario_email VARCHAR(255) NOT NULL,
    proprietario_telefone VARCHAR(15),
    banco_id BIGINT REFERENCES bancos(id),
    agencia VARCHAR(10),
    conta_digito VARCHAR(20),
    tipo_conta VARCHAR(20),
    tipo_pix VARCHAR(20),
    chave_pix VARCHAR(255),
    usuario VARCHAR(255) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_pessoas_juridicas_cnpj ON pessoas_juridicas(cnpj);
CREATE INDEX IF NOT EXISTS idx_pessoas_juridicas_razao_social ON pessoas_juridicas(razao_social);
CREATE INDEX IF NOT EXISTS idx_pessoas_juridicas_proprietario_cpf ON pessoas_juridicas(proprietario_cpf);
CREATE INDEX IF NOT EXISTS idx_pessoas_juridicas_proprietario_email ON pessoas_juridicas(proprietario_email);
CREATE INDEX IF NOT EXISTS idx_pessoas_juridicas_ativo ON pessoas_juridicas(ativo);

-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_pessoas_juridicas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar updated_at automaticamente
CREATE TRIGGER trigger_update_pessoas_juridicas_updated_at
    BEFORE UPDATE ON pessoas_juridicas
    FOR EACH ROW
    EXECUTE FUNCTION update_pessoas_juridicas_updated_at();

-- Habilitar RLS (Row Level Security)
ALTER TABLE pessoas_juridicas ENABLE ROW LEVEL SECURITY;

-- Política RLS para leitura (usuários autenticados podem ler)
CREATE POLICY "Usuários autenticados podem ler pessoas jurídicas" ON pessoas_juridicas
    FOR SELECT USING (auth.role() = 'authenticated');

-- Política RLS para inserção (usuários autenticados podem inserir)
CREATE POLICY "Usuários autenticados podem inserir pessoas jurídicas" ON pessoas_juridicas
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política RLS para atualização (usuários autenticados podem atualizar)
CREATE POLICY "Usuários autenticados podem atualizar pessoas jurídicas" ON pessoas_juridicas
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Política RLS para exclusão (usuários autenticados podem excluir)
CREATE POLICY "Usuários autenticados podem excluir pessoas jurídicas" ON pessoas_juridicas
    FOR DELETE USING (auth.role() = 'authenticated');

-- Comentários na tabela
COMMENT ON TABLE pessoas_juridicas IS 'Tabela para armazenar dados de pessoas jurídicas (empresas)';
COMMENT ON COLUMN pessoas_juridicas.cnpj IS 'CNPJ da empresa (formato: XX.XXX.XXX/XXXX-XX)';
COMMENT ON COLUMN pessoas_juridicas.razao_social IS 'Razão social da empresa';
COMMENT ON COLUMN pessoas_juridicas.nome_fantasia IS 'Nome fantasia da empresa';
COMMENT ON COLUMN pessoas_juridicas.proprietario_cpf IS 'CPF do proprietário ou gerente';
COMMENT ON COLUMN pessoas_juridicas.proprietario_email IS 'Email do proprietário (usado como usuário)';
COMMENT ON COLUMN pessoas_juridicas.tipo_pix IS 'Tipo da chave PIX (CNPJ, CPF, Telefone, E-mail)';
COMMENT ON COLUMN pessoas_juridicas.chave_pix IS 'Chave PIX baseada no tipo selecionado';
COMMENT ON COLUMN pessoas_juridicas.usuario IS 'Nome de usuário (geralmente o email)';
COMMENT ON COLUMN pessoas_juridicas.senha_hash IS 'Hash da senha (criptografada)';
COMMENT ON COLUMN pessoas_juridicas.ativo IS 'Status ativo/inativo da empresa';

-- Verificar se a tabela foi criada
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'pessoas_juridicas'
ORDER BY ordinal_position;
