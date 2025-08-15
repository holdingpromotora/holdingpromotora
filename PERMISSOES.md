# Sistema de Permissões e Níveis de Acesso

## Holding Promotora

## 🎯 Visão Geral

Sistema completo de controle de acesso baseado em permissões granulares, permitindo controle fino sobre o que cada usuário pode fazer no sistema.

## 🏗️ Arquitetura do Sistema

### 1. **Tipos de Acesso** (tipos_acesso)

- Define os níveis hierárquicos do sistema
- Cada tipo tem um nível numérico (1 = maior, 10 = menor)
- Inclui cor e ícone para identificação visual

### 2. **Permissões** (permissoes)

- Permissões específicas que podem ser atribuídas
- Organizadas por categoria e ação
- Cada permissão tem um nível mínimo necessário

### 3. **Níveis de Acesso** (niveis_acesso)

- Relaciona tipos de acesso com suas permissões
- Permite configuração flexível de permissões por tipo

### 4. **Usuários** (usuarios)

- Vinculados a um tipo de acesso
- Podem ter permissões especiais adicionais

## 📊 Níveis de Acesso Padrão

| Nível | Nome              | Descrição                       | Permissões                                 |
| ----- | ----------------- | ------------------------------- | ------------------------------------------ |
| 1     | **Master**        | Acesso total ao sistema         | Todas as permissões                        |
| 2     | **Administrador** | Acesso administrativo completo  | Todas exceto algumas do sistema            |
| 3     | **Gerente**       | Acesso gerencial com limitações | Usuários, cadastros, relatórios, marketing |
| 4     | **Supervisor**    | Acesso de supervisão            | Usuários, cadastros, relatórios básicos    |
| 5     | **Operador**      | Acesso operacional básico       | Cadastros, relatórios básicos, próprios    |
| 6     | **Visualizador**  | Acesso apenas para visualização | Dashboard, cadastros, relatórios, próprios |
| 7     | **Convidado**     | Acesso limitado para convidados | Apenas dashboard                           |

## 🔐 Categorias de Permissões

### **Dashboard**

- `dashboard_view` - Visualizar painel principal

### **Usuários**

- `usuarios_view` - Ver lista de usuários
- `usuarios_create` - Criar novos usuários
- `usuarios_edit` - Modificar usuários existentes
- `usuarios_delete` - Remover usuários
- `usuarios_manage` - Controle total sobre usuários

### **Cadastros**

- `cadastros_view` - Ver cadastros
- `cadastros_create` - Criar novos cadastros
- `cadastros_edit` - Modificar cadastros
- `cadastros_delete` - Remover cadastros
- `cadastros_manage` - Controle total sobre cadastros

### **Sistema**

- `sistema_config` - Configurar sistema
- `sistema_logs` - Visualizar logs
- `sistema_backup` - Gerenciar backups

### **Relatórios**

- `relatorios_view` - Ver relatórios
- `relatorios_create` - Criar relatórios
- `relatorios_export` - Exportar dados
- `relatorios_manage` - Gerenciar relatórios

### **Registros Próprios**

- `proprios_view` - Ver registros criados por si
- `proprios_edit` - Editar registros próprios
- `proprios_delete` - Excluir registros próprios
- `proprios_manage` - Controle total sobre registros próprios

### **Financeiro**

- `financeiro_view` - Ver informações financeiras
- `financeiro_edit` - Modificar dados financeiros
- `financeiro_manage` - Controle total sobre finanças

### **Marketing**

- `marketing_view` - Ver campanhas
- `marketing_create` - Criar campanhas
- `marketing_edit` - Modificar campanhas
- `marketing_manage` - Gerenciar marketing

## 🚀 Como Usar

### 1. **Hook usePermissions**

```tsx
import { usePermissions } from '@/hooks/usePermissions';

const {
  can,
  canDo,
  canAccess,
  isAdmin,
  isGerente,
  canCreateUsers,
  canEditUsers,
  canDeleteUsers,
} = usePermissions();

// Verificar permissão específica
if (can('usuarios_create')) {
  // Usuário pode criar usuários
}

// Verificar permissão por categoria e ação
if (canDo('usuarios', 'criar')) {
  // Usuário pode criar usuários
}

// Verificar acesso ao recurso
if (canAccess('usuarios', 'visualizar')) {
  // Usuário pode ver usuários
}
```

### 2. **Componente PermissionGuard**

```tsx
import { PermissionGuard, ShowIf, PermissionButton } from '@/components/PermissionGuard';

// Proteger conteúdo baseado em permissão
<PermissionGuard categoria="usuarios" acao="criar">
  <Button>Novo Usuário</Button>
</PermissionGuard>

// Mostrar/esconder baseado em permissão
<ShowIf categoria="usuarios" acao="editar">
  <Button>Editar</Button>
</ShowIf>

// Botão com verificação de permissão
<PermissionButton
  categoria="usuarios"
  acao="excluir"
  onClick={handleDelete}
  className="bg-red-600"
>
  Excluir
</PermissionButton>
```

### 3. **Verificações de Nível**

```tsx
const { isAdmin, isGerente, isOperador, hasLevel } = usePermissions();

if (isAdmin()) {
  // Usuário é administrador ou superior
}

if (hasLevel(ACCESS_LEVELS.GERENTE)) {
  // Usuário tem nível de gerente ou superior
}
```

