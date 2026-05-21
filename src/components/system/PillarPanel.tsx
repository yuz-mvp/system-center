import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PILLARS, PILLAR_ORDER, type PillarKey, type ModuleDef } from "@/lib/pillars";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listFieldModules, setFieldModuleStatus } from "@/lib/system.functions";
import { ArrowRight, CheckCircle2, ExternalLink, Wrench } from "lucide-react";
import { toast } from "sonner";
import { DigitalMockup, FieldMockup, PerformanceMockup } from "./PillarMockups";

type Status = "not_contracted" | "contracted" | "operating";

export function PillarPanel({ pillar }: { pillar: PillarKey }) {
  const def = PILLARS[pillar];
  const [openModule, setOpenModule] = useState<ModuleDef | null>(null);
  const [contractTarget, setContractTarget] = useState<ModuleDef | null>(null);
  const qc = useQueryClient();
  const fetchModules = useServerFn(listFieldModules);
  const setStatus = useServerFn(setFieldModuleStatus);

  const { data: fieldRows = [] } = useQuery({
    queryKey: ["field_modules"],
    queryFn: () => fetchModules(),
    enabled: pillar === "field",
  });

  const statusMap = new Map<string, Status>(
    fieldRows.map((r: any) => [r.module_key, r.status as Status]),
  );

  const contractMut = useMutation({
    mutationFn: (vars: { module_key: string; status: Status }) => setStatus({ data: vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["field_modules"] });
      toast.success("Status atualizado.");
    },
    onError: (e: any) => toast.error(e.message ?? "Falha ao atualizar."),
  });

  const renderHeaderArt = () => {
    if (pillar === "digital") return <DigitalMockup compact />;
    if (pillar === "field") return <FieldMockup compact />;
    return <PerformanceMockup compact />;
  };

  return (
    <div data-pillar={pillar} className="space-y-8">
      {/* Hero band */}
      <div className="relative overflow-hidden rounded-2xl glass p-6 md:p-8">
        <div
          className="absolute inset-0 opacity-[0.18] pointer-events-none"
          style={{ background: "var(--pillar-gradient)" }}
        />
        <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3 py-1 text-xs">
              <span className="h-2 w-2 rounded-full" style={{ background: "var(--pillar-accent)" }} />
              {def.tagline}
            </div>
            <h2 className="mt-3 text-3xl md:text-4xl font-display font-semibold tracking-tight">
              {def.name}
            </h2>
            <p className="mt-2 text-muted-foreground max-w-xl">
              {pillar === "digital" && "Tudo que você precisa para vender, capturar e engajar online."}
              {pillar === "field" && "Hardware e equipes prontos para credenciamento, controle de acesso e operação in loco."}
              {pillar === "performance" && "Dados em tempo real, dashboards e IA para decisões mais rápidas."}
            </p>
          </div>
          <div className="hidden md:block w-72">{renderHeaderArt()}</div>
        </div>
      </div>

      {/* Module grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {def.modules.map((m) => {
          const status = (statusMap.get(m.key) ?? "not_contracted") as Status;
          const isContracted = status !== "not_contracted";
          const Icon = m.icon;
          return (
            <button
              key={m.key}
              onClick={() => {
                if (m.contractable && !isContracted) setContractTarget(m);
                else setOpenModule(m);
              }}
              className="group text-left rounded-2xl glass p-5 transition hover:-translate-y-0.5 hover:shadow-gold relative overflow-hidden"
              style={{
                borderImage: "var(--pillar-gradient) 1",
              }}
            >
              <div
                className="absolute inset-x-0 top-0 h-[2px] opacity-90"
                style={{ background: "var(--pillar-gradient)" }}
              />
              <div className="flex items-start justify-between gap-3">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center text-background"
                  style={{ background: "var(--pillar-gradient)" }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                {m.contractable ? (
                  <Badge variant={isContracted ? "default" : "secondary"} className="capitalize">
                    {status === "not_contracted" ? "Contratar" : status === "contracted" ? "Operar" : "Operando"}
                  </Badge>
                ) : (
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition" />
                )}
              </div>
              <h3 className="mt-4 font-display font-semibold text-base">{m.label}</h3>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{m.description}</p>
              {m.redirect && (
                <div className="mt-3 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <ExternalLink className="h-3 w-3" /> Redireciona para o portal do patrocinador
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Operate sheet */}
      <Sheet open={!!openModule} onOpenChange={(o) => !o && setOpenModule(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {openModule && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <span
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-background"
                    style={{ background: "var(--pillar-gradient)" }}
                  >
                    <openModule.icon className="h-4 w-4" />
                  </span>
                  {openModule.label}
                </SheetTitle>
                <SheetDescription>{openModule.description}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                {openModule.redirect ? (
                  <div className="rounded-xl border border-border p-4 bg-surface/40">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <ExternalLink className="h-4 w-4" /> Área isolada do patrocinador
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Este módulo redireciona para uma área logada exclusiva do patrocinador (CAEX).
                    </p>
                    <Button className="mt-4" disabled>Abrir portal CAEX (mock)</Button>
                  </div>
                ) : (
                  <ModuleMockup module={openModule} pillar={pillar} />
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Contract dialog */}
      <Dialog open={!!contractTarget} onOpenChange={(o) => !o && setContractTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="h-4 w-4" /> Contratar {contractTarget?.label}
            </DialogTitle>
            <DialogDescription>
              Ative este módulo na sua organização. Você poderá operá-lo logo em seguida.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-border bg-surface/40 p-3 text-sm">
            <CheckCircle2 className="inline h-4 w-4 mr-1 text-primary" />
            Inclui setup, configuração inicial e treinamento da equipe.
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setContractTarget(null)}>Cancelar</Button>
            <Button
              disabled={contractMut.isPending}
              onClick={() => {
                if (!contractTarget) return;
                contractMut.mutate(
                  { module_key: contractTarget.key, status: "contracted" },
                  { onSuccess: () => setContractTarget(null) },
                );
              }}
            >
              {contractMut.isPending ? "Contratando..." : "Confirmar contratação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ModuleMockup({ module: m, pillar }: { module: ModuleDef; pillar: PillarKey }) {
  if (pillar === "performance") return <PerformanceMockup moduleKey={m.key} />;
  if (pillar === "field") return <FieldMockup moduleKey={m.key} />;
  return <DigitalMockup moduleKey={m.key} />;
}
