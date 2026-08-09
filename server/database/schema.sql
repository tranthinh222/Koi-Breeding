CREATE SCHEMA IF NOT EXISTS koi_breeding;

CREATE TYPE GENDER AS ENUM ('MALE', 'FEMALE');

CREATE TYPE USER_STATUS AS ENUM ('ACTIVE', 'DELETED', 'BANNED');

CREATE TYPE ROLE AS ENUM ('USER', 'ADMIN');

CREATE TABLE IF NOT EXISTS koi_breeding.users (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    birthday DATE NOT NULL,
    gender GENDER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status USER_STATUS,
    role ROLE NOT NULL DEFAULT 'USER',
    is_banned BOOLEAN NOT NULL DEFAULT FALSE,
    exp INT NOT NULL DEFAULT 0,
    avatar_url TEXT
);

CREATE TABLE IF NOT EXISTS koi_breeding.wallet (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE TRANSACTION_TYPE AS ENUM ('DEPOSIT', 'BUY_FOOD', 'BUY_FISH', 'SELL_FISH');

CREATE TYPE TRANSACTION_STATUS AS ENUM ('PENDING', 'CANCELLED', 'SUCCESSED', 'FAILED');

CREATE TABLE IF NOT EXISTS koi_breeding.transactions (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    wallet_id INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    transaction_type TRANSACTION_TYPE NOT NULL,
    status TRANSACTION_STATUS NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    description TEXT
);

CREATE TYPE LIFE_STAGE AS ENUM ('EGG', 'LARVA', 'FRY', 'JUVENILE', 'ADULT');

CREATE TABLE IF NOT EXISTS koi_breeding.koi (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender GENDER NOT NULL,
    length DECIMAL(5, 2) NOT NULL,
    weight DECIMAL(6, 2) NOT NULL,
    health SMALLINT NOT NULL DEFAULT 100,
    food_bar SMALLINT NOT NULL DEFAULT 100,
    cure_bar SMALLINT NOT NULL DEFAULT 100,
    price INT NOT NULL,
    mutation_id INT,
    borned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    pond_id INT NOT NULL,
    life_stage LIFE_STAGE NOT NULL DEFAULT 'EGG',
    father_id INT NOT NULL,
    mother_id INT NOT NULL,
    potential decimal(3, 2) NOT NULL DEFAULT 0.00,
    dictionary_id INT NOT NULL,
    pattern_score INT NOT NULL DEFAULT 0,
    color_score INT NOT NULL DEFAULT 0,
    body_score INT NOT NULL DEFAULT 0,
    skin_score INT NOT NULL DEFAULT 0,
    scale_score INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS koi_breeding.variety (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS koi_breeding.mutation (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    rate DECIMAL(4, 2) NOT NULL,
    value DECIMAL(4, 2) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS koi_breeding.pond (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    owner_id INT NOT NULL,
    level INT NOT NULL DEFAULT 1,
    capacity SMALLINT NOT NULL DEFAULT 1,
    water_quality SMALLINT NOT NULL,
    temperature decimal(4, 1) NOT NULL,
    pH decimal (3, 1) NOT NULL,
    oxygen decimal(4, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    description TEXT
);

CREATE TYPE BREEDING_TYPE AS ENUM ('MANUAL', 'AUTOMATIC');

CREATE TYPE BREEDING_STATUS AS ENUM ('STARTED', 'EGG_LAID', 'ISOLATED', 'HATCHED', 'COMPLETED', 'CANCELLED');

CREATE TABLE IF NOT EXISTS koi_breeding.breeding_event (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    male_id INT NOT NULL,
    female_id INT NOT NULL,
    pond_id INT NOT NULL,
    breeding_type BREEDING_TYPE NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expected_hatch_date TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ,
    status BREEDING_STATUS NOT NULL DEFAULT 'STARTED'
);

CREATE TYPE LISTING_STATUS AS ENUM ('ACTIVE', 'SOLD', 'CANCELLED');

CREATE TABLE IF NOT EXISTS koi_breeding.marketplace (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    koi_id INT NOT NULL,
    seller_id INT NOT NULL,
    price INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status LISTING_STATUS NOT NULL DEFAULT 'ACTIVE',
    description TEXT
);

CREATE TABLE IF NOT EXISTS koi_breeding.trade (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    listing_id INT NOT NULL,
    buyer_id INT NOT NULL,
    seller_id INT NOT NULL,
    price INT NOT NULL,
    trade_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE ITEM_TYPE AS ENUM ('FOOD', 'MEDICINE', 'KOI', 'CURRENCY');

CREATE TYPE EFFECT_TYPE AS ENUM ('WATER_QUALITY', 'GROWTH', 'MUTATION');

CREATE TABLE IF NOT EXISTS koi_breeding.item (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    usage_limit SMALLINT NOT NULL DEFAULT 1,
    item_type ITEM_TYPE NOT NULL,
    effect_type EFFECT_TYPE,
    effect_value DECIMAL(10, 2) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS koi_breeding.inventory (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS koi_breeding.koi_item (
    koi_id INT NOT NULL,
    item_id INT NOT NULL,
    used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    description TEXT,

    PRIMARY KEY (koi_id, item_id)
);

CREATE TABLE IF NOT EXISTS koi_breeding.breeding_rate (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    father_id INT NOT NULL,
    mother_id INT NOT NULL,
    child_id INT NOT NULL,
    rate DECIMAL(4, 2) NOT NULL
);

CREATE TYPE SHAPE AS ENUM ('STANDARD', 'BUTTERFLY');

CREATE TYPE SCALE_TYPE AS ENUM ('WAGOI', 'DOITSU', 'GINRIN');

CREATE TABLE IF NOT EXISTS koi_breeding.koi_dictionary (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name varchar(100) NOT NULL,
    shape SHAPE NOT NULL,
    scale_type SCALE_TYPE NOT NULL,
    variety_id INT NOT NULL,
    origin varchar(100) NOT NULL,
    base_max_length decimal(5, 2) NOT NULL,
    base_growth_rate decimal(5, 4) NOT NULL,
    mid_age SMALLINT NOT NULL,
    alpha_weight decimal(8, 7) NOT NULL,
    base_price SMALLINT NOT NULL,
    alpha_price decimal(3, 2) NOT NULL
);

ALTER TABLE koi_breeding.wallet
    ADD CONSTRAINT fk_wallet_user FOREIGN KEY (user_id) REFERENCES koi_breeding.users(id);

ALTER TABLE koi_breeding.transactions
    ADD CONSTRAINT fk_transaction_wallet FOREIGN KEY (wallet_id) REFERENCES koi_breeding.wallet(id);

ALTER TABLE koi_breeding.koi
    ADD CONSTRAINT fk_koi_pond FOREIGN KEY (pond_id) REFERENCES koi_breeding.pond(id),
    ADD CONSTRAINT fk_koi_mutation FOREIGN KEY (mutation_id) REFERENCES koi_breeding.mutation(id),
    ADD CONSTRAINT fk_koi_father FOREIGN KEY (father_id) REFERENCES koi_breeding.koi(id),
    ADD CONSTRAINT fk_koi_mother FOREIGN KEY (mother_id) REFERENCES koi_breeding.koi(id),
    ADD CONSTRAINT fk_koi_dictionary FOREIGN KEY (dictionary_id) REFERENCES koi_breeding.koi_dictionary(id);

ALTER TABLE koi_breeding.pond
    ADD CONSTRAINT fk_pond_owner FOREIGN KEY (owner_id) REFERENCES koi_breeding.users(id);

ALTER TABLE koi_breeding.breeding_event
    ADD CONSTRAINT fk_breeding_event_user FOREIGN KEY (user_id) REFERENCES koi_breeding.users(id),
    ADD CONSTRAINT fk_breeding_event_male FOREIGN KEY (male_id) REFERENCES koi_breeding.koi(id),
    ADD CONSTRAINT fk_breeding_event_female FOREIGN KEY (female_id) REFERENCES koi_breeding.koi(id),
    ADD CONSTRAINT fk_breeding_event_pond FOREIGN KEY (pond_id) REFERENCES koi_breeding.pond(id);

ALTER TABLE koi_breeding.marketplace
    ADD CONSTRAINT fk_marketplace_koi FOREIGN KEY (koi_id) REFERENCES koi_breeding.koi(id),
    ADD CONSTRAINT fk_marketplace_seller FOREIGN KEY (seller_id) REFERENCES koi_breeding.users(id);

ALTER TABLE koi_breeding.trade
    ADD CONSTRAINT fk_trade_listing FOREIGN KEY (listing_id) REFERENCES koi_breeding.marketplace(id),
    ADD CONSTRAINT fk_trade_buyer FOREIGN KEY (buyer_id) REFERENCES koi_breeding.users(id),
    ADD CONSTRAINT fk_trade_seller FOREIGN KEY (seller_id) REFERENCES koi_breeding.users(id);

ALTER TABLE koi_breeding.inventory
    ADD CONSTRAINT fk_inventory_user FOREIGN KEY (user_id) REFERENCES koi_breeding.users(id),
    ADD CONSTRAINT fk_inventory_item FOREIGN KEY (item_id) REFERENCES koi_breeding.item(id);

ALTER TABLE koi_breeding.koi_item
    ADD CONSTRAINT fk_koi_item_koi FOREIGN KEY (koi_id) REFERENCES koi_breeding.koi(id),
    ADD CONSTRAINT fk_koi_item_item FOREIGN KEY (item_id) REFERENCES koi_breeding.item(id);

ALTER TABLE koi_breeding.breeding_rate
    ADD CONSTRAINT fk_breeding_rate_father FOREIGN KEY (father_id) REFERENCES koi_breeding.koi_dictionary(id),
    ADD CONSTRAINT fk_breeding_rate_mother FOREIGN KEY (mother_id) REFERENCES koi_breeding.koi_dictionary(id),
    ADD CONSTRAINT fk_breeding_rate_child FOREIGN KEY (child_id) REFERENCES koi_breeding.koi_dictionary(id);

ALTER TABLE koi_breeding.koi_dictionary
    ADD CONSTRAINT fk_koi_dictionary_variety FOREIGN KEY (variety_id) REFERENCES koi_breeding.variety(id);
