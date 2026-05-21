import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Play,
  ChevronDown,
  Monitor,
  Radio,
  ChartColumn,
  Layers,
  Shield,
  Headphones,
  RefreshCw,
  Plug,
  X,
  Menu,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YUZ System Center — Plataforma modular para eventos" },
      {
        name: "description",
        content:
          "YUZ System Center unifica operação digital, presença em campo e performance em tempo real em uma única arquitetura modular.",
      },
    ],
  }),
  component: Index,
});

type PillarKey = "digital" | "field" | "performance";

const pillars: Record<
  PillarKey,
  {
    code: string;
    tag: string;
    title: string;
    icon: typeof Monitor;
    modules: string[];
  }
> = {
  digital: {
    code: "01",
    tag: "Experiência",
    title: "YUZ Digital",
    icon: Monitor,
    modules: [
      "Plataforma de inscrição",
      "Credenciamento digital",
      "Engajamento gamificado",
      "App oficial white-label",
      "Jornadas personalizadas",
      "Comunicação segmentada",
    ],
  },
  field: {
    code: "02",
    tag: "Operação",
    title: "YUZ Field",
    icon: Radio,
    modules: [
      "Check-in presencial offline",
      "Controle de acessos por zona",
      "Operação de staff em tempo real",
      "Logística de credenciais",
      "Painel de incidentes",
      "Integração com catracas e RFID",
    ],
  },
  performance: {
    code: "03",
    tag: "Inteligência",
    title: "YUZ Performance",
    icon: ChartColumn,
    modules: [
      "Dashboards em tempo real",
      "Métricas por jornada",
      "Heatmaps de público",
      "Relatórios executivos",
      "Análise preditiva",
      "Exportação para BI",
    ],
  },
};

