import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getMyContext } from "@/lib/system.functions";
import { adminListOrgs, adminCreateOrg, adminListUsers, adminAssignRole, adminSetUserOrg } from "@/lib/admin.functions";
import { YuzLogo } from "@/components/theme/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — YUZ" }] }),
  component: AdminPage,
});

function AdminPage() {
  const nav = useNavigate();
  const fetchCtx = useServerFn(getMyContext);
  const { data: ctx, isLoading } = useQuery({ queryKey: ["my-ctx"], queryFn: () => fetchCtx() });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Carregando…</div>;
  if (!ctx?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass rounded-2xl p-6 max-w-md text-center">
          <h1 className="font-display text-xl font-semibold">Acesso restrito</h1>
          <p className="text-sm text-muted-foreground mt-2">Esta área é exclusiva para Admin Global.</p>
          <Button className="mt-4" onClick={() => nav({ to: "/system" })}>Voltar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero">
      <header className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/system"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
            <YuzLogo /> <span className="text-xs text-muted-foreground">/ Admin</span>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="orgs">
          <TabsList>
            <TabsTrigger value="orgs">Organizações</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
          </TabsList>
          <TabsContent value="orgs" className="mt-6"><OrgsPanel /></TabsContent>
          <TabsContent value="users" className="mt-6"><UsersPanel /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function OrgsPanel() {
  const qc = useQueryClient();
  const list = useServerFn(adminListOrgs);
  const create = useServerFn(adminCreateOrg);
  const { data: orgs = [] } = useQuery({ queryKey: ["admin-orgs"], queryFn: () => list() });
  const [name, setName] = useState("");
  const m = useMutation({
    mutationFn: (n: string) => create({ data: { name: n } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-orgs"] }); setName(""); toast.success("Organização criada."); },
    onError: (e: any) => toast.error(e.message),
  });
  return (
    <div className="space-y-4">
      <div className="glass rounded-xl p-4 flex gap-2 items-end">
        <div className="flex-1">
          <Label htmlFor="orgname">Nova organização</Label>
          <Input id="orgname" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" />
        </div>
        <Button disabled={!name || m.isPending} onClick={() => m.mutate(name)}>Criar</Button>
      </div>
      <div className="glass rounded-xl divide-y divide-border">
        {orgs.map((o: any) => (
          <div key={o.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{o.name}</div>
              <div className="text-xs text-muted-foreground">{o.slug}</div>
            </div>
            <Badge variant="secondary">{new Date(o.created_at).toLocaleDateString()}</Badge>
          </div>
        ))}
        {!orgs.length && <div className="p-6 text-sm text-muted-foreground text-center">Sem organizações ainda.</div>}
      </div>
    </div>
  );
}

function UsersPanel() {
  const qc = useQueryClient();
  const list = useServerFn(adminListUsers);
  const listOrgs = useServerFn(adminListOrgs);
  const assign = useServerFn(adminAssignRole);
  const setOrg = useServerFn(adminSetUserOrg);
  const { data } = useQuery({ queryKey: ["admin-users"], queryFn: () => list() });
  const { data: orgs = [] } = useQuery({ queryKey: ["admin-orgs"], queryFn: () => listOrgs() });
  const profiles = data?.profiles ?? [];
  const roles = data?.roles ?? [];

  const assignM = useMutation({
    mutationFn: (v: any) => assign({ data: v }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-users"] }); toast.success("Papel atribuído."); },
    onError: (e: any) => toast.error(e.message),
  });
  const orgM = useMutation({
    mutationFn: (v: any) => setOrg({ data: v }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-users"] }); toast.success("Organização atualizada."); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="glass rounded-xl divide-y divide-border">
      {profiles.map((u: any) => {
        const userRoles = roles.filter((r: any) => r.user_id === u.id).map((r: any) => r.role);
        return (
          <div key={u.id} className="p-4 grid md:grid-cols-4 gap-3 items-center">
            <div>
              <div className="font-medium">{u.full_name ?? "—"}</div>
              <div className="text-xs text-muted-foreground truncate">{u.id.slice(0, 8)}…</div>
              <div className="mt-1 flex gap-1 flex-wrap">
                {userRoles.map((r: string) => <Badge key={r} variant="outline" className="text-[10px]">{r}</Badge>)}
              </div>
            </div>
            <Select value={u.organization_id ?? ""} onValueChange={(v) => orgM.mutate({ user_id: u.id, organization_id: v })}>
              <SelectTrigger><SelectValue placeholder="Organização" /></SelectTrigger>
              <SelectContent>
                {orgs.map((o: any) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select onValueChange={(v) => assignM.mutate({ user_id: u.id, role: v, organization_id: u.organization_id })}>
              <SelectTrigger><SelectValue placeholder="Atribuir papel…" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin_global">Admin Global</SelectItem>
                <SelectItem value="organizer">Organizador</SelectItem>
                <SelectItem value="operator">Operador</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground text-right">{new Date(u.created_at).toLocaleDateString()}</div>
          </div>
        );
      })}
      {!profiles.length && <div className="p-6 text-sm text-muted-foreground text-center">Sem usuários ainda.</div>}
    </div>
  );
}
