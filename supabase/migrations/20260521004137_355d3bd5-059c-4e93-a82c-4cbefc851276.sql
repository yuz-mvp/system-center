
-- Enums
create type public.app_role as enum ('admin_global', 'organizer', 'operator');
create type public.field_module_status as enum ('not_contracted', 'contracted', 'operating');
create type public.event_status as enum ('draft', 'active', 'closed');

-- Organizations
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  created_at timestamptz not null default now()
);
alter table public.organizations enable row level security;

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  organization_id uuid references public.organizations(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- User roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  organization_id uuid references public.organizations(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, role, organization_id)
);
alter table public.user_roles enable row level security;

-- Security definer functions (avoid RLS recursion)
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_admin_global(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = 'admin_global')
$$;

create or replace function public.get_user_org(_user_id uuid)
returns uuid language sql stable security definer set search_path = public as $$
  select organization_id from public.profiles where id = _user_id
$$;

-- Events
create table public.events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  starts_at timestamptz,
  status public.event_status not null default 'draft',
  created_at timestamptz not null default now()
);
alter table public.events enable row level security;

-- Field module status per organization
create table public.field_modules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  module_key text not null,
  status public.field_module_status not null default 'not_contracted',
  updated_at timestamptz not null default now(),
  unique (organization_id, module_key)
);
alter table public.field_modules enable row level security;

-- Policies: organizations
create policy "admins see all orgs" on public.organizations for select
  using (public.is_admin_global(auth.uid()));
create policy "members see their org" on public.organizations for select
  using (id = public.get_user_org(auth.uid()));
create policy "admins manage orgs" on public.organizations for all
  using (public.is_admin_global(auth.uid())) with check (public.is_admin_global(auth.uid()));

-- Policies: profiles
create policy "users read own profile" on public.profiles for select
  using (id = auth.uid());
create policy "admins read all profiles" on public.profiles for select
  using (public.is_admin_global(auth.uid()));
create policy "users update own profile" on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());
create policy "admins update profiles" on public.profiles for update
  using (public.is_admin_global(auth.uid())) with check (public.is_admin_global(auth.uid()));
create policy "users insert own profile" on public.profiles for insert
  with check (id = auth.uid());

-- Policies: user_roles
create policy "users read own roles" on public.user_roles for select
  using (user_id = auth.uid());
create policy "admins read all roles" on public.user_roles for select
  using (public.is_admin_global(auth.uid()));
create policy "admins manage roles" on public.user_roles for all
  using (public.is_admin_global(auth.uid())) with check (public.is_admin_global(auth.uid()));

-- Policies: events
create policy "admins see all events" on public.events for select
  using (public.is_admin_global(auth.uid()));
create policy "members see their events" on public.events for select
  using (organization_id = public.get_user_org(auth.uid()));
create policy "members manage their events" on public.events for all
  using (organization_id = public.get_user_org(auth.uid()))
  with check (organization_id = public.get_user_org(auth.uid()));
create policy "admins manage all events" on public.events for all
  using (public.is_admin_global(auth.uid())) with check (public.is_admin_global(auth.uid()));

-- Policies: field_modules
create policy "members see their field modules" on public.field_modules for select
  using (organization_id = public.get_user_org(auth.uid()) or public.is_admin_global(auth.uid()));
create policy "members upsert their field modules" on public.field_modules for insert
  with check (organization_id = public.get_user_org(auth.uid()) or public.is_admin_global(auth.uid()));
create policy "members update their field modules" on public.field_modules for update
  using (organization_id = public.get_user_org(auth.uid()) or public.is_admin_global(auth.uid()))
  with check (organization_id = public.get_user_org(auth.uid()) or public.is_admin_global(auth.uid()));

-- Auto-create profile + default org on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  new_org_id uuid;
  org_name text;
begin
  org_name := coalesce(new.raw_user_meta_data->>'organization_name', split_part(coalesce(new.email,'org'), '@', 1) || ' org');
  insert into public.organizations (name, slug)
  values (org_name, lower(regexp_replace(org_name, '[^a-z0-9]+', '-', 'gi')) || '-' || substr(new.id::text, 1, 6))
  returning id into new_org_id;

  insert into public.profiles (id, full_name, organization_id)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email), new_org_id);

  insert into public.user_roles (user_id, role, organization_id)
  values (new.id, 'organizer', new_org_id);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
