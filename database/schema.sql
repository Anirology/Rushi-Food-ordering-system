-- Rushi Food Ordering System — MySQL 8+
-- Alembic migrations in backend/alembic/versions are the application upgrade path.
CREATE DATABASE IF NOT EXISTS food_ordering_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE food_ordering_db;

CREATE TABLE IF NOT EXISTS categories (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL,
  description TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_name (name),
  UNIQUE KEY uq_categories_slug (slug)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS foods (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(160) NOT NULL,
  slug VARCHAR(180) NOT NULL,
  description TEXT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500) NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_foods_slug (slug),
  KEY ix_foods_category_available (category_id, is_available),
  KEY ix_foods_name (name),
  CONSTRAINT ck_foods_price_positive CHECK (price > 0),
  CONSTRAINT fk_foods_category FOREIGN KEY (category_id) REFERENCES categories (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS customers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(254) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  address VARCHAR(500) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_customers_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_number VARCHAR(32) NOT NULL,
  customer_id BIGINT UNSIGNED NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending','confirmed','preparing','out_for_delivery','delivered','cancelled') NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_orders_order_number (order_number),
  KEY ix_orders_customer_created (customer_id, created_at),
  KEY ix_orders_status_created (status, created_at),
  CONSTRAINT ck_orders_total_nonnegative CHECK (total_amount >= 0),
  CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customers (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id BIGINT UNSIGNED NOT NULL,
  food_id BIGINT UNSIGNED NOT NULL,
  food_name VARCHAR(160) NOT NULL,
  quantity SMALLINT UNSIGNED NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id),
  KEY ix_order_items_order (order_id),
  KEY ix_order_items_food (food_id),
  CONSTRAINT ck_order_items_quantity_positive CHECK (quantity >= 1),
  CONSTRAINT ck_order_items_unit_price_positive CHECK (unit_price > 0),
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders (id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_order_items_food FOREIGN KEY (food_id) REFERENCES foods (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;
