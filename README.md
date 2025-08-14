# 🏢 Holding Promotora - Sistema de Gestão

## 📋 Descrição

Sistema web completo para gestão de usuários, clientes, simulações e propostas da Holding Promotora. Desenvolvido com Next.js 15, TypeScript, Tailwind CSS e integração com Supabase.

## ✨ Funcionalidades Principais

### 👥 Gestão de Usuários

- **Cadastro de Pessoa Física**: Formulário completo com validações e máscaras
- **Cadastro de Pessoa Jurídica**: Integração com API de CNPJ e validações
- **Sistema de Níveis de Acesso**: Controle granular de permissões
- **Gerenciamento de Usuários**: Edição, exclusão e visualização de registros

### 🔐 Sistema de Permissões

- **Tipos de Acesso**: Master, Submaster, Parceiro, Colaborador
- **Permissões Granulares**: Controle por categoria e funcionalidade
- **Registros Próprios**: Usuários veem/editam apenas seus registros
- **Controles em Massa**: Marcar/desmarcar permissões por categoria

### 🎨 Interface Moderna

- **Design Responsivo**: Adaptável a todos os dispositivos
- **Tema Escuro**: Interface elegante e profissional
- **Animações**: Efeitos visuais e transições suaves
- **Componentes UI**: Biblioteca de componentes reutilizáveis

## 🚀 Tecnologias Utilizadas

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **UI Components**: Shadcn/ui, Lucide React
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (recomendado)

## 📦 Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase

### Passos de Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/holding-promotora.git
cd holding-promotora
```

2. **Instale as dependências**

```bash
npm install --ignore-scripts
```

3. **Configure as variáveis de ambiente**

```bash
cp env.example .env.local
```

4. **Configure o Supabase**

- Crie um projeto no [Supabase](https://supabase.com)
- Execute os scripts SQL fornecidos
- Configure as variáveis de ambiente

5. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

## ⚙️ Configuração do Supabase

### 1. Crie as tabelas necessárias

Execute os scripts SQL fornecidos em `supabase-script.sql` e `supabase-pessoas-juridicas.sql`

### 2. Configure as variáveis de ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico
```

## 🏗️ Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js 13+
│   ├── dashboard/         # Página principal do sistema
│   ├── login/            # Sistema de autenticação
│   ├── usuarios/         # Gestão de usuários
│   │   ├── cadastro-pf/  # Cadastro de pessoa física
│   │   ├── cadastro-pj/  # Cadastro de pessoa jurídica
│   │   └── niveis-acesso/ # Sistema de permissões
│   └── globals.css       # Estilos globais
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes base (Shadcn/ui)
│   ├── Layout.tsx        # Layout principal
│   └── Sidebar.tsx       # Menu lateral
└── lib/                  # Utilitários e configurações
    └── supabase.ts       # Cliente Supabase
```

## 🎯 Funcionalidades em Destaque

### Sistema de Níveis de Acesso

- **Controle Granular**: Permissões específicas por funcionalidade
- **Registros Próprios**: Usuários gerenciam apenas seus dados
- **Interface Intuitiva**: Seleção visual de permissões com controles em massa

### Formulários Inteligentes

- **Validação em Tempo Real**: Feedback imediato ao usuário
- **Máscaras de Input**: Formatação automática de dados
- **Integração com APIs**: Busca automática de CNPJ e CEP
- **Persistência de Dados**: Salvamento automático no Supabase

### Design Responsivo

- **Mobile First**: Otimizado para dispositivos móveis
- **Breakpoints**: Adaptação para tablet e desktop
- **Componentes Flexíveis**: Layouts que se adaptam ao conteúdo

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas

- **Netlify**: Compatível com Next.js
- **Railway**: Deploy simples e rápido
- **DigitalOcean**: Para controle total

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

- **Email**: suporte@holdingpromotora.com
- **Documentação**: [Wiki do Projeto](link-para-wiki)
- **Issues**: [GitHub Issues](link-para-issues)

## 🎉 Agradecimentos

- **Next.js Team** pelo framework incrível
- **Supabase** pela infraestrutura de backend
- **Tailwind CSS** pelos estilos utilitários
- **Shadcn/ui** pelos componentes de qualidade

---

**Desenvolvido com ❤️ pela equipe da Holding Promotora**
