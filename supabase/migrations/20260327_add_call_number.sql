-- Migration: Add call_number column to accelerator_assets
-- This allows multiple session_notes per user (one per call)

-- 1. Add the call_number column (nullable integer)
ALTER TABLE accelerator_assets ADD COLUMN call_number integer;

-- 2. Set existing session_notes rows to call_number = 1
UPDATE accelerator_assets SET call_number = 1 WHERE asset_type = 'session_notes';

-- 3. Set Max's building session (id: 443711f3-34e0-4d9d-ba34-1e85d15e6091) to call_number = 0
UPDATE accelerator_assets SET call_number = 0 WHERE id = '443711f3-34e0-4d9d-ba34-1e85d15e6091';

-- 4. Drop the old unique constraint on (user_id, asset_type)
--    First find the constraint name:
--    SELECT constraint_name FROM information_schema.table_constraints
--    WHERE table_name = 'accelerator_assets' AND constraint_type = 'UNIQUE';
--    It's likely named: accelerator_assets_user_id_asset_type_key
ALTER TABLE accelerator_assets DROP CONSTRAINT IF EXISTS accelerator_assets_user_id_asset_type_key;

-- 5. Add a new unique constraint that includes call_number
--    Using COALESCE so that null call_number still enforces uniqueness for non-session-notes assets
CREATE UNIQUE INDEX accelerator_assets_user_asset_call_unique
  ON accelerator_assets (user_id, asset_type, COALESCE(call_number, -1));
