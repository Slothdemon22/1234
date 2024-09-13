// app/payment/page.tsx
'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    // Amount in cents (e.g., $20 -> 2000 cents)
    const amount = 10*1000; // Dynamic amount, can come from user input, etc.

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, eventID: '66e4336dd46fa1d770afb815' }),
      });

      const { sessionId } = await res.json();
      const stripe = await stripePromise;

      await stripe?.redirectToCheckout({ sessionId });
      
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-6">Pay  10$</h1>
      <button
        className="bg-blue-500 text-white px-6 py-2 rounded"
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Checkout'}
      </button>
    </div>
  );
}
