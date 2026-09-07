CREATE INDEX IF NOT EXISTS idx_notification_user_created_at
ON koi_breeding.notification (user_id, created_at DESC)

CREATE INDEX idx_koi_pond
ON koi_breeding.koi (pond_id);

CREATE INDEX idx_pond_owner_id
ON koi_breeding.pond (owner_id, id);

CREATE INDEX idx_transaction_wallet_type_created
ON koi_breeding.transactions
(wallet_id, transaction_type, created_at DESC);