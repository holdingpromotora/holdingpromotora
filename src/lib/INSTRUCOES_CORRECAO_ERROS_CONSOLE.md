# Instruções para Corrigir Erros de Console

## Problema Identificado

Os erros de console estão ocorrendo porque a tabela `usuarios` não possui as colunas `perfil_nome`, `perfil_id` e `status` que o código está tentando usar.

## Solução

### 1. Executar Script SQL de Correção

Execute o script SQL `corrigir_tabela_usuarios.sql` no Supabase Dashboard:

1. Acesse o Supabase Dashboard
2. Vá para SQL Editor
3. Execute o script `src/lib/corrigir_tabela_usuarios.sql`

Este script irá:
- Adicionar a coluna `status` à tabela `usuarios`
- Adicionar a coluna `perfil_id` como alias para `tipo_acesso_id`
- Adicionar a coluna `perfil_nome` com valores mapeados
- Atualizar a view `usuarios_completos`
- Criar índices para melhor performance

### 2. Código Já Corrigido

O serviço `usuarios-service.ts` já foi corrigido para:
- Usar as colunas corretas da tabela
- Mapear dados adequadamente
- Tratar casos onde as colunas podem não existir

### 3. Estrutura da Tabela Após Correção

A tabela `usuarios` terá as seguintes colunas:
- `id` - ID único do usuário
- `nome` - Nome do usuário
- `email` - Email do usuário
- `senha_hash` - Hash da senha
- `tipo_acesso_id` - ID do tipo de acesso
- `ativo` - Se o usuário está ativo
- `ultimo_acesso` - Data do último acesso
- `created_at` - Data de criação
- `updated_at` - Data de atualização
- `aprovado` - Se o usuário foi aprovado
- `rejeitado` - Se o usuário foi rejeitado
- `data_aprovacao` - Data da aprovação
- `aprovado_por` - Quem aprovou
- `data_cadastro` - Data do cadastro
- `status` - Status do usuário (pendente/aprovado/rejeitado/inativo)
- `perfil_id` - ID do perfil (alias para tipo_acesso_id)
- `perfil_nome` - Nome do perfil (Master, Submaster, etc.)

### 4. Mapeamento de Perfis

Os perfis são mapeados da seguinte forma:
- 1 → Master
- 2 → Submaster
- 3 → Parceiro
- 4 → Colaborador
- 5 → Operador
- 6 → Visualizador
- 7 → Convidado

### 5. Mapeamento de Status

O status é calculado automaticamente:
- `pendente` - Quando `aprovado = false`
- `aprovado` - Quando `aprovado = true` e `ativo = true`
- `inativo` - Quando `aprovado = true` e `ativo = false`
- `rejeitado` - Quando `rejeitado = true`

## Verificação

Após executar o script, verifique se:
1. As colunas foram adicionadas corretamente
2. Os dados foram mapeados adequadamente
3. Os erros de console não aparecem mais
4. A aplicação funciona normalmente

## Observações

- O código foi corrigido para ser compatível com a nova estrutura
- As funcionalidades existentes foram preservadas
- A performance foi melhorada com índices apropriados
- A compatibilidade com código existente foi mantida
