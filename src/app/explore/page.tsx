"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Explore = () => {
  const [events, setEvents] = useState<any[]>([]);

  const retrieve = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/getEvents");

      if (Array.isArray(data.events)) {
        setEvents(data.events);
      } else {
        console.error("Events data is not an array", data);
      }
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  useEffect(() => {
    retrieve();
  }, []);

  // Helper function to format the date and time separately
  const formatDateTime = (dateString: string) => {
    const eventDate = new Date(dateString);
    const date = eventDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const time = eventDate.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date, time };
  };

  // Function to handle checkout when "Buy" button is clicked
  // Function to handle checkout when "Buy" button is clicked
const handleCheckout = async (eventId: string) => {
  try {
    // Call your API to create a checkout session
    const response = await axios.post("/api/checkout", {
      eventId,
      amount: 3000, // Price in cents
    });

    // Extract the sessionId from the response
    const { sessionId } = response.data;

    // Load Stripe.js and redirect to checkout
    const stripe = await stripePromise;
    const { error } = await stripe?.redirectToCheckout({ sessionId }) || {};

    if (error) {
      console.error("Stripe checkout error:", error);
    }

  } catch (error) {
    console.error("Error processing checkout", error);
  }
};

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center gap-6 px-4 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
            Explore Some{" "}
            <span className="bg-gradient-to-r from-[#099ef1] via-[#6863f8] to-[#ff891f] bg-clip-text text-transparent">
              Exciting Events
            </span>
          </h2>
          <p className="max-w-3xl text-lg sm:text-xl text-gray-300">
            Find the best events in your area and plan your next adventure.
          </p>
          <form className="w-full max-w-md">
            <div className="flex rounded-md shadow-sm gap-3">
              <Input
                type="text"
                placeholder="Search events..."
                className="flex-1 rounded-l-md border-r-0 focus:ring-primary rounded-xl h-10 text-white"
              />
              <Button
                type="submit"
                className="bg-white text-black font-semibold rounded-xl"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Events Cards Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-[#f0f0f0]">
        <div className="container mx-auto grid grid-cols-1 gap-10 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {events.length > 0 ? (
            events.map((event) => {
              const { date, time } = formatDateTime(event.date);
              return (
                <Card
                  key={event._id}
                  className="shadow-xl rounded-xl overflow-hidden border border-gray-300 hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"
                >
                  <div className="relative h-60 w-full">
                    <img
                      src={event.image}
                      alt={event.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardContent className="space-y-3 p-6 bg-white">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {event.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {event.description}
                    </p>
                    <div className="flex flex-col space-y-2">
                      <div className="text-gray-700 font-medium">
                        <span className="font-semibold">Date:</span> {date}
                      </div>
                      <div className="text-gray-700 font-medium">
                        <span className="font-semibold">Time:</span> {time}
                      </div>
                      <div className="text-gray-700 font-medium">
                        <span className="font-semibold">Location:</span>{" "}
                        {event.location || "To be announced"}
                      </div>
                      <div className="text-gray-700 font-medium">
                        <span className="font-semibold text-lg text-blue-600">
                          Pay <span className="text-2xl font-bold">$3</span>
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  {/* Centering and Styling the Button */}
                  <div className="flex justify-center p-4">
                    <Button
                      className="bg-black text-white font-semibold rounded-lg hover:bg-gray- w-20"
                      onClick={() => handleCheckout(event._id)} // Trigger checkout on click
                    >
                      Buy
                    </Button>
                  </div>
                </Card>
              );
            })
          ) : (
            <p className="text-center text-gray-600">No events found</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Explore;
