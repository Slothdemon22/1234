import { JwtPayload } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';
import event from '../../schemas/event';
import TransactionModel from '../../schemas/transactions';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body
      const { amount, eventID } = await req.json(); // Dynamically passed amount from client    
      

    // Get the token from cookies
      const token = req.cookies.get('token');
      

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Verify the token
    let decodedToken: JwtPayload;
    try {
      decodedToken = jwt.verify(token.value, process.env.JWT_SECRET!) as JwtPayload;
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const cusID = decodedToken.id;

    // Create the Stripe checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Dynamically generated product',
              },
              unit_amount: amount, // Amount passed dynamically in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.get('origin')}/success`,
        cancel_url: `${req.headers.get('origin')}/cancel`,
        metadata: {
            userId: cusID, // Add metadata here
            event:eventID
        },
    });
      console.log(amount, eventID);
      const Event=await event.findById(eventID) as any;
      const transaction = await TransactionModel.create({
          name: Event?.name,
          amount: amount,
          date: new Date(),
      })
      Event.transactions.push(transaction._id);
      await Event.save();
      console.log(Event);
      
      
  
      
      

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
