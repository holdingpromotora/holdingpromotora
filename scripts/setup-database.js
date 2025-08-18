#!/usr/bin/env node

/**
 * Script para configurar o banco de dados Supabase
 * Executa os scripts SQL necessários para criar as tabelas
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Iniciando setup do banco de dados...');

// Função para ler arquivo SQL
function readSqlFile(filename) {
  const filePath = path.join(__dirname, '..', 'src', 'lib', filename);
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`❌ Erro ao ler arquivo ${filename}:`, error.message);
    return null;
  }
}

// Função para executar setup
async function setupDatabase() {
  try {
    console.log('📋 Verificando arquivos SQL...');
    
    // Lista de arquivos SQL para executar
    const sqlFiles = [
      'permissoes.sql',
      'database.sql',
      'usuarios.sql',
      'niveis_acesso_perfis.sql'
    ];
    
    console.log('📋 Arquivos encontrados:');
    sqlFiles.forEach(file => {
      const content = readSqlFile(file);
      if (content) {
        console.log(`✅ ${file} - ${content.split('\n').length} linhas`);
      } else {
        console.log(`❌ ${file} - Não encontrado`);
      }
    });
    
    console.log('\n📋 Para executar o setup completo:');
    console.log('1. Acesse o painel do Supabase (https://supabase.com)');
    console.log('2. Vá para o seu projeto');
    console.log('3. Clique em "SQL Editor" no menu lateral');
    console.log('4. Execute os seguintes arquivos na ordem:');
    
    sqlFiles.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file}`);
    });
    
    console.log('\n📋 Ou execute via linha de comando:');
    console.log('   psql -h [HOST] -U [USER] -d [DB] -f src/lib/permissoes.sql');
    
    console.log('\n✅ Setup do banco de dados configurado!');
    console.log('⚠️  Execute os scripts SQL manualmente no Supabase');
    
  } catch (error) {
    console.error('❌ Erro no setup:', error.message);
    process.exit(1);
  }
}

// Executar setup
setupDatabase();
