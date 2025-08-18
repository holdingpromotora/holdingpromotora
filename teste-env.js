// Teste das variáveis de ambiente
console.log('🔍 Testando variáveis de ambiente...');

console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log(
  'NEXT_PUBLIC_SUPABASE_ANON_KEY:',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? '✅ Configurado'
    : '❌ Não configurado'
);

// Verificar se o arquivo .env.local existe
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  console.log('✅ Arquivo .env.local existe');
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('📄 Conteúdo do .env.local:');
  console.log(envContent);
} else {
  console.log('❌ Arquivo .env.local não existe');
}

console.log('✅ Teste concluído');
