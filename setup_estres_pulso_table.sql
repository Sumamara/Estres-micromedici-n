-- ═══════════════════════════════════════════════════════════════════════════
--  MEDICIÓN DE CONTROL · ESQUEMA DE SUPABASE (Tabla: Estres_Pulso)
--  Micro-Pulso Semanal (SIMs / EMA) · 5 Indicadores · Sesiones 1 a 5
--
--  INSTRUCCIONES DE INSTALACIÓN:
--    1. Entrá a tu panel de Supabase: https://supabase.com/dashboard
--    2. Seleccioná tu proyecto y andá a la pestaña: "SQL Editor"
--    3. Hacé clic en "New query"
--    4. Copiá y pegá TODO este archivo
--    5. Hacé clic en el botón verde "Run"
--
--  * Es 100% IDEMPOTENTE: podés ejecutarlo varias veces sin perder datos.
-- ═══════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────────
-- 1. CREACIÓN DE LA TABLA 'Estres_Pulso'
-- ───────────────────────────────────────────────────────────────────────────
create table if not exists public."Estres_Pulso" (
    id                  uuid        primary key default gen_random_uuid(),

    -- Participante, sesión y marca de tiempo
    nombre              text        not null,
    sesion              smallint    not null check (sesion between 1 and 5),
    creado_en           timestamptz not null default now(),

    -- 5 Indicadores SIMs / EMA (escala de 6 niveles: 0, 20, 40, 60, 80, 100)
    -- Meta ↑ Subir
    desconectar         smallint    not null check (desconectar between 0 and 100),
    organizar           smallint    not null check (organizar between 0 and 100),
    recargar            smallint    not null check (recargar between 0 and 100),
    regular             smallint    not null check (regular between 0 and 100),

    -- Meta ↓ Bajar (Indicador inverso)
    carga_corporal      smallint    not null check (carga_corporal between 0 and 100),

    -- Índice global de control semanal (0–100, con carga_corporal invertida)
    indice_control      smallint    not null check (indice_control between 0 and 100),

    -- Tiempo activo respondiendo el micro-pulso (en segundos)
    tiempo_segundos     integer
);

-- ───────────────────────────────────────────────────────────────────────────
-- 2. COMENTARIOS E ÍNDICES
-- ───────────────────────────────────────────────────────────────────────────
comment on table public."Estres_Pulso" is
    'Medición de control semanal (SIMs / EMA): 5 indicadores de 0% a 100% por sesión (1 a 5)';

create index if not exists estres_pulso_creado_en_idx
    on public."Estres_Pulso" (creado_en desc);

create index if not exists estres_pulso_sesion_idx
    on public."Estres_Pulso" (sesion, creado_en desc);

-- ───────────────────────────────────────────────────────────────────────────
-- 3. SEGURIDAD (ROW LEVEL SECURITY - RLS)
-- ───────────────────────────────────────────────────────────────────────────
alter table public."Estres_Pulso" enable row level security;

-- Permitir que la aplicación web pública (rol anon) inserte mediciones
drop policy if exists "Insertar mediciones Estres_Pulso desde la web" on public."Estres_Pulso";

create policy "Insertar mediciones Estres_Pulso desde la web"
    on public."Estres_Pulso"
    for insert
    to anon
    with check (true);

-- Nota de seguridad:
-- No se habilita SELECT público para 'anon' para proteger la privacidad de los
-- participantes. Vos podés consultar y exportar todas las sesiones desde el
-- Table Editor de Supabase o mediante Service Role Key.
