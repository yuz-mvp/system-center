# Auditoria do Estado Atual do Projeto

## Resumo executivo

O YUZ MVP esta estruturado como uma aplicacao React com TanStack Start, TanStack Router e Supabase. O projeto ja possui uma base funcional para autenticacao, rotas protegidas, contexto do usuario, administracao basica de organizacoes/usuarios e controle parcial de modulos Field por organizacao.

A camada visual e varios fluxos de produto ainda estao em estado demonstrativo ou estatico. A landing page, os paineis de Digital, Performance, graficos/KPIs, CAEX, dashboards e builders reais ainda nao representam fluxos produtivos completos.

O deploy alvo esta configurado para Cloudflare/Wrangler, mas ainda exige validacao especifica de SSR/TanStack Start, variaveis de ambiente e compatibilidade de runtime.

## Stack identificada

- React 19.
- TypeScript.
- Vite 7.
- TanStack Start.
- TanStack Router.
- TanStack React Query.
- Supabase JS.
- Cloudflare Vite Plugin.
- Wrangler.
- Tailwind CSS 4.
- Radix UI/shadcn-style components.
- Recharts.
- Lucide React.
- Zod.
- Sonner.
- Lovable runtime/config ainda presente.

## Gerenciador de pacotes recomendado

O gerenciador recomendado para este repositório e `npm`.

Motivos:

- `package-lock.json` existe e foi atualizado mais recentemente que `bun.lock`.
- Os scripts em `package.json` sao padrao npm/Vite.
- Ha risco de divergencia entre `package-lock.json` e `bun.lock` se ambos forem usados em paralelo.

## Scripts disponiveis

Scripts declarados em `package.json`:

- `npm run dev`: inicia o servidor de desenvolvimento Vite.
- `npm run build`: executa build de producao com Vite.
- `npm run build:dev`: executa build em modo development.
- `npm run preview`: inicia preview local do build Vite.
- `npm run lint`: executa ESLint no repositorio.
- `npm run format`: executa Prettier com escrita em todo o repositorio.

Observacao: `npm run format` altera arquivos e deve ser usado com cuidado quando houver restricao de escopo.

## Estrutura principal do projeto

- `src/routes`: rotas TanStack Router.
- `src/routes/__root.tsx`: shell raiz, providers, metadata, listener de auth e handlers de erro/404.
- `src/routes/index.tsx`: landing page publica.
- `src/routes/login.tsx`: login por email/senha e OAuth Google via Lovable Cloud Auth.
- `src/routes/signup.tsx`: cadastro por email/senha e OAuth Google via Lovable Cloud Auth.
- `src/routes/_authenticated.tsx`: layout/guard de autenticacao.
- `src/routes/_authenticated/system.tsx`: area autenticada principal do System Center.
- `src/routes/_authenticated/admin.tsx`: area administrativa restrita a `admin_global`.
- `src/components/system`: paineis de pilares e mockups.
- `src/components/ui`: componentes de UI.
- `src/integrations/supabase`: clientes Supabase, middleware de autenticacao e tipos.
- `src/integrations/lovable`: integracao OAuth gerada pela Lovable.
- `src/lib`: server functions, funcoes admin, definicoes de pilares e utilitarios.
- `supabase/migrations`: schema, RLS, roles, tabelas e trigger de criacao de perfil/organizacao.
- `public/brand`: assets de marca usados pela interface.
- `vite.config.ts`: configuracao TanStack/Vite baseada em `@lovable.dev/vite-tanstack-config`.
- `wrangler.jsonc`: configuracao Cloudflare/Wrangler.

## Supabase existente

O projeto possui integracao Supabase real em:

- `src/integrations/supabase/client.ts`.
- `src/integrations/supabase/client.server.ts`.
- `src/integrations/supabase/auth-middleware.ts`.
- `src/integrations/supabase/types.ts`.
- `supabase/config.toml`.
- `supabase/migrations`.

O schema versionado inclui:

- `organizations`.
- `profiles`.
- `user_roles`.
- `events`.
- `field_modules`.
- Enums `app_role`, `field_module_status` e `event_status`.
- Funcoes security definer para roles e organizacao do usuario.
- Politicas RLS para as tabelas principais.
- Trigger `handle_new_user` para criar perfil, organizacao default e role `organizer` no signup.

## Autenticacao existente

A autenticacao ja existe parcialmente e usa Supabase Auth.

Partes reais:

- Login com email/senha via `supabase.auth.signInWithPassword`.
- Signup com email/senha via `supabase.auth.signUp`.
- Criacao automatica de organizacao/perfil/role por trigger Supabase.
- Listener global de mudanca de auth em `__root.tsx`.
- Guard de rota autenticada em `/_authenticated`.
- Middleware server-side `requireSupabaseAuth` validando Bearer token.
- Contexto do usuario via server function `getMyContext`.

Partes dependentes de Lovable:

- OAuth Google usa `@lovable.dev/cloud-auth-js` atraves de `src/integrations/lovable/index.ts`.
- Mensagens de erro ainda referenciam "Connect Supabase in Lovable Cloud".

## Partes reais versus partes mockadas

Partes reais ou parcialmente reais:

- Autenticacao Supabase.
- Signup com criacao de organizacao default.
- Perfil do usuario.
- Roles de usuario.
- Area admin para listar/criar organizacoes.
- Area admin para listar usuarios, atribuir role e associar organizacao.
- Consulta de contexto do usuario autenticado.
- Leitura e atualizacao de status de `field_modules`.

Partes mockadas, estaticas ou demonstrativas:

- Landing page publica.
- Conteudo dos pilares Digital, Field e Performance.
- Modulos Digital.
- Modulos Performance.
- Graficos e KPIs.
- Dashboards.
- CAEX/portal de patrocinador.
- Builders reais.
- Fluxos de participante.
- Fluxos de sponsor.
- Fluxos de operator.
- Fluxos de CRM.
- Visualizacoes de modulo em `PillarMockups.tsx`.

## Dependencias Lovable ainda necessarias

O projeto ainda depende de Lovable em pontos estruturais:

- `@lovable.dev/vite-tanstack-config` em `vite.config.ts`.
- `@lovable.dev/cloud-auth-js` para OAuth em `src/integrations/lovable/index.ts`.
- Comentarios e arquivos auto-gerados com referencias a Lovable.
- Metadata publica em `src/routes/__root.tsx` ainda contem author/twitter Lovable e descricao/imagens herdadas.

Antes de remover Lovable, e necessario substituir a configuracao Vite/TanStack/Cloudflare equivalente e trocar o fluxo OAuth por implementacao propria via Supabase ou outro provider.

## Estado atual do deploy Cloudflare/Wrangler

O projeto possui `wrangler.jsonc` com:

- `name`: `tanstack-start-app`.
- `compatibility_date`: `2025-09-24`.
- `compatibility_flags`: `nodejs_compat`.
- `main`: `src/server.ts`.

O `vite.config.ts` usa `@lovable.dev/vite-tanstack-config` e aponta a entrada server do TanStack Start para `src/server.ts`.

Estado atual: configurado, mas nao validado como pronto para producao. Ainda e necessario validar:

- Build SSR do TanStack Start para Cloudflare.
- Disponibilidade de `process.env` no runtime Cloudflare.
- Variaveis Supabase no ambiente Cloudflare.
- Uso seguro de `SUPABASE_SERVICE_ROLE_KEY`.
- Compatibilidade entre Wrangler, Cloudflare Vite Plugin e configuracao Lovable.
