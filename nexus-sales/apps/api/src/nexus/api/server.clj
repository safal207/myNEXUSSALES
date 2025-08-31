(ns nexus.api.server
  (:require [ring.adapter.jetty :as jetty]
            [reitit.ring :as ring]
            [reitit.coercion.spec]
            [reitit.ring.coercion :as coercion]
            [reitit.ring.middleware.muuntaja :as muuntaja]
            [reitit.ring.middleware.parameters :as parameters]
            [muuntaja.core :as m]
            [nexus.api.auth :as auth]))

(def app-routes
  (ring/router
    ["/api"
     ["/health"
      {:get {:handler (fn [_] {:status 200, :body {:status "ok"}})}}]
     ["/auth"
      ["/register"
       {:post {:parameters {:body {:email string? :password string?}}
               :handler    (fn [{{:keys [email password]} :body-params}]
                             (let [result (auth/register! {:email email :password password})]
                               (if (:success result)
                                 {:status 201 :body {:message "User created successfully."}}
                                 {:status 409 :body {:error (:error result)}})))}}]
      ["/login"
       {:post {:parameters {:body {:email string? :password string?}}
               :handler    (fn [{{:keys [email password]} :body-params}]
                             (let [result (auth/login {:email email :password password})]
                               (if (:success result)
                                 {:status 200 :body {:token (:token result)}}
                                 {:status 401 :body {:error (:error result)}})))}}]]]
    {:data {:coercion reitit.coercion.spec/coercion
            :muuntaja m/instance
            :middleware [parameters/parameters-middleware
                         muuntaja/format-negotiate-middleware
                         muuntaja/format-response-middleware
                         coercion/coerce-exceptions-middleware
                         muuntaja/format-request-middleware
                         coercion/coerce-request-middleware
                         coercion/coerce-response-middleware]}}))

(def app (ring/ring-handler app-routes))

(defn -main [& _]
  (println "Starting web server on port 3001")
  (jetty/run-jetty app {:port 3001 :join? false}))
