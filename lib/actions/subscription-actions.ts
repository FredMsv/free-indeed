"use server";

import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/subscription/stripe";
import { logger } from "@/lib/utils/logger";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// URL vers laquelle rediriger après le paiement
const SUCCESS_URL = `${BASE_URL}/dashboard?payment=success`;
const CANCEL_URL = `${BASE_URL}/dashboard?payment=cancelled`;

export async function createCheckoutSession(priceId: string) {
  const supabase = await createClient();
  
  try {
    // 1. Récupérer l'utilisateur
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Non connecté");

    // 2. Récupérer ou créer le Stripe Customer ID
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id, email')
      .eq('user_id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      // Création d'un nouveau client Stripe
      const customerData = {
        email: user.email,
        metadata: {
          supabaseUUID: user.id
        }
      };
      
      const customer = await stripe.customers.create(customerData);
      customerId = customer.id;

      // Sauvegarde immédiate dans Supabase
      await supabase
        .from('user_profiles')
        .update({ stripe_customer_id: customerId })
        .eq('user_id', user.id);
    }

    // 3. Créer la session de Checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: SUCCESS_URL,
      cancel_url: CANCEL_URL,
      // Optionnel : ajouter une période d'essai si configuré dans Stripe
      subscription_data: {
        metadata: {
          userId: user.id
        }
      }
    });

    if (!session.url) throw new Error("Erreur lors de la création de la session Stripe");

    return { success: true, url: session.url };

  } catch (error) {
    logger.error("Create Checkout Session Error", error);
    return { success: false, error: "Impossible d'initier le paiement." };
  }
}

export async function createCustomerPortal() {
  const supabase = await createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Non connecté");

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return { success: false, error: "Aucun abonnement actif trouvé." };
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${BASE_URL}/settings`,
    });

    return { success: true, url: session.url };

  } catch (error) {
    logger.error("Create Portal Error", error);
    return { success: false, error: "Impossible d'accéder au portail." };
  }
}