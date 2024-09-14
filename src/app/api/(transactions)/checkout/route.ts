import { JwtPayload } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';
import event from '../../schemas/event';
import TransactionModel from '../../schemas/transactions';
import dbConnect from '@/helper/dbConn';
import UserModel from '@/app/api/schemas/user';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body
    const { amount, eventId } = await req.json(); // Dynamically passed amount from client  
    console.log(amount,eventId)
    await dbConnect();
      

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
  //   const user = await UserModel.findById(cusID) as any;
  //   {  const { data, error } = await resend.emails.send({
  //     from: 'noReply@tradenexusonline.com',
  //     to: [user.email], // Assuming patient object has an email field
  //     subject: 'Login Confirmation',
  //     react: EmailTemplate({ name: user.name})
      
  // });}

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
       
    });
      //console.log(amount, eventID);
      const Event=await event.findById(eventId) as any;
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
