import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getMyContext } from "@/lib/system.functions";
import { supabase } from "@/integrations/supabase/client";
import { PILLARS, PILLAR_ORDER, type PillarKey } from "@/lib/pillars";
import { PillarPanel } from "@/components/system/PillarPanel";
import { YuzLogo } from "@/components/theme/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { LogOut, Shield } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/system")({
  head: () => ({ meta: [{ title: "YUZ System Center" }] }),
  component: SystemCenter,
});

function SystemCenter() {
  const fetchCtx = useServerFn(getMyContext);
  const { data: ctx } = useQuery({ queryKey: ["my-ctx"], queryFn: () => fetchCtx() });
  const [pillar, setPillar] = useState<PillarKey>("digital");
  const nav = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Sessão encerrada.");
    nav({ to: "/login" });
  };

  return (
    <div data-pillar={pillar} className="min-h-screen bg-hero">
      <header className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <YuzLogo />
            <span className="hidden md:inline text-xs text-muted-foreground">/ System Center</span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {PILLAR_ORDER.map((p) => {
              const def = PILLARS[p];
              const active = p === pillar;
              return (
                <button
                  key={p}
                  onClick={() => setPillar(p)}
                  className={`relative px-3 py-1.5 rounded-full text-sm transition ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {active && (
                    <span
                      className="absolute inset-0 rounded-full opacity-20"
                      style={{ background: def.cssGradient }}
                    />
                  )}
                  <span className="relative inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: def.accent }} />
                    {def.name}
                  </span>
                </button>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            {ctx?.isAdmin && (
              <Link to="/admin">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Shield className="h-4 w-4" /> Admin
                </Button>
              </Link>
            )}
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={logout} aria-label="Sair">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {/* Mobile pill nav */}
        <div className="md:hidden border-t border-border px-4 py-2 flex gap-1 overflow-x-auto">
          {PILLAR_ORDER.map((p) => {
            const def = PILLARS[p];
            const active = p === pillar;
            return (
              <button
                key={p}
                onClick={() => setPillar(p)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs ${active ? "bg-surface text-foreground" : "text-muted-foreground"}`}
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full mr-1.5" style={{ background: def.accent }} />
                {def.name}
              </button>
            );
          })}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <div className="text-xs text-muted-foreground">
            Olá, {ctx?.profile?.full_name ?? "operador"}{ctx?.org ? ` · ${ctx.org.name}` : ""}
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold mt-1">
            YUZ System Center
          </h1>
        </div>
        <PillarPanel pillar={pillar} />
      </main>
    </div>
  );
}
