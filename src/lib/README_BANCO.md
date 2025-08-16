# 🗄️ Estruturas de Banco de Dados - Holding Promotora

## 📋 **Tabelas Criadas**

### 1. **`tipos_acesso`** - Níveis de Acesso

- **Propósito**: Define os níveis de acesso do sistema
- **Campos principais**:
  - `id`: Identificador único
  - `nome`: Nome do nível (ex: Master, Administrador)
  - `nivel`: Número do nível (1-10)
  - `descricao`: Descrição das permissões
  - `cor`: Cor para interface (ex: bg-red-600)
  - `icone`: Ícone para interface (ex: Crown, Shield)

### 2. **`perfis_usuarios`** - Perfis de Usuários

- **Propósito**: Define os perfis que podem ser atribuídos aos usuários
- **Campos principais**:
  - `id`: Identificador único
  - `nome`: Nome do perfil
  - `tipo_acesso_id`: Referência ao nível de acesso
  - `descricao`: Descrição do perfil
  - `cor` e `icone`: Personalização visual

### 3. **`usuarios`** - Criada

- **Tabela completa** para controle de acesso:
  - `id`, `nome`, `email`, `senha_hash`: Dados de login
  - `perfil_id`: Referência ao perfil do usuário
  - `tipo_acesso_id`: Referência direta ao nível de acesso
  - `ativo`, `ultimo_acesso`: Controle de status e atividade

## 🚀 **Como Executar**

### **⚠️ IMPORTANTE: Execute na ordem correta!**

1. **PRIMEIRO: Execute `corrigir_constraint_nivel.sql`**
   - Remove a constraint UNIQUE problemática do campo nivel
   - Permite múltiplos tipos com mesmo nível

2. **SEGUNDO: Execute `niveis_acesso_perfis.sql`**
   - Cria/atualiza as tabelas sem a constraint problemática
   - Insere dados padrão

### **Opção 1: Via Supabase Dashboard**

1. Acesse o painel do Supabase
2. Vá para **SQL Editor**
3. Execute os scripts na ordem acima

### **Opção 2: Via Supabase CLI**

```bash
supabase db reset
# ou
supabase db push
```

### **Opção 3: Via psql (PostgreSQL local)**

```bash
psql -U seu_usuario -d seu_banco -f niveis_acesso_perfis.sql
```

## 🔗 **APIs Disponíveis**

### **Níveis de Acesso**

- `GET /api/niveis-acesso` - Listar todos os níveis
- `POST /api/niveis-acesso` - Criar novo nível

### **Perfis de Usuários**

- `GET /api/perfis` - Listar todos os perfis
- `POST /api/perfis` - Criar novo perfil

## 📊 **Dados Padrão Inseridos**

### **Níveis de Acesso**

1. **Master** (Nível 1) - Acesso total
2. **Submaster** (Nível 2) - Administrativo limitado
3. **Parceiro** (Nível 3) - Funcionalidades específicas
4. **Colaborador** (Nível 4) - Acesso básico
5. **Operador** (Nível 5) - Acesso operacional
6. **Visualizador** (Nível 6) - Apenas visualização
7. **Convidado** (Nível 7) - Acesso limitado

### **Perfis Padrão**

- Cada nível tem um perfil correspondente
- Cores e ícones personalizados para cada um

## 🔧 **Funcionalidades**

- ✅ **Triggers automáticos** para `updated_at`
- ✅ **Índices otimizados** para performance
- ✅ **Constraints de validação** (níveis 1-10)
- ✅ **View `usuarios_completos`** para consultas facilitadas
- ✅ **Relacionamentos** entre usuários, perfis e tipos de acesso

## 📝 **Próximos Passos**

1. **Executar `corrigir_constraint_nivel.sql`** para remover a constraint problemática
2. **Executar `niveis_acesso_perfis.sql`** para criar/atualizar as tabelas
3. **Testar as APIs** criadas
4. **Integrar** com a interface de usuários
5. **Configurar** permissões baseadas nos níveis

## ⚠️ **Importante**

- **Execute PRIMEIRO** `corrigir_constraint_nivel.sql` para remover a constraint problemática
- **Execute DEPOIS** `niveis_acesso_perfis.sql` para criar/atualizar as tabelas
- **3 tabelas serão criadas** automaticamente
- Os dados padrão serão inseridos automaticamente
- Todas as operações são seguras (usam `IF NOT EXISTS`)
- **Esta ordem resolve o erro** `duplicate key value violates unique constraint "tipos_acesso_nivel_key"`
