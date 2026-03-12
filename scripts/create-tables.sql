create table if not exists mytwenties_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  first_name text not null,
  created_at timestamptz default now()
);

create table if not exists mytwenties_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references mytwenties_users(id),
  section int not null,
  question_id text not null,
  response_type text not null, -- 'scale', 'select', 'multiselect', 'text', 'slider', 'number'
  response_value jsonb not null,
  created_at timestamptz default now()
);

create table if not exists mytwenties_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references mytwenties_users(id),
  report_type text not null default 'free', -- 'free' or 'paid'
  report_data jsonb,
  status text not null default 'pending', -- 'pending', 'ready'
  created_at timestamptz default now()
);
