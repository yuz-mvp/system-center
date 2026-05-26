# Funcionalidades Ausentes ou Incompletas

## Partes ainda mockadas ou estaticas

### Landing page

A rota `/` funciona como apresentacao institucional. O conteudo e estatico, com cards, secoes e chamadas comerciais sem integracao com CRM, analytics, captura real de leads ou fluxo comercial automatizado.

### Modulos Digital

Os modulos Digital aparecem como definicoes e previews visuais, mas ainda nao existem fluxos reais para inscricao, credenciamento digital, app white-label, comunicacao segmentada, jornadas personalizadas ou engajamento gamificado.

### Modulos Performance

Os modulos Performance ainda estao representados por mockups e dados estaticos. Nao ha pipeline real de metricas, relatorios executivos, analise preditiva, exportacao BI ou leitura de eventos reais.

### Graficos/KPIs

Os graficos usam dados locais estaticos em `PillarMockups.tsx`. KPIs como vendas, ticket medio, check-ins e ROI nao sao calculados a partir de dados persistidos ou eventos reais.

### CAEX

O portal CAEX/patrocinador aparece como redirecionamento desabilitado/mock. Ainda nao ha area isolada real, controle de acesso dedicado, dados de sponsor ou operacao de atendimento.

### Dashboards

Os dashboards atuais sao demonstrativos. Ainda faltam consultas reais, filtros, escopos por organizacao/evento, persistencia, permissoes e atualizacao em tempo real.

### Builders reais

Nao ha builders reais para landing, formulario, jornada, credenciamento, regras de acesso, dashboards ou modulos operacionais. O que existe hoje sao previews e configuracoes superficiais.

### Fluxos de participante, sponsor, operator e CRM

Ainda faltam fluxos completos para:

- Participante: cadastro, ingresso, agenda, check-in, comunicacao e historico.
- Sponsor: portal, leads, CAEX, campanhas, relatorios e permissoes.
- Operator: operacao em campo, filas, incidentes, acessos, credenciais e dispositivos.
- CRM: captura, qualificacao, funil, integracoes, webhooks e sincronizacao.

## Partes ja parcialmente reais

### Auth

Ja existe autenticacao Supabase com email/senha, signup, login, logout, listener global e guard de rotas autenticadas. OAuth Google existe, mas depende de Lovable Cloud Auth.

### Admin

A area `/admin` ja possui interface e server functions para operacoes administrativas basicas, restritas a `admin_global`.

### Organizations

A tabela `organizations` existe com RLS. Organizacoes podem ser criadas automaticamente no signup e manualmente pela area admin.

### Profiles

A tabela `profiles` existe com RLS. Perfis sao criados automaticamente no signup e podem ser associados a organizacoes pela area admin.

### User_roles

A tabela `user_roles` existe com enum `app_role`, RLS e funcoes auxiliares para verificar roles. A area admin permite atribuir roles.

### Events

A tabela `events` existe no schema com RLS e enum de status. Ainda nao ha fluxo de interface completo para gestao de eventos.

### Field_modules

A tabela `field_modules` existe com status por organizacao. A interface do pilar Field consegue consultar e atualizar status de modulos por server functions, mas o comportamento ainda precisa de refinamento de permissoes e produto.
