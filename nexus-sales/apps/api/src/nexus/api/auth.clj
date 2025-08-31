(ns nexus.api.auth
  (:require [buddy.hashers :as hashers]
            [buddy.sign.jwt :as jwt]
            [nexus.api.db.users :as users-db]))

;; In a real app, this secret would come from an environment variable
(def jwt-secret "a-very-secret-and-long-key-that-should-be-in-env")

(defn register!
  "Registers a new user."
  [{:keys [email password]}]
  (if (users-db/get-user-by-email email)
    {:success false :error "User with that email already exists."}
    (do
      (users-db/create-user! email (hashers/encrypt password))
      {:success true})))

(defn login
  "Logs in a user and returns a JWT."
  [{:keys [email password]}]
  (if-let [user (users-db/get-user-by-email email)]
    (if (hashers/check password (:password_hash user))
      {:success true
       :token (jwt/sign {:user-id (:id user) :email email} jwt-secret)}
      {:success false :error "Invalid password."})
    {:success false :error "User not found."}))
