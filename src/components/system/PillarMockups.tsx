import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

const salesData = [
  { d: "Seg", v: 4200 }, { d: "Ter", v: 5800 }, { d: "Qua", v: 5100 },
  { d: "Qui", v: 7200 }, { d: "Sex", v: 9800 }, { d: "Sáb", v: 12400 }, { d: "Dom", v: 8900 },
];
const engagementData = [
  { c: "App", v: 38 }, { c: "Web", v: 27 }, { c: "Email", v: 18 }, { c: "WhatsApp", v: 17 },
];
const leadsData = [
  { name: "Visitas", value: 12400, c: "#3b82f6" },
  { name: "Leads", value: 3200, c: "#60a5fa" },
  { name: "MQL", value: 1100, c: "#93c5fd" },
  { name: "SQL", value: 420, c: "#bfdbfe" },
];

export function PerformanceMockup({ moduleKey, compact }: { moduleKey?: string; compact?: boolean }) {
  if (compact) {
    return (
      <div className="rounded-xl glass p-3 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesData}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#1e3a8a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area dataKey="v" stroke="#3b82f6" fill="url(#g1)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          { k: "Vendas", v: "R$ 218.400" },
          { k: "Ticket médio", v: "R$ 187" },
          { k: "Check-ins", v: "4.218" },
          { k: "ROI", v: "3.4x" },
        ].map((kpi) => (
          <div key={kpi.k} className="rounded-xl border border-border p-3 bg-surface/40">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{kpi.k}</div>
            <div className="mt-1 font-display text-xl font-semibold">{kpi.v}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border p-3 bg-surface/40 h-56">
        <div className="text-xs text-muted-foreground mb-1">Vendas por dia</div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesData}>
            <defs>
              <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#1e3a8a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="d" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Area dataKey="v" stroke="#3b82f6" fill="url(#g2)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-border p-3 bg-surface/40 h-56">
          <div className="text-xs text-muted-foreground mb-1">Engajamento por canal</div>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="c" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="v" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-border p-3 bg-surface/40 h-56">
          <div className="text-xs text-muted-foreground mb-1">Funil de leads</div>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={leadsData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70}>
                {leadsData.map((e, i) => <Cell key={i} fill={e.c} />)}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      {moduleKey && (
        <div className="text-xs text-muted-foreground">
          Visualização contextual do módulo <span className="font-semibold text-foreground">{moduleKey}</span> (mock).
        </div>
      )}
    </div>
  );
}

export function DigitalMockup({ moduleKey, compact }: { moduleKey?: string; compact?: boolean }) {
  if (compact) {
    return (
      <div className="rounded-xl glass p-4 h-40 flex flex-col gap-2">
        <div className="h-3 rounded bg-gradient-to-r from-[#ef4444] to-[#f97316] w-1/2" />
        <div className="h-2 rounded bg-muted w-3/4" />
        <div className="h-2 rounded bg-muted w-2/3" />
        <div className="mt-auto grid grid-cols-3 gap-2">
          {[1,2,3].map(i => <div key={i} className="h-10 rounded-lg bg-surface-2" />)}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border p-4 bg-surface/40">
        <div className="text-xs text-muted-foreground mb-2">Preview do módulo</div>
        <div className="h-32 rounded-lg bg-gradient-to-br from-[#ef4444]/20 to-[#f97316]/20 flex items-center justify-center">
          <span className="font-display text-lg">{moduleKey ?? "Mock"}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {["Setup","Configurar","Publicar"].map((s) => (
          <div key={s} className="rounded-lg border border-border p-3 text-sm text-center bg-surface/40">{s}</div>
        ))}
      </div>
    </div>
  );
}

export function FieldMockup({ moduleKey, compact }: { moduleKey?: string; compact?: boolean }) {
  if (compact) {
    return (
      <div className="rounded-xl glass p-4 h-40 grid grid-cols-2 gap-2">
        {["QR","Facial","Access","Badges"].map((s) => (
          <div key={s} className="rounded-lg bg-gradient-to-br from-[#fbbf24]/25 to-[#d4a017]/15 flex items-center justify-center text-xs font-medium">{s}</div>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border p-4 bg-surface/40">
        <div className="text-xs text-muted-foreground mb-2">Operação in loco</div>
        <div className="grid grid-cols-3 gap-2">
          {["Hoje: 1.248", "Pico: 12:30", "Filas: 0"].map((k) => (
            <div key={k} className="rounded-lg bg-surface-2 p-3 text-xs text-center">{k}</div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-border p-4 bg-surface/40 text-sm">
        Console operacional do módulo <span className="font-semibold">{moduleKey ?? "—"}</span> (mock).
      </div>
    </div>
  );
}
