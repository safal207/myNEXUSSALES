(ns nexus.api.db.core
  (:require [clojure.java.jdbc :as jdbc]))

(def db-spec
  {:classname   "org.sqlite.JDBC"
   :subprotocol "sqlite"
   :subname     "nexus.db"})

(defn execute! [sql-vec]
  (jdbc/execute! db-spec sql-vec))

(defn query [sql-vec]
  (jdbc/query db-spec sql-vec))
