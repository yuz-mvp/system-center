import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { YuzLogo } from "@/components/theme/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Criar conta — YUZ System Center" }] }),
  component: SignupPage,
});

function SignupPage() {
  const nav = useNavigate();
  const [fullName, setFullName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onEmail = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + "/system",
        data: { full_name: fullName, organization_name: orgName || undefined },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Conta criada! Verifique seu email para confirmar.");
    nav({ to: "/login" });
  };

  const onGoogle = async () => {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/system" });
    if (r.error) return toast.error("Não foi possível entrar com Google.");
    if (r.redirected) return;
    nav({ to: "/system" });
  };

  return (
    <div className="min-h-screen bg-hero grid-bg flex items-center justify-center p-6">
      <div className="absolute top-6 right-6"><ThemeToggle /></div>
      <div className="w-full max-w-md glass rounded-2xl p-8 shadow-gold">
        <YuzLogo />
        <h1 className="text-2xl font-display font-semibold mt-6">Crie sua conta YUZ</h1>
        <p className="text-sm text-muted-foreground mt-1">Sua organização é criada automaticamente.</p>

        <Button onClick={onGoogle} variant="outline" className="w-full mt-6">
          Continuar com Google
        </Button>
        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> ou <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={onEmail} className="space-y-3">
          <div>
            <Label htmlFor="full">Nome completo</Label>
            <Input id="full" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="org">Nome da organização</Label>
            <Input id="org" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Minha Empresa" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Criando..." : "Criar conta"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          Já tem conta? <Link to="/login" className="text-primary hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
