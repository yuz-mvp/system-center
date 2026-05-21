import {
  Monitor,
  Radio,
  ChartColumn,
  Globe,
  FormInput,
  Ticket,
  ShoppingBag,
  Brain,
  Smartphone,
  IdCard,
  QrCode,
  ScanFace,
  ShieldCheck,
  Users,
  HeadphonesIcon,
  Tv2,
  BadgeCheck,
  Tags,
  Building2,
  DollarSign,
  CreditCard,
  HeartHandshake,
  UsersRound,
  LayoutDashboard,
  Magnet,
  TrendingUp,
  TicketCheck,
  LogIn,
  Gamepad2,
  Contact,
  BarChart3,
  Sparkles,
  Megaphone,
  Code2,
  type LucideIcon,
} from "lucide-react";

export type PillarKey = "digital" | "field" | "performance";

export type ModuleDef = {
  key: string;
  label: string;
  icon: LucideIcon;
  description: string;
  /** Field-only: this module supports the Contratar/Operar lifecycle */
  contractable?: boolean;
  /** Renders a "redirect" badge instead of an inline operate sheet */
  redirect?: boolean;
};

export type PillarDef = {
  key: PillarKey;
  name: string;
  tagline: string;
  icon: LucideIcon;
  /** Tailwind-friendly gradient string for from→to */
  gradient: string;
  /** CSS gradient used inline for accents */
  cssGradient: string;
  /** Solid accent color (for rings/dots) */
  accent: string;
  modules: ModuleDef[];
};

export const PILLARS: Record<PillarKey, PillarDef> = {
  digital: {
    key: "digital",
    name: "YUZ Digital",
    tagline: "Setup, engajamento e vendas online",
    icon: Monitor,
    gradient: "from-[#ef4444] to-[#f97316]",
    cssGradient: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
    accent: "#f97316",
    modules: [
      { key: "site-builder", label: "Site Builder", icon: Globe, description: "Construa o site oficial do evento em minutos." },
      { key: "form-builder", label: "Form Builder", icon: FormInput, description: "Formulários customizados de inscrição e captação." },
      { key: "checkout", label: "Checkout / Ingressos", icon: Ticket, description: "Venda de ingressos com checkout otimizado." },
      { key: "orders", label: "Pedidos", icon: ShoppingBag, description: "Gestão completa de pedidos e reembolsos." },
      { key: "intelligence", label: "YUZ Intelligence", icon: Brain, description: "IA do produtor para insights e automações." },
      { key: "mobile", label: "YUZ Mobile", icon: Smartphone, description: "App white-label oficial do evento." },
    ],
  },
  field: {
    key: "field",
    name: "YUZ Field",
    tagline: "Hardware, infraestrutura e operação in loco",
    icon: Radio,
    gradient: "from-[#fbbf24] to-[#d4a017]",
    cssGradient: "linear-gradient(135deg, #fbbf24 0%, #d4a017 100%)",
    accent: "#d4a017",
    modules: [
      { key: "self-credenciamento", label: "Credenciamento self-service", icon: IdCard, contractable: true, description: "Totem de auto-credenciamento para participantes." },
      { key: "yuz-qr", label: "YUZ QR", icon: QrCode, contractable: true, description: "Operação in loco via QR Code." },
      { key: "yuz-facial", label: "YUZ Facial Ready", icon: ScanFace, contractable: true, description: "Reconhecimento facial para acesso." },
      { key: "yuz-access", label: "YUZ Access Control", icon: ShieldCheck, contractable: true, description: "Controle de acessos por zona e perfil." },
      { key: "field-services", label: "Field Services", icon: Users, contractable: true, description: "Contratação de pessoal in loco." },
      { key: "concierge", label: "Concierge", icon: HeadphonesIcon, contractable: true, description: "Atendimento e operação remota." },
      { key: "totens", label: "Totens", icon: Tv2, contractable: true, description: "Totens informativos e operacionais." },
      { key: "yuz-badges", label: "YUZ Badges", icon: BadgeCheck, contractable: true, description: "Gera mockup de crachá pronto para gráfica." },
      { key: "etiquetas", label: "Etiquetas", icon: Tags, contractable: true, description: "Personalize campos de impressão." },
      { key: "yuz-sponsor", label: "YUZ Sponsor (CAEX)", icon: Building2, contractable: true, redirect: true, description: "Central de Atendimento ao Expositor — área logada isolada do patrocinador." },
    ],
  },
  performance: {
    key: "performance",
    name: "YUZ Performance",
    tagline: "Dados, relatórios e dashboards",
    icon: ChartColumn,
    gradient: "from-[#3b82f6] to-[#1e3a8a]",
    cssGradient: "linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)",
    accent: "#3b82f6",
    modules: [
      { key: "vendas", label: "Vendas", icon: DollarSign, description: "Visão completa de vendas por canal." },
      { key: "pagamentos", label: "Pagamentos", icon: CreditCard, description: "Reconciliação e métodos de pagamento." },
      { key: "engajamento", label: "Engajamento", icon: HeartHandshake, description: "Interações dentro do evento." },
      { key: "participantes", label: "Participantes", icon: UsersRound, description: "Base completa com segmentação." },
      { key: "dashboards", label: "Dashboards", icon: LayoutDashboard, description: "Visão geral customizável." },
      { key: "leads", label: "Leads", icon: Magnet, description: "Leads do evento e por expositor." },
      { key: "roi", label: "ROI", icon: TrendingUp, description: "Retorno por canal, sponsor e segmento." },
      { key: "ticketing", label: "Ticketing", icon: TicketCheck, description: "Indicadores de tickets vendidos vs disponíveis." },
      { key: "checkin", label: "Check-in / Check-out", icon: LogIn, description: "Fluxos e tempos médios de entrada e saída." },
      { key: "engage", label: "YUZ Engage", icon: Gamepad2, description: "Gamificação e jornadas." },
      { key: "crm", label: "YUZ CRM", icon: Contact, description: "Relacionamento contínuo com a base." },
      { key: "analytics", label: "Analytics", icon: BarChart3, description: "Eventos e funis comportamentais." },
      { key: "intelligence-ia", label: "YUZ Intelligence IA", icon: Sparkles, description: "Automação de relatórios via IA." },
      { key: "recommendations", label: "Recommendations", icon: Sparkles, description: "Recomendações inteligentes por perfil." },
      { key: "campaigns", label: "Campaigns", icon: Megaphone, description: "Campanhas multi-canal." },
      { key: "api", label: "YUZ API", icon: Code2, description: "Integração programática com o ecossistema." },
    ],
  },
};

export const PILLAR_ORDER: PillarKey[] = ["digital", "field", "performance"];