## 🗄️ Estrutura do Banco de Dados

### **Tabela: tipos_acesso**

```sql
CREATE TABLE tipos_acesso (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    nivel INTEGER NOT NULL CHECK (nivel >= 1 AND nivel <= 10),
    cor VARCHAR(50) DEFAULT 'bg-blue-600',
    icone VARCHAR(100) DEFAULT 'Shield',
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Tabela: permissoes**

```sql
CREATE TABLE permissoes (
    id VARCHAR(100) PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(50) NOT NULL,
    acao VARCHAR(50) NOT NULL,
    recurso VARCHAR(100) NOT NULL,
    ativo BOOLEAN DEFAULT true,
    nivel_minimo INTEGER NOT NULL DEFAULT 6,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Tabela: niveis_acesso**

```sql
CREATE TABLE niveis_acesso (
    id SERIAL PRIMARY KEY,
    tipo_acesso_id INTEGER NOT NULL REFERENCES tipos_acesso(id),
    permissoes TEXT[] NOT NULL DEFAULT '{}',
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Funções do Banco de Dados

### **get_user_permissions(user_id)**

Retorna todas as permissões de um usuário específico.

### **has_user_permission(user_id, permission_id)**

Verifica se um usuário tem uma permissão específica.

### **has_user_permission_action(user_id, categoria, acao)**

Verifica se um usuário tem permissão para uma ação específica em uma categoria.

## 📱 Exemplos de Uso

### **Página de Usuários com Permissões**

```tsx
export default function UsuariosPage() {
  const { canCreateUsers, canEditUsers, canDeleteUsers } = usePermissions();

  return (
    <div>
      <h1>Usuários</h1>

      {/* Botão de criar - apenas para quem pode */}
      <ShowIf categoria="usuarios" acao="criar">
        <Button>Novo Usuário</Button>
      </ShowIf>

      {/* Lista de usuários */}
      {usuarios.map(usuario => (
        <div key={usuario.id}>
          <span>{usuario.nome}</span>

          {/* Botões de ação baseados em permissões */}
          <PermissionButton
            categoria="usuarios"
            acao="editar"
            onClick={() => handleEdit(usuario.id)}
          >
            Editar
          </PermissionButton>

          <PermissionButton
            categoria="usuarios"
            acao="excluir"
            onClick={() => handleDelete(usuario.id)}
          >
            Excluir
          </PermissionButton>
        </div>
      ))}
    </div>
  );
}
```

### **Menu Condicional**

```tsx
const Menu = () => {
  const { canAccess, isAdmin } = usePermissions();

  return (
    <nav>
      <Link href="/dashboard">Dashboard</Link>

      <ShowIf categoria="usuarios" acao="visualizar">
        <Link href="/usuarios">Usuários</Link>
      </ShowIf>

      <ShowIf categoria="cadastros" acao="visualizar">
        <Link href="/cadastros">Cadastros</Link>
      </ShowIf>

      <ShowIf categoria="relatorios" acao="visualizar">
        <Link href="/relatorios">Relatórios</Link>
      </ShowIf>

      {isAdmin() && <Link href="/sistema">Sistema</Link>}
    </nav>
  );
};
```

## 🛡️ Segurança

### **Implementado**

- ✅ Verificação de permissões em tempo real
- ✅ Controle granular por categoria e ação
- ✅ Níveis hierárquicos de acesso
- ✅ Permissões específicas por usuário
- ✅ Validação no frontend e backend

### **Recomendações**

- 🔒 Implementar cache de permissões
- 🔒 Adicionar logs de auditoria
- 🔒 Implementar rate limiting por permissão
- 🔒 Validação dupla (frontend + backend)
- 🔒 Sessões com expiração

## 📋 Migração

### **1. Executar Script SQL**

```bash
psql -d seu_banco -f src/lib/permissoes.sql
```

### **2. Atualizar Usuários Existentes**

```sql
UPDATE usuarios
SET tipo_acesso_id = CASE
    WHEN nivel_acesso = 'admin' THEN 2
    WHEN nivel_acesso = 'gerente' THEN 3
    WHEN nivel_acesso = 'operador' THEN 5
    WHEN nivel_acesso = 'visualizador' THEN 6
    ELSE 6
END
WHERE tipo_acesso_id IS NULL;
```

### **3. Testar Permissões**

```tsx
// Verificar se está funcionando
const { can, getPermissions } = usePermissions();
console.log('Permissões:', getPermissions());
console.log('Pode criar usuários:', can('usuarios_create'));
```

## 🎉 Benefícios

1. **Segurança**: Controle granular de acesso
2. **Flexibilidade**: Fácil configuração de permissões
3. **Escalabilidade**: Suporte a novos tipos e permissões
4. **Manutenibilidade**: Código organizado e reutilizável
5. **UX**: Interface adaptativa baseada em permissões
6. **Auditoria**: Rastreamento de ações por usuário

## 🔮 Próximos Passos

1. **Implementar cache** de permissões para performance
2. **Adicionar logs** de auditoria
3. **Criar interface** para gerenciar permissões
4. **Implementar** permissões dinâmicas
5. **Adicionar** validação de sessões
6. **Criar** sistema de roles personalizados

---

**Sistema de Permissões - Holding Promotora**  
_Controle total sobre o acesso dos usuários ao sistema_
