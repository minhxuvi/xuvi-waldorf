-- 002: teacher credentials, sessions, audit log.
-- Teachers own families; children remain profiles only (T10).

CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  email text,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
-- One login email per teacher (case-insensitive); NULL emails allowed only for tests.
CREATE UNIQUE INDEX IF NOT EXISTS idx_teachers_email ON teachers(lower(email)) WHERE email IS NOT NULL;

CREATE TABLE IF NOT EXISTS sessions (
  token_hash text PRIMARY KEY,
  teacher_id uuid NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Every outbound AI payload + sensitive action is recorded here (R21).
CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid REFERENCES families(id) ON DELETE CASCADE,
  action text NOT NULL,
  provider text NOT NULL DEFAULT 'local',
  payload_type text NOT NULL DEFAULT 'none',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_family ON audit_log(family_id);
