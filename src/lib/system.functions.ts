import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMyContext = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [{ data: profile }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, avatar_url, organization_id").eq("id", userId).maybeSingle(),
      supabase.from("user_roles").select("role, organization_id").eq("user_id", userId),
    ]);
    let org = null as null | { id: string; name: string; slug: string };
    if (profile?.organization_id) {
      const { data } = await supabase.from("organizations").select("id, name, slug").eq("id", profile.organization_id).maybeSingle();
      org = data ?? null;
    }
    const isAdmin = (roles ?? []).some((r) => r.role === "admin_global");
    return { profile, roles: roles ?? [], org, isAdmin };
  });

export const listFieldModules = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase.from("field_modules").select("module_key, status, organization_id");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const setFieldModuleStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      module_key: z.string().min(1).max(64),
      status: z.enum(["not_contracted", "contracted", "operating"]),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", userId).single();
    if (!profile?.organization_id) throw new Error("Organização não encontrada.");
    const { error } = await supabase
      .from("field_modules")
      .upsert({
        organization_id: profile.organization_id,
        module_key: data.module_key,
        status: data.status,
        updated_at: new Date().toISOString(),
      }, { onConflict: "organization_id,module_key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
