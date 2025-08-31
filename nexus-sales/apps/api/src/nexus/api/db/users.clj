(ns nexus.api.db.users
  (:require [nexus.api.db.core :as db]))

(defn create-user!
  "Creates a new user in the database."
  [email password-hash]
  (db/execute!
    ["INSERT INTO users (email, password_hash) VALUES (?, ?)"
     email password-hash]))

(defn get-user-by-email
  "Retrieves a user by their email address."
  [email]
  (first (db/query ["SELECT * FROM users WHERE email = ? LIMIT 1" email])))
