ALTER TABLE koi_breeding.koi ADD COLUMN IF NOT EXISTS last_care_update_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE koi_breeding.koi ADD COLUMN IF NOT EXISTS hungry_since TIMESTAMP WITH TIME ZONE;

-- Existing fish begin the care clock at rollout, without retroactive hunger damage.
UPDATE koi_breeding.koi SET last_care_update_at = CURRENT_TIMESTAMP WHERE last_care_update_at IS NULL;

-- Hibernate's old enum check may still reject HEALTH when ddl-auto=update is used.
DO $$
DECLARE constraint_name text;
BEGIN
    FOR constraint_name IN
        SELECT conname FROM pg_constraint
        WHERE conrelid = 'koi_breeding.item'::regclass AND contype = 'c'
          AND pg_get_constraintdef(oid) LIKE '%effect_type%'
    LOOP
        EXECUTE format('ALTER TABLE koi_breeding.item DROP CONSTRAINT %I', constraint_name);
    END LOOP;
END;
$$;

ALTER TABLE koi_breeding.item ADD CONSTRAINT item_effect_type_check
    CHECK (effect_type IN ('WATER_QUALITY', 'COOLING', 'HEATING', 'GROWTH', 'MUTATION', 'HEALTH'));

UPDATE koi_breeding.item SET effect_type = 'HEALTH'
WHERE item_type = 'MEDICINE'
  AND name IN ('Disease Cure - Link', 'Disease Cure - MIP', 'Disease Cure - Cloak', 'Health Elixir - KAFKA');
