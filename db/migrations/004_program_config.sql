-- 004: family-chosen configuration for D1-D4 (never silently merged).
-- rhythm/banding/language-timing/exam-precedence are explicit selections
-- with corpus provenance; no pre-selected defaults in schema.

ALTER TABLE programs ADD COLUMN IF NOT EXISTS config jsonb NOT NULL DEFAULT '{}';
ALTER TABLE year_plans ADD COLUMN IF NOT EXISTS config jsonb NOT NULL DEFAULT '{}';
