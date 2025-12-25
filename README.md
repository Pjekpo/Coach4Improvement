  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

## Booking + Auth + Promo (Supabase)

This project uses Supabase for authentication (email magic link + Google) and a first‑visit promo flow.

Setup:

1) Install deps

```
npm i
```

If starting from scratch, ensure these packages are installed:

```
npm i @supabase/supabase-js zod uuid
```

2) Supabase project

- Create a new project at supabase.com
- Run this SQL in the Supabase SQL editor:

```
create table promo_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  code text not null unique,
  discount_pct int not null default 20,
  issued_at timestamptz not null default now(),
  expires_at timestamptz not null,
  redeemed_at timestamptz
);
alter table promo_codes enable row level security;
create policy "user can read own code" on promo_codes for select using (auth.uid() = user_id);
create policy "user can insert own code" on promo_codes for insert with check (auth.uid() = user_id);
create policy "user can update own code" on promo_codes for update using (auth.uid() = user_id);
```

3) Env variables

Copy `.env.example` to `.env` and fill:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_PROMO_SECRET=dev-secret-change-me
```

4) Dev

```
npm run dev
```

5) Deploy

- This is static hosting; ensure the three env vars above are configured for your builder.
- GitHub Pages builds at compile time; Vite inlines envs from `.env`.

  
