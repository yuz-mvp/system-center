# Mapa de Rotas

## Rotas identificadas

| Rota | Tipo | Arquivo | Objetivo |
| --- | --- | --- | --- |
| `/` | Publica | `src/routes/index.tsx` | Landing page publica do YUZ System Center, com apresentacao dos pilares, YaaS, Connect e chamada comercial. |
| `/login` | Publica | `src/routes/login.tsx` | Tela de entrada com email/senha via Supabase Auth e OAuth Google via Lovable Cloud Auth. Redireciona para `/system` apos login. |
| `/signup` | Publica | `src/routes/signup.tsx` | Tela de criacao de conta com nome, organizacao, email e senha. Usa Supabase Auth e trigger Supabase para criar perfil, organizacao e role inicial. |
| `/_authenticated` | Autenticada | `src/routes/_authenticated.tsx` | Layout/guard sem path publico proprio. Verifica sessao via `useAuth`; sem usuario, redireciona para `/login`. |
| `/system` | Autenticada | `src/routes/_authenticated/system.tsx` | Area principal autenticada do System Center. Exibe contexto do usuario, pilares Digital/Field/Performance e modulos. Mostra entrada para Admin quando o usuario e `admin_global`. |
| `/admin` | Restrita | `src/routes/_authenticated/admin.tsx` | Area administrativa para `admin_global`. Lista/cria organizacoes, lista usuarios, atribui roles e associa usuarios a organizacoes. |

## Observacoes de roteamento

- As rotas `/system` e `/admin` sao filhas logicas de `/_authenticated`, mas seus paths finais sao `/system` e `/admin`.
- `/_authenticated` atua como rota de layout/guard e nao como pagina final de produto.
- A restricao de `/admin` ocorre em duas camadas:
  - O usuario precisa estar autenticado pelo guard `/_authenticated`.
  - O componente `AdminPage` exige `ctx.isAdmin`, derivado da role `admin_global`.
- O arquivo gerado `src/routeTree.gen.ts` confirma os paths publicos finais:
  - `/`
  - `/login`
  - `/signup`
  - `/system`
  - `/admin`
