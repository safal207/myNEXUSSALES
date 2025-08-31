(ns nexus.api.routes
  (:require [nexus.api.handlers.auth :as auth]
            [nexus.api.handlers.products :as products]
            [nexus.api.handlers.public :as public]
            [nexus.api.handlers.events :as events]
            [nexus.api.handlers.payments.stripe :as payments.stripe]
            [nexus.api.middleware :as mw]))

(def app-routes
  ["/api"
   ["/health" {:get {:handler (fn [_] {:status 200 :body {:ok true}})}}]

   ["/auth"
    ["/register" {:post {:handler auth/register!}}]
    ["/login"    {:post {:handler auth/login!}}]]

   ["/products"
    {:middleware [mw/require-jwt]}
    ["" {:get  {:handler products/list}
         :post {:handler products/create!}}]
    ["/:id"
     {:get {:handler products/get}
      :patch {:handler products/update!}
      :delete {:handler products/delete!}}]]

   ["/payments"
    ["/stripe"
     ["/checkout-session" {:post {:handler payments.stripe/create-checkout-session!}}]
     ["/webhook"          {:post {:handler payments.stripe/webhook!}}]]]

   ["/public"
    ["/products/:id" {:get {:handler public/get-product}}]
    ["/orders"       {:post {:handler public/create-order!}}]]

   ["/events"
    [""       {:post {:handler events/track!}}]
    ["/batch" {:post {:handler events/track-batch!}}]]])
