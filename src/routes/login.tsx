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

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — YUZ System Center" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onEmail = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Bem-vindo!");
    nav({ to: "/system" });
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
        <div className="flex items-center justify-between mb-6">
          <YuzLogo />
        </div>
        <h1 className="text-2xl font-display font-semibold">Entrar no YUZ System Center</h1>
        <p className="text-sm text-muted-foreground mt-1">Acesso à plataforma modular de eventos.</p>

        <Button onClick={onGoogle} variant="outline" className="w-full mt-6">
          Continuar com Google
        </Button>
        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> ou <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={onEmail} className="space-y-3">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          Não tem conta? <Link to="/signup" className="text-primary hover:underline">Criar conta</Link>
        </p>
      </div>
    </div>
  );
}
