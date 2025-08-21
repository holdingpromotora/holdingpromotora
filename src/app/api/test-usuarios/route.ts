import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🧪 Testando conexão com banco de dados...');

    // 1. Testar conexão básica
    const { data: connectionTest, error: connectionError } = await supabase
      .from('usuarios')
      .select('count')
      .limit(1);

    if (connectionError) {
      console.error('❌ Erro de conexão:', connectionError);
      return NextResponse.json({
        success: false,
        error: 'Erro de conexão com o banco',
        details: connectionError.message,
        code: connectionError.code,
      });
    }

    // 2. Tentar buscar usuários
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*')
      .limit(5);

    if (usuariosError) {
      console.error('❌ Erro ao buscar usuários:', usuariosError);

      // Se a tabela não existir, vamos criá-la
      if (usuariosError.code === 'PGRST116') {
        console.log('📋 Tabela usuarios não existe. Tentando criar...');

        // SQL para criar a tabela usuarios
        const createTableSQL = `
          CREATE TABLE IF NOT EXISTS usuarios (
            id SERIAL PRIMARY KEY,
            nome VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            senha VARCHAR(255),
            perfil_id INTEGER,
            perfil_nome VARCHAR(100),
            aprovado BOOLEAN DEFAULT false,
            ativo BOOLEAN DEFAULT true,
            status VARCHAR(50) DEFAULT 'pendente',
            data_cadastro TIMESTAMP DEFAULT NOW(),
            data_aprovacao TIMESTAMP,
            aprovado_por VARCHAR(255),
            ultimo_acesso TIMESTAMP,
            nivel_acesso VARCHAR(100),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          );
          
          -- Inserir alguns usuários de exemplo
          INSERT INTO usuarios (nome, email, perfil_nome, aprovado, ativo, status) VALUES
          ('Admin Sistema', 'admin@holding.com', 'Administrador', true, true, 'aprovado'),
          ('João Silva', 'joao.silva@holding.com', 'Gerente', true, true, 'aprovado'),
          ('Maria Santos', 'maria.santos@holding.com', 'Operador', false, true, 'pendente'),
          ('Pedro Costa', 'pedro.costa@holding.com', 'Visualizador', false, false, 'rejeitado'),
          ('Ana Oliveira', 'ana.oliveira@holding.com', 'Operador', true, true, 'aprovado')
          ON CONFLICT (email) DO NOTHING;
        `;

        // Executar via RPC se possível
        try {
          const { error: createError } = await supabase.rpc('exec_sql', {
            sql: createTableSQL,
          });

          if (createError) {
            console.error('❌ Erro ao criar tabela via RPC:', createError);
          } else {
            console.log('✅ Tabela criada via RPC');
          }
        } catch (rpcError) {
          console.log('⚠️ RPC não disponível, retornando instruções SQL');
        }

        return NextResponse.json({
          success: false,
          error: 'Tabela usuarios não existe',
          solution: 'Execute o SQL fornecido no Supabase Dashboard',
          sql: createTableSQL,
          instructions: [
            '1. Acesse o Supabase Dashboard',
            '2. Vá para SQL Editor',
            '3. Execute o SQL fornecido',
            '4. Teste novamente esta API',
          ],
        });
      }

      return NextResponse.json({
        success: false,
        error: 'Erro ao buscar usuários',
        details: usuariosError.message,
        code: usuariosError.code,
      });
    }

    // 3. Buscar estatísticas
    const { data: stats, error: statsError } = await supabase
      .from('usuarios')
      .select('aprovado, status, ativo');

    let estatisticas = {
      total: 0,
      aprovados: 0,
      pendentes: 0,
      rejeitados: 0,
      ativos: 0,
      inativos: 0,
    };

    if (!statsError && stats) {
      estatisticas = {
        total: stats.length,
        aprovados: stats.filter(u => u.aprovado).length,
        pendentes: stats.filter(u => u.status === 'pendente').length,
        rejeitados: stats.filter(u => u.status === 'rejeitado').length,
        ativos: stats.filter(u => u.ativo).length,
        inativos: stats.filter(u => !u.ativo).length,
      };
    }

    console.log('✅ Teste de conexão bem-sucedido!');
    console.log(`📊 ${usuarios?.length || 0} usuários encontrados`);

    return NextResponse.json({
      success: true,
      message: 'Conexão com banco funcionando!',
      data: {
        usuarios: usuarios || [],
        estatisticas,
        totalUsuarios: usuarios?.length || 0,
      },
    });
  } catch (error) {
    console.error('❌ Erro geral no teste:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno no teste',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
}
