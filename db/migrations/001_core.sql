-- 001: core schema — one family-owned source for all six documents + XuVi Story.
-- Invariants live here AND in src/model/validation.ts (defense in depth).
-- Conventions: uuid PKs, snake_case, provenance jsonb on every derived field,
-- hours split official_hours vs allocated_hours, Attempt has NO score column.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS schema_migrations (
  name text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS families (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- No child logins exist anywhere by construction: children are profiles owned
-- by the teacher's family (constraint T10).
CREATE TABLE IF NOT EXISTS child_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  age_band text NOT NULL,
  grade text NOT NULL,
  language text NOT NULL DEFAULT 'vi',
  needs text,
  provenance jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  philosophy text NOT NULL DEFAULT '',
  goals text NOT NULL DEFAULT '',
  qualities text NOT NULL DEFAULT '',
  competencies text NOT NULL DEFAULT '',
  areas text NOT NULL DEFAULT '',
  methods text NOT NULL DEFAULT '',
  assessment text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'locked')),
  provenance jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS grade_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  grade text NOT NULL,
  subjects jsonb NOT NULL DEFAULT '[]',
  objectives text NOT NULL DEFAULT '',
  outcomes text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  -- official_hours: MOET-prescribed only {tiet_per_year, subject, grade, strand_percent?}
  official_hours jsonb NOT NULL DEFAULT '{}',
  -- allocated_hours: family-assigned {unit: block_weeks|periods_per_week|clock_minutes|tiet, value}
  allocated_hours jsonb NOT NULL DEFAULT '{}',
  methods text NOT NULL DEFAULT '',
  materials text NOT NULL DEFAULT '',
  provenance jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS alignment_rows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_program_id uuid NOT NULL REFERENCES grade_programs(id) ON DELETE CASCADE,
  -- Product-generated id, MUST be labelled as such in UI/exports (T1).
  internal_id text NOT NULL,
  moet_subject text NOT NULL,
  moet_grade text NOT NULL,
  moet_level text NOT NULL DEFAULT '',
  moet_strand text NOT NULL DEFAULT '',
  moet_topic text NOT NULL DEFAULT '',
  yeu_cau_can_dat_verbatim text NOT NULL CHECK (char_length(yeu_cau_can_dat_verbatim) > 0),
  paired_noi_dung text NOT NULL DEFAULT '',
  source_locator jsonb NOT NULL DEFAULT '{}',
  competency_refs jsonb NOT NULL DEFAULT '{}',
  homeschool_content text NOT NULL DEFAULT '',
  official_hours jsonb NOT NULL DEFAULT '{}',
  allocated_hours jsonb NOT NULL DEFAULT '{}',
  verification text NOT NULL DEFAULT 'observation'
    CHECK (verification IN ('observation', 'artifact', 'oral', 'periodic_task')),
  -- Product taxonomy, labelled as such in UI/exports (T1).
  degree text NOT NULL DEFAULT 'chua_bao_phu'
    CHECK (degree IN ('day_du', 'mot_phan', 'deferred', 'tiep_can_khac', 'chua_bao_phu')),
  deferred_roadmap text NOT NULL DEFAULT '',
  confirmed boolean NOT NULL DEFAULT false,
  provenance jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS year_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  year_label text NOT NULL,
  weeks_total integer NOT NULL CHECK (weeks_total > 0),
  festival_weeks integer NOT NULL DEFAULT 0 CHECK (festival_weeks >= 0),
  dates jsonb NOT NULL DEFAULT '{}',
  subject_distribution jsonb NOT NULL DEFAULT '{}',
  monthly_themes jsonb NOT NULL DEFAULT '[]',
  activities text NOT NULL DEFAULT '',
  assessment_schedule text NOT NULL DEFAULT '',
  contingency text NOT NULL DEFAULT '',
  -- family-chosen rhythm/banding, never a hard-coded Waldorf fact (C2).
  rhythm_provenance text NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS timetable_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year_plan_id uuid NOT NULL REFERENCES year_plans(id) ON DELETE CASCADE,
  week integer NOT NULL CHECK (week > 0),
  -- 1..5 = Mon..Fri (default template 08:00-15:00 = 420 min/day).
  day integer NOT NULL CHECK (day BETWEEN 1 AND 5),
  start_min integer NOT NULL CHECK (start_min >= 0),
  end_min integer NOT NULL CHECK (end_min > start_min),
  content text NOT NULL DEFAULT '',
  owner text NOT NULL DEFAULT '',
  objectives text NOT NULL DEFAULT '',
  planned_minutes integer NOT NULL CHECK (planned_minutes > 0),
  actual_minutes integer CHECK (actual_minutes IS NULL OR actual_minutes >= 0),
  kind text NOT NULL CHECK (kind IN ('instructional', 'routine', 'activity'))
);

