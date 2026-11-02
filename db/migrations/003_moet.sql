-- 003: MOET reference dataset (read-only reference for Document 3).
-- internal_id is PRODUCT-GENERATED (no MOET outcome codes exist); the flag
-- is stored per row and must be surfaced in UI/exports (T1).

CREATE TABLE IF NOT EXISTS moet_outcomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  internal_id text UNIQUE NOT NULL,
  product_generated_id boolean NOT NULL DEFAULT true,
  subject text NOT NULL,
  grade text NOT NULL DEFAULT '',
  level text NOT NULL DEFAULT '',
  strand text NOT NULL DEFAULT '',
  topic text NOT NULL DEFAULT '',
  yeu_cau_can_dat_verbatim text NOT NULL CHECK (char_length(yeu_cau_can_dat_verbatim) > 0),
  paired_noi_dung text NOT NULL DEFAULT '',
  source_locator jsonb NOT NULL DEFAULT '{}',
  competency_refs jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_moet_subject_grade ON moet_outcomes(subject, grade);
