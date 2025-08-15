# Sistema de Autenticação - Holding Promotora

## Visão Geral

Sistema de login implementado para usuários cadastrados com diferentes níveis de acesso, sem alterar a funcionalidade existente do aplicativo. 

**Sistema Dual de Autenticação:**
- **Usuário Master**: Acesso direto com credenciais hardcoded (funciona sempre)
- **Usuários Cadastrados**: Acesso via banco de dados com níveis de permissão

## Níveis de Acesso

### 1. Visualizador (Nível 1)

- **Permissões**: Acesso básico para visualizar informações
- **Áreas**: Dashboard, visualização de dados
- **Usuário padrão**: `visualizador@holding.com` / `visual123`

### 2. Operador (Nível 2)

- **Permissões**: Visualizar + operações básicas
- **Áreas**: Todas as áreas do visualizador + cadastros básicos
- **Usuário padrão**: `operador@holding.com` / `operador123`

### 3. Gerente (Nível 3)

- **Permissões**: Visualizar + operar + gerenciar
- **Áreas**: Todas as áreas do operador + gestão de usuários
- **Usuário padrão**: `gerente@holding.com` / `gerente123`

### 4. Administrador (Nível 4)

- **Permissões**: Acesso total ao sistema
- **Áreas**: Todas as funcionalidades
- **Usuário padrão**: `admin@holding.com` / `admin123`

### 5. Usuário Master (Nível Especial)

- **Permissões**: Acesso total ao sistema (independente do banco)
- **Áreas**: Todas as funcionalidades
- **Credenciais**: `grupoarmandogomes@gmail.com` / `@252980Hol`
- **Características**: Funciona sempre, mesmo sem conexão com banco de dados

## Como Usar

### 1. Login

- Acesse `/login`
- Use as credenciais de um dos usuários padrão
- O sistema redirecionará automaticamente para o dashboard

### 2. Proteção de Rotas

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute'

// Rota para visualizadores (nível mínimo)
<ProtectedRoute requiredLevel="visualizador">
  <Componente />
</ProtectedRoute>

// Rota para gerentes
<ProtectedRoute requiredLevel="gerente">
  <Componente />
</ProtectedRoute>
```

### 3. Verificação de Permissões

```tsx
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/types/auth';

const { user } = useAuth();

if (hasPermission(user.nivel_acesso, 'gerente')) {
  // Usuário tem permissão de gerente ou superior
}
```

## Estrutura de Arquivos

```
src/
├── contexts/
│   └── AuthContext.tsx          # Contexto de autenticação
├── components/
│   └── ProtectedRoute.tsx       # Componente de proteção de rotas
├── types/
│   └── auth.ts                  # Tipos e interfaces
└── lib/
    └── usuarios.sql             # Script SQL para tabela de usuários
```

## Banco de Dados

### Tabela: usuarios

- `id`: Identificador único
- `nome`: Nome completo do usuário
- `email`: Email único para login
- `senha_hash`: Hash da senha (em produção)
- `nivel_acesso`: Nível de acesso (admin, gerente, operador, visualizador)
- `ativo`: Status ativo/inativo
- `ultimo_acesso`: Timestamp do último login
- `created_at`: Data de criação
- `updated_at`: Data de atualização

## Segurança

### Implementado

- ✅ Verificação de níveis de acesso
- ✅ Proteção de rotas
- ✅ Contexto de autenticação
- ✅ Logout automático
- ✅ Redirecionamento para login

### Recomendações para Produção

- 🔒 Implementar hash de senhas (bcrypt)
- 🔒 Adicionar JWT tokens
- 🔒 Implementar refresh tokens
- 🔒 Adicionar rate limiting
- 🔒 Logs de auditoria
- 🔒 Validação de sessões

## Usuários de Teste

| Email                    | Senha       | Nível         |
| ------------------------ | ----------- | ------------- |
| **grupoarmandogomes@gmail.com** | **@252980Hol** | **Usuário Master** |
| admin@holding.com        | admin123    | Administrador |
| gerente@holding.com      | gerente123  | Gerente       |
| operador@holding.com     | operador123 | Operador      |
| visualizador@holding.com | visual123   | Visualizador  |

**Nota**: O usuário master tem acesso total ao sistema e funciona independentemente do banco de dados.

## Funcionalidades

- **Login/Logout**: Sistema completo de autenticação
- **Níveis de Acesso**: Controle granular de permissões
- **Proteção de Rotas**: Acesso baseado em níveis
- **Interface Responsiva**: Adaptada ao design existente
- **Persistência**: Login mantido entre sessões
- **Logout**: Botão de logout no header

## Notas Importantes

1. **Não altera funcionalidade existente**: Sistema implementado de forma não intrusiva
2. **Compatível**: Funciona com o design e estrutura atual
3. **Escalável**: Fácil adicionar novos níveis e permissões
4. **Manutenível**: Código organizado e documentado
