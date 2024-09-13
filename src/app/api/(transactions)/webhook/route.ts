import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/helper/stripe'; // Ensure this module is correctly set up
import { headers } from 'next/headers';
import User from '../../schemas/user';
import dbConnect from '@/helper/dbConn';

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = headers().get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Handle specific event types
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
       

        // Extract userId and eventId from metadata and find the user
        const sessionMetadata = session.metadata;
        const sessionUserId = sessionMetadata?.userId;
        const sessionEventId = sessionMetadata?.eventId;
        // if (sessionUserId) {
        //   await dbConnect();
        //   const user = await User.findById(sessionUserId);
        //   if (user) {
        //     console.log('User found:', user);
        //   } else {
        //     console.log('User not found for ID:', sessionUserId);
        //   }
        // }
        
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
   

        // Extract userId and eventId from metadata and find the user
        const paymentIntentMetadata = paymentIntent.metadata;
        const paymentIntentUserId = paymentIntentMetadata?.userId;
        const paymentIntentEventId = paymentIntentMetadata?.eventId;
        // if (paymentIntentUserId) {
        //   await dbConnect();
        //   const user = await User.findById(paymentIntentUserId);
        //   if (user) {
        //     console.log('User found:', user);
        //   } else {
        //     console.log('User not found for ID:', paymentIntentUserId);
        //   }
        // }
        
        break;

      case 'charge.updated':
        const charge = event.data.object as Stripe.Charge;
        

        // If you need to find the user, fetch the PaymentIntent associated with this charge
        if (charge.payment_intent) {
          const paymentIntent = await stripe.paymentIntents.retrieve(charge.payment_intent as string);
          const chargeMetadata = paymentIntent.metadata;
          const chargeUserId = chargeMetadata?.userId;
          const chargeEventId = chargeMetadata?.event;
        //   if (chargeUserId) {
        //     await dbConnect();
        //     const user = await User.findById(chargeUserId);
        //     if (user) {
        //       console.log('User found:', user);
        //     } else {
        //       console.log('User not found for ID:', chargeUserId);
        //     }
        //   }
          
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error('Webhook Error:', error.message);
    return NextResponse.json({ received: false, error: error.message }, { status: 400 });
  }
}
