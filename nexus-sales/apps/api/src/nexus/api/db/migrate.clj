(ns nexus.api.db.migrate
  (:require [nexus.api.db.core :as db]))

(defn up! []
  (println "Running database migrations...")
  (doseq [sql
          ["CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE, password_hash TEXT, created_at TEXT);"
           "CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, seller_id TEXT, title TEXT, description TEXT, price REAL, active INTEGER, created_at TEXT, updated_at TEXT);"
           "CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, product_id TEXT, email TEXT, status TEXT, created_at TEXT);"
           "CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY, name TEXT, ts TEXT, session_id TEXT, product_id TEXT, order_id TEXT, referrer TEXT, ab_variant TEXT);"]]
    (db/exec! sql))
  (println "Migrations complete."))

(defn -main [& _]
  (up!))
