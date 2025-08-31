(ns nexus.api.db.migrate
  (:require [nexus.api.db.core :as db]
            [clojure.java.jdbc :as jdbc]))

(def create-users-table
  "CREATE TABLE IF NOT EXISTS users (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     email TEXT UNIQUE NOT NULL,
     password_hash TEXT NOT NULL,
     created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
   )")

(def create-products-table
  "CREATE TABLE IF NOT EXISTS products (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     user_id INTEGER NOT NULL,
     name TEXT NOT NULL,
     description TEXT,
     price INTEGER NOT NULL,
     created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
     FOREIGN KEY(user_id) REFERENCES users(id)
   )")

(def create-orders-table
  "CREATE TABLE IF NOT EXISTS orders (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     product_id INTEGER NOT NULL,
     customer_email TEXT NOT NULL,
     amount INTEGER NOT NULL,
     created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
     FOREIGN KEY(product_id) REFERENCES products(id)
   )")

(defn -main [& _]
  (println "Running migrations...")
  (jdbc/execute! db/db-spec [create-users-table])
  (jdbc/execute! db/db-spec [create-products-table])
  (jdbc/execute! db/db-spec [create-orders-table])
  (println "Migrations complete."))
