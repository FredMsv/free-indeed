-- Création de la table publique 'users' (ou 'profiles') pour l'UI
-- Cette table est un miroir sécurisé de auth.users accessible par l'application
create table if not exists public.users (
  id uuid not null references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone,
  
  primary key (id)
);

-- Activation de la sécurité Row Level Security (RLS)
alter table public.users enable row level security;

-- Politiques de sécurité (L'utilisateur ne voit que son propre profil publiquement)
create policy "Public users are viewable by everyone."
  on public.users for select
  using ( true );

create policy "Users can insert their own profile."
  on public.users for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.users for update
  using ( auth.uid() = id );

-- FONCTION 1 : handle_new_user
-- Cette fonction est appelée par le trigger 'on_auth_user_created' défini dans ton SQL
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- FONCTION 2 : handle_user_deletion
-- Cette fonction est appelée par le trigger 'on_auth_user_deleted' défini dans ton SQL
-- Note : Avec 'on delete cascade' sur la foreign key, c'est souvent automatique, 
-- mais voici la fonction explicite si tu veux gérer des nettoyages supplémentaires (Storage, etc.)
create or replace function public.handle_user_deletion()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  delete from public.users where id = old.id;
  return old;
end;
$$;