-- Função para obter permissões de um tipo de acesso específico
CREATE OR REPLACE FUNCTION get_tipo_acesso_permissions(tipo_acesso_id INTEGER)
RETURNS TABLE (
    permissao_id VARCHAR(100),
    nome VARCHAR(200),
    descricao TEXT,
    categoria VARCHAR(50),
    acao VARCHAR(50),
    recurso VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.nome,
        p.descricao,
        p.categoria,
        p.acao,
        p.recurso
    FROM tipos_acesso ta
    JOIN niveis_acesso na ON ta.id = na.tipo_acesso_id
    JOIN permissoes p ON p.id = ANY(na.permissoes)
    WHERE ta.id = tipo_acesso_id 
    AND ta.ativo = true 
    AND na.ativo = true 
    AND p.ativo = true
    AND p.nivel_minimo <= ta.nivel;
END;
$$ LANGUAGE plpgsql;
