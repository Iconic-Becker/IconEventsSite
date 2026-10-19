-- Iconic Photos schema. Applied by server/db/migrate.js, which records each
-- numbered statement block in schema_migrations. Add new blocks at the end;
-- never edit an applied one.

-- migration: 001 initial
create table if not exists users (
  id bigserial primary key,
  email text not null unique,
  name text not null default '',
  password_hash text not null,
  role text not null check (role in ('owner', 'editor')),
  disabled boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists sessions (
  id text primary key,
  user_id bigint not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);
create index if not exists sessions_user_idx on sessions(user_id);

create table if not exists galleries (
  id bigserial primary key,
  slug text not null unique,
  title text not null,
  subtitle text not null default '',
  event_date date,
  location text not null default '',
  intro text not null default '',
  visible boolean not null default true,
  password_hash text,
  password_version integer not null default 0,
  settings jsonb not null default '{}'::jsonb,
  cover_media_id bigint,
  client_logo_key text,
  content_version integer not null default 1,
  trashed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists albums (
  id bigserial primary key,
  gallery_id bigint not null references galleries(id) on delete cascade,
  name text not null,
  slug text not null,
  sort integer not null default 0,
  cover_media_id bigint,
  is_highlights boolean not null default false,
  created_at timestamptz not null default now(),
  unique (gallery_id, slug)
);

create table if not exists media (
  id bigserial primary key,
  gallery_id bigint not null references galleries(id) on delete cascade,
  album_id bigint references albums(id) on delete set null,
  kind text not null check (kind in ('photo', 'video')),
  filename text not null,
  rel_path text not null,
  size_bytes bigint not null default 0,
  content_type text not null default 'application/octet-stream',
  original_key text not null,
  width integer,
  height integer,
  duration_s real,
  captured_at timestamptz,
  sort integer not null default 0,
  status text not null default 'uploading'
    check (status in ('uploading', 'uploaded', 'processing', 'ready', 'failed', 'attention')),
  derivatives jsonb not null default '{}'::jsonb,
  meta jsonb not null default '{}'::jsonb,
  upload_id text,
  highlighted boolean not null default false,
  trashed_at timestamptz,
  error text,
  created_at timestamptz not null default now()
);
create index if not exists media_gallery_idx on media(gallery_id, album_id, sort);
create index if not exists media_status_idx on media(status);

alter table galleries drop constraint if exists galleries_cover_media_fk;
alter table galleries add constraint galleries_cover_media_fk
  foreign key (cover_media_id) references media(id) on delete set null;
alter table albums drop constraint if exists albums_cover_media_fk;
alter table albums add constraint albums_cover_media_fk
  foreign key (cover_media_id) references media(id) on delete set null;

create table if not exists reels (
  id bigserial primary key,
  gallery_id bigint not null references galleries(id) on delete cascade,
  media_id bigint not null unique references media(id) on delete cascade,
  title text not null default '',
  description text not null default '',
  sort integer not null default 0,
  is_public boolean not null default false,
  clip_start_s real not null default 0,
  created_at timestamptz not null default now()
);

-- One row per guest per gallery. synced_at and sync_meta exist so a
-- GoHighLevel webhook can record what it has sent without a migration.
create table if not exists guests (
  id bigserial primary key,
  gallery_id bigint not null references galleries(id) on delete cascade,
  email text not null,
  name text not null default '',
  token text not null unique,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  synced_at timestamptz,
  sync_meta jsonb not null default '{}'::jsonb,
  unique (gallery_id, email)
);

create table if not exists favorites (
  guest_id bigint not null references guests(id) on delete cascade,
  media_id bigint not null references media(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (guest_id, media_id)
);
create index if not exists favorites_media_idx on favorites(media_id);

create table if not exists events (
  id bigserial primary key,
  gallery_id bigint not null references galleries(id) on delete cascade,
  media_id bigint references media(id) on delete cascade,
  reel_id bigint references reels(id) on delete cascade,
  type text not null,
  visitor text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists events_gallery_idx on events(gallery_id, type);
create index if not exists events_media_idx on events(media_id, type);
create index if not exists events_reel_idx on events(reel_id, type);

create table if not exists zips (
  id bigserial primary key,
  gallery_id bigint not null references galleries(id) on delete cascade,
  album_id bigint references albums(id) on delete cascade,
  size text not null check (size in ('social', 'full')),
  content_version integer not null,
  part integer not null default 1,
  parts integer not null default 1,
  key text,
  bytes bigint,
  status text not null default 'building' check (status in ('building', 'ready', 'failed')),
  error text,
  created_at timestamptz not null default now()
);
create unique index if not exists zips_unique_idx
  on zips(gallery_id, coalesce(album_id, 0), size, content_version, part);

create table if not exists jobs (
  id bigserial primary key,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'queued' check (status in ('queued', 'running', 'done', 'failed')),
  attempts integer not null default 0,
  run_after timestamptz not null default now(),
  locked_at timestamptz,
  finished_at timestamptz,
  error text,
  created_at timestamptz not null default now()
);
create index if not exists jobs_queue_idx on jobs(status, run_after);

-- migration: 002 links
-- Extra share links per gallery. Each shows a chosen set of albums, with
-- its own optional password. The gallery's own slug stays the main link.
create table if not exists links (
  id bigserial primary key,
  gallery_id bigint not null references galleries(id) on delete cascade,
  slug text not null unique,
  name text not null default '',
  album_ids bigint[],
  include_reels boolean not null default true,
  password_hash text,
  password_version integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists links_gallery_idx on links(gallery_id);
alter table zips add column if not exists link_id bigint references links(id) on delete cascade;
drop index if exists zips_unique_idx;
create unique index if not exists zips_unique_idx
  on zips(gallery_id, coalesce(album_id, 0), coalesce(link_id, 0), size, content_version, part);
alter table events add column if not exists link_id bigint references links(id) on delete set null;