function PillarCard({
  pkey,
  position,
  open,
  onToggle,
  expandAlign = "left",
  expandDirection = "down",
}: {
  pkey: PillarKey;
  position: string;
  open: boolean;
  onToggle: (k: PillarKey | null) => void;
  expandAlign?: "left" | "right" | "center";
  expandDirection?: "down" | "up";
}) {
  const p = pillars[pkey];
  const Icon = p.icon;
  const expandPos =
    expandAlign === "right"
      ? "right-0"
      : expandAlign === "center"
        ? "left-1/2 -translate-x-1/2"
        : "left-0";
  return (
    <div className={`absolute z-20 ${position}`}>
      {expandDirection === "up" && open && (
        <div
          className={`absolute ${expandPos} bottom-full mb-3 glass rounded-2xl p-5 w-[min(28rem,calc(100vw-2rem))] shadow-gold z-30`}
          style={{ animation: "expand-card 0.25s ease-out both" }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
                  {p.code} — {p.tag}
                </div>
                <div className="font-display font-semibold text-lg">{p.title}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onToggle(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase mb-3">
            Módulos
          </div>
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {p.modules.map((m) => (
              <li key={m} className="flex items-start gap-2">
                <span className="text-primary mt-0.5">›</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="button"
        onClick={() => onToggle(open ? null : pkey)}
        className={`group block text-left glass rounded-2xl p-5 w-56 transition-all duration-300 ${
          open ? "border-primary/60 shadow-gold" : "hover:border-primary/40"
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
            {p.tag}
          </div>
        </div>
        <div className="font-display font-semibold">{p.title}</div>
        <div className="mt-2 flex items-center gap-1 text-[10px] font-mono tracking-wider text-primary/90 uppercase">
          {open ? "Fechar" : "Saiba mais"}
          <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && expandDirection === "down" && (
        <div
          className={`absolute ${expandPos} top-full mt-3 glass rounded-2xl p-5 w-[min(28rem,calc(100vw-2rem))] shadow-gold z-30`}
          style={{ animation: "expand-card 0.25s ease-out both" }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">
                  {p.code} — {p.tag}
                </div>
                <div className="font-display font-semibold text-lg">{p.title}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onToggle(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase mb-3">
            Módulos
          </div>
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {p.modules.map((m) => (
              <li key={m} className="flex items-start gap-2">
                <span className="text-primary mt-0.5">›</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Index() {
  const [openPillar, setOpenPillar] = useState<PillarKey | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 glass border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3">
            <img src="/brand/logo_white.png" alt="YUZ" className="h-7 w-auto" />
            <span className="font-display text-base tracking-tight text-muted-foreground border-l border-border/60 pl-3">
              System Center
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-8">
            {[
              ["#system", "Sistema"],
              ["#pillars", "Pilares"],
              ["#yaas", "YaaS"],
              ["#connect", "Connect"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-1.5 text-xs font-mono tracking-wider text-muted-foreground hover:text-foreground transition-colors">
              PT-BR <ChevronDown className="h-3 w-3" />
            </button>
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-gold hover:scale-[1.02] transition-transform"
            >
              Falar com vendas
            </a>
            <button className="md:hidden">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section id="top" className="relative pt-32 pb-24 overflow-hidden bg-hero">
          <div className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

          {/* Orbit */}
          <div className="absolute right-[5%] top-[18%] hidden lg:block">
            <div className="relative w-[400px] h-[400px]">
              {/* 3 rings */}
              <div className="absolute inset-0 rounded-full border border-primary/10" />
              <div className="absolute inset-8 rounded-full border border-primary/15" />
              <div className="absolute inset-20 rounded-full border border-primary/20" />

              {/* Center logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <span className="absolute inset-0 rounded-full bg-primary/30 blur-3xl scale-150" />
                  <img
                    src="/brand/icon.svg"
                    alt="YUZ"
                    className="relative h-36 w-36 drop-shadow-[0_0_40px_rgba(255,180,60,0.25)]"
                  />
                </div>
              </div>

              {/* Orbiting pillars: one dot per ring, each different color */}
              {/* Outer ring: radius 200 */}
              <div
                className="absolute inset-0"
                style={{ animation: "orbit-cw 32s linear infinite" }}
              >
                <span
                  className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
                  style={{
                    background: "#3DA9FC",
                    boxShadow: "0 0 14px #3DA9FC",
                    transform: "translate(-50%, -50%) translateX(200px)",
                  }}
                />
              </div>
              {/* Middle ring: radius 168 (inset-8 = 32px) */}
              <div
                className="absolute inset-0"
                style={{ animation: "orbit-ccw 22s linear infinite" }}
              >
                <span
                  className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
                  style={{
                    background: "#FFD23F",
                    boxShadow: "0 0 14px #FFD23F",
                    transform: "translate(-50%, -50%) translateX(168px) rotate(140deg)",
                  }}
                />
              </div>
              {/* Inner ring: radius 120 (inset-20 = 80px) */}
              <div
                className="absolute inset-0"
                style={{ animation: "orbit-cw 14s linear infinite" }}
              >
                <span
                  className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
                  style={{
                    background: "#FF5A5F",
                    boxShadow: "0 0 14px #FF5A5F",
                    transform: "translate(-50%, -50%) translateX(120px) rotate(260deg)",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="relative mx-auto max-w-7xl px-6">
            <div className="max-w-2xl" style={{ animation: "fade-up 0.6s ease-out both" }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-mono tracking-wider text-muted-foreground mb-8">
                <Sparkles className="h-3 w-3 text-primary" />
                Plataforma modular para eventos
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-semibold tracking-tight leading-[1.05]">
                O centro de comando
                <br />
                <span className="text-gradient-gold">dos eventos modernos.</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
                YUZ System Center unifica operação digital, presença em campo e performance em tempo
                real — em uma única arquitetura modular, elegante e mensurável.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href="#system"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-medium shadow-gold hover:scale-[1.02] transition-transform"
                >
                  Conheça o YUZ System
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
                <button className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full glass text-foreground font-medium hover:bg-secondary transition-colors">
                  <Play className="h-4 w-4 text-primary" />
                  Ver demonstração
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SYSTEM / PILLARS */}
        <section id="system" className="relative py-32 overflow-hidden">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <div className="text-xs font-mono tracking-[0.2em] text-primary uppercase mb-4">
                Arquitetura
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-semibold tracking-tight">
                Um sistema. Três pilares operacionais.
              </h2>
              <p className="mt-5 text-muted-foreground text-lg">
                Cada módulo opera de forma independente — mas conversa em tempo real através do
                núcleo YUZ Core.
              </p>
            </div>

            <div
              id="pillars"
              className="relative h-[560px] max-w-3xl mx-auto flex items-center justify-center"
            >
              {/* Core glow */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[340px] h-[340px] rounded-full bg-primary/20 blur-3xl" />
              </div>

              {/* Core */}
              <div className="relative z-10">
                <div className="relative w-44 h-44 rounded-full glass border-primary/30 flex flex-col items-center justify-center shadow-gold">
                  <span
                    className="absolute inset-0 rounded-full border border-primary/40"
                    style={{ animation: "pulse-ring 3s ease-out infinite" }}
                  />
                  <div className="text-gradient-gold font-display font-semibold text-xl">
                    YUZ Core
                  </div>
                  <div className="text-[10px] text-muted-foreground text-center px-6 mt-1 leading-tight">
                    Núcleo de dados,
                    <br />
                    identidade e orquestração.
                  </div>
                </div>
              </div>

              {/* Connector arrows (one per pillar) */}
              <svg
                className="absolute inset-0 z-10 h-full w-full pointer-events-none overflow-visible"
                viewBox="0 0 768 560"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <marker
                    id="pillar-arrow"
                    markerWidth="10"
                    markerHeight="10"
                    refX="8"
                    refY="5"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <path d="M1 1 L9 5 L1 9 Z" className="fill-primary" />
                  </marker>
                </defs>
                <g
                  className="stroke-primary drop-shadow-[0_0_6px_rgba(255,180,60,0.45)]"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  fill="none"
                  markerEnd="url(#pillar-arrow)"
                >
                  <path d="M170 104 L306 198" />
                  <path d="M598 104 L462 198" />
                  <path d="M384 426 L384 370" />
                </g>
              </svg>

              {/* Three pillar cards */}
              <PillarCard
                pkey="digital"
                position="left-0 top-0"
                expandAlign="left"
                open={openPillar === "digital"}
                onToggle={setOpenPillar}
              />
              <PillarCard
                pkey="field"
                position="right-0 top-0"
                expandAlign="right"
                open={openPillar === "field"}
                onToggle={setOpenPillar}
              />
              <PillarCard
                pkey="performance"
                position="left-1/2 -translate-x-1/2 bottom-0"
                expandAlign="center"
                expandDirection="up"
                open={openPillar === "performance"}
                onToggle={setOpenPillar}
              />
            </div>
          </div>
        </section>

        {/* YAAS */}
        <section id="yaas" className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-hero opacity-60" />
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <div className="text-xs font-mono tracking-[0.2em] text-primary uppercase mb-4">
              YaaS — YUZ as a Service
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-semibold tracking-tight mb-6">
              Sua operação como um serviço contínuo.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
              Mais que software: uma camada operacional gerenciada, com SLA enterprise, suporte 24/7
              e evolução constante da plataforma.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-left">
              {[
                [Layers, "Implantação modular por demanda"],
                [Shield, "SLA enterprise 99.98%"],
                [Headphones, "Equipe dedicada de operações"],
                [RefreshCw, "Atualizações contínuas e seguras"],
              ].map(([Icon, txt], i) => {
                const I = Icon as typeof Layers;
                return (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl glass">
                    <I className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">{txt as string}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CONNECT */}
        <section id="connect" className="relative py-32 bg-surface/40">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-6">
                <Plug className="h-3 w-3 text-primary" />
                <span className="text-xs font-mono tracking-[0.2em] text-primary uppercase">
                  YUZ Connect
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-semibold tracking-tight mb-6">
                Tudo se conecta. Nada fica isolado.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Uma camada de integração que conversa com seus ERPs, CRMs, ferramentas de pagamento
                e parceiros — em tempo real, com segurança enterprise.
              </p>
            </div>
            <div className="mt-16 flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {["REST API", "Webhooks", "OAuth 2.0", "GraphQL", "SSO", "SOC 2"].map((t) => (
                <span
                  key={t}
                  className="px-5 py-2.5 rounded-full glass font-mono text-sm text-foreground/90 hover:border-primary/40 hover:text-primary transition-colors"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-16 relative h-48 overflow-hidden rounded-3xl glass">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glass rounded-2xl px-6 py-4 shadow-gold">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="font-mono text-sm">YUZ Connect API</span>
                    <span className="text-[10px] font-mono text-primary px-2 py-0.5 rounded-full bg-primary/10">
                      v2.4
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-hero" />
          <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-4xl md:text-6xl font-display font-semibold tracking-tight">
              <span className="text-gradient-gold">Pronto para operar no nível enterprise?</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Agende uma demonstração e veja o YUZ System Center em ação.
            </p>
            <a
              href="mailto:contact@yuz.systems"
              className="mt-10 inline-flex items-center gap-2 px-7 py-4 rounded-full bg-primary text-primary-foreground font-medium shadow-gold hover:scale-[1.02] transition-transform"
            >
              Agendar demonstração
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>

        <footer className="border-t border-border/40 py-12">
          <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/brand/logo_white.png" alt="YUZ" className="h-7 w-auto" />
              <div className="pl-3 border-l border-border/60">
                <div className="font-display font-semibold">System Center</div>
                <div className="text-xs text-muted-foreground">
                  O sistema operacional dos eventos modernos.
                </div>
              </div>
            </div>
            <div className="text-xs font-mono text-muted-foreground">
              © 2026 YUZ Systems · Todos os direitos reservados.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