CREATE TABLE IF NOT EXISTS journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_profile_id uuid NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
  entry_date date NOT NULL,
  content_delivered text NOT NULL DEFAULT '',
  attendance text NOT NULL DEFAULT '',
  assessment_notes text NOT NULL DEFAULT '',
  assignments text NOT NULL DEFAULT '',
  artifact_refs jsonb NOT NULL DEFAULT '[]',
  progress_notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS periodic_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_profile_id uuid NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
  period_label text NOT NULL,
  narrative text NOT NULL DEFAULT '',
  signoff text NOT NULL DEFAULT '',
  signoff_at timestamptz
);

-- XuVi Story ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  title text NOT NULL,
  source_filename text NOT NULL DEFAULT '',
  extracted_text text NOT NULL DEFAULT '',
  language text NOT NULL DEFAULT 'vi',
  source_rights text NOT NULL DEFAULT '',
  usage_rights text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  age text NOT NULL,
  language text NOT NULL DEFAULT 'vi',
  context text NOT NULL DEFAULT '',
  practice_goal text NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS story_maps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audience_id uuid NOT NULL REFERENCES audiences(id) ON DELETE CASCADE,
  chapters jsonb NOT NULL DEFAULT '[]',
  characters jsonb NOT NULL DEFAULT '[]',
  essential_details jsonb NOT NULL DEFAULT '[]',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed')),
  confirmed_at timestamptz
);

CREATE TABLE IF NOT EXISTS scene_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_map_id uuid NOT NULL REFERENCES story_maps(id) ON DELETE CASCADE,
  scene_ref text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('generated', 'uploaded')),
  style text NOT NULL DEFAULT '',
  storage_path text NOT NULL DEFAULT '',
  -- Mandatory parent gate: only 'approved' images may enter practice (T5).
  review_status text NOT NULL DEFAULT 'pending'
    CHECK (review_status IN ('pending', 'approved', 'replaced'))
);

-- NOTE: no score/ranking column exists on attempts by design (T9).
CREATE TABLE IF NOT EXISTS attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audience_id uuid NOT NULL REFERENCES audiences(id) ON DELETE CASCADE,
  scene_image_id uuid REFERENCES scene_images(id) ON DELETE SET NULL,
  audio_path text NOT NULL DEFAULT '',
  assistance text NOT NULL DEFAULT 'none' CHECK (assistance IN ('none', 'text', 'keywords')),
  prompts_mode text NOT NULL DEFAULT 'free'
    CHECK (prompts_mode IN ('with_prompts', 'fading', 'free')),
  transcript text NOT NULL DEFAULT '',
  transcript_corrected text NOT NULL DEFAULT '',
  -- Fixed form only: {strengths, missing_or_altered, one_next_step, excerpts}.
  feedback jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alignment_grade ON alignment_rows(grade_program_id);
CREATE INDEX IF NOT EXISTS idx_slots_plan ON timetable_slots(year_plan_id);
CREATE INDEX IF NOT EXISTS idx_journal_child ON journal_entries(child_profile_id);
CREATE INDEX IF NOT EXISTS idx_attempts_audience ON attempts(audience_id);
