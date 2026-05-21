## YUZ System Center — Plano de Implementação

Construir a área logada SPA herdando a identidade do site atual (glassmorphism, gradientes YUZ, animações), com backend multi-tenant seguro no Lovable Cloud.

### 1. Backend (Lovable Cloud / Supabase)

Habilitar Lovable Cloud e criar:

**Tabelas**
- `organizations` (id, name, slug, created_at)
- `profiles` (id = auth.users.id, full_name, avatar_url, organization_id, created_at)
- `app_role` enum: `admin_global`, `organizer`, `operator`
- `user_roles` (id, user_id, role, organization_id nullable para admin_global)
- `events` (id, organization_id, name, starts_at, status)
- `field_modules` (id, organization_id, module_key, status: `not_contracted` | `contracted` | `operating`) — para o pilar Field

**Segurança**
- RLS ativo em todas as tabelas
- Security definer functions: `has_role(_user_id, _role)`, `is_admin_global(_user_id)`, `get_user_org(_user_id)`
- Policies: admin_global vê tudo; organizer/operator vê apenas `organization_id = get_user_org(auth.uid())`
- Trigger `handle_new_user` para criar profile no signup

**Auth**
- Email/password + Google (broker Lovable)
- `/login`, `/signup`
- `_authenticated` layout com `beforeLoad` redirect
- Listener `onAuthStateChange` no root para invalidar cache

### 2. Sistema de Temas

- ThemeProvider (next-themes ou implementação local) com persistência em localStorage
- Tokens em `src/styles.css`:
  - Dark (atual): fundo deep navy, logo YUZ White
  - Light: branco gelo (`oklch(0.98 0.01 240)`), texto deep navy, acentos vibrantes preservados, logo YUZ Color
- ThemeToggle no header (site público e app logada)
- Logo dinâmica via hook `useResolvedTheme`

### 3. YUZ System Center (área logada)

Rota: `/_authenticated/system` (SPA com Tabs, sem reload)

**Layout**
- Header: logo, seletor de pilar (chips), busca, theme toggle, avatar/menu
- Sidebar contextual com módulos do pilar ativo
- Conteúdo principal: dashboard do pilar + grid de módulos

**Branding contextual por pilar** (gradientes aplicados em bordas de cards ativos, ícones, botões CTA, accent ring):
- Digital: `linear-gradient(135deg, #ef4444, #f97316)` (vermelho → laranja)
- Field: `linear-gradient(135deg, #fbbf24, #d4a017)` (amarelo → ouro)
- Performance: `linear-gradient(135deg, #3b82f6, #1e3a8a)` (azul → azul profundo)

Variável CSS `--pillar-gradient` trocada via data-attribute no container, sem sair do tema escolhido.

**Pilar A — YUZ Digital**
Cards: Site Builder, Form Builder, Checkout/Ingressos, Pedidos, YUZ Intelligence, YUZ Mobile. Cada card abre Sheet com tela mockada do módulo.

**Pilar B — YUZ Field**
Cards com status badge (`Contratar` / `Operar`). Clique abre modal:
- Status `not_contracted`: CTA "Contratar" → muda status para `contracted`
- Status `contracted`/`operating`: CTA "Operar" → abre Sheet com mockup operacional
Módulos: Credenciamento self-service, YUZ QR, YUZ Facial Ready, YUZ Access Control, Field Services, Concierge, Totens, YUZ Badges, Etiquetas, YUZ Sponsor (este último com badge "Redireciona para área do patrocinador").

**Pilar C — YUZ Performance**
Dashboard com gráficos `recharts` (Area, Bar, Pie) usando dados mockados:
- KPIs: Vendas totais, Ticket médio, Check-ins, ROI
- Gráficos: Vendas por dia, Engajamento por canal, Funil de leads
Cards de módulos: Vendas, Pagamentos, Engajamento, Participantes, Dashboards, Leads, ROI, Ticketing, Checkin/checkout, YUZ Engage, YUZ CRM, Analytics, YUZ Intelligence IA, Recommendations, Campaigns, YUZ API. Cada um abre Sheet com mockup.

### 4. Painel Admin Global

Em `/_authenticated/admin` (visível apenas para `admin_global`):
- Lista de organizações + criação
- Lista de usuários + atribuição de role e organização
- Visão consolidada de eventos

### 5. Estrutura de arquivos

```
src/
  routes/
    login.tsx, signup.tsx
    _authenticated.tsx (guard)
    _authenticated/
      system.tsx (hub principal)
      admin.tsx (admin global)
  components/
    theme/ (ThemeProvider, ThemeToggle, Logo)
    system/
      PillarSwitcher.tsx
      ModuleCard.tsx
      ModuleSheet.tsx
      pillars/{Digital,Field,Performance}Panel.tsx
  integrations/supabase/ (já existe)
  hooks/use-auth.ts, use-pillar.ts, use-role.ts
  lib/
    pillars.ts (config dos 3 pilares + módulos)
    *.functions.ts (server fns: getMyOrg, listFieldModules, contractModule, adminListOrgs, etc)
```

### 6. Detalhes técnicos

- Mutações via `createServerFn` com `requireSupabaseAuth`; admin via `is_admin_global` no handler
- Tabelas multi-tenant: toda inserção carimba `organization_id` automaticamente via default + RLS
- Dados mockados seedados em `field_modules` e KPIs (constantes no front)
- Site público mantém órbita/pilares atuais; só ganha ThemeToggle no header e link "Entrar" → `/login`

### 7. Entregáveis desta iteração

1. Habilitar Lovable Cloud
2. Migration: enums, tabelas, RLS, functions, trigger
3. Auth pages + guard + listener
4. Theme system + light tokens + toggle + logo dinâmica
5. System Center com 3 pilares, sidebar contextual, módulos, sheets/modais
6. Pilar Field com fluxo Contratar/Operar persistido
7. Pilar Performance com dashboards recharts mockados
8. Admin panel básico

Confirma que sigo com tudo nessa iteração única? Se preferir, posso fatiar (ex.: 1ª iter = Cloud + auth + temas + hub vazio; 2ª iter = módulos completos).