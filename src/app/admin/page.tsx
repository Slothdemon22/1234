"use client";

import { CalendarIcon, ClockIcon, MapPinIcon, XIcon , CheckIcon} from "lucide-react";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";

// Define an interface for your event object
interface Event {
  _id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  description: string;
  image: string;
}

export default function AdminPanel() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAllEvents = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/getEvents");
      if (data.success) {
        setEvents(data.events);
      } else {
        setError(data.message || "Failed to fetch events");
      }
    } catch (error) {
      setError("An error occurred while fetching events.");
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllEvents();
  }, []);

  const authorize = async(eventID:string, authorizationFlag:boolean)=>
  {
    try {
      //console.log(eventID, authorizationFlag)
        const {data} = await axios.post("http://localhost:3000/api/changeAuthorization",
            {
                eventID,
                authorizationFlag
            }
        )
    
        if(data.success)
        {
            getAllEvents()
        }
    
        else {
            console.error("Failed to change authorization:", data.message);
          }
    
    } catch (error) {
        console.error("Error changing authorization:", error);
    }


  }


  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="flex h-full min-h-screen">
      {/* Welcome Section */}
      <div className="w-1/3 bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white flex flex-col justify-center">
        <h2 className="text-3xl font-extrabold mb-4">Welcome to Your Event Management Dashboard</h2>
        <p className="text-lg">
          Review, edit, and remove events from your platform with ease.
        </p>
      </div>

      {/* Cards Section */}
      <div className="w-2/3 p-8 bg-gray-100 flex flex-wrap justify-center gap-6">
        {events.map((event) => (
          <Card
            key={event._id}
            className="relative bg-white border border-gray-200 shadow-lg rounded-xl hover:shadow-2xl transition-shadow duration-300 w-full md:w-1/2 lg:w-2/5"
          >
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2">
              {/* Tick Button */}
              <button
                aria-label="Authorize"
                className="bg-green-600 text-white p-2 rounded-full shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
                onClick={()=>{authorize(event._id, true)}}
              >
                <CheckIcon className="w-5 h-5" />
              </button>

              {/* Remove Button */}
              <button
                aria-label="Remove"
                className="bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
                onClick={()=>{authorize(event._id, false)}}
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Image Section */}
            <div className="w-full h-48">
              <img
                src={event.image}
                alt="Event"
                className="w-full h-full object-cover rounded-t-xl"
              />
            </div>
            {/* Event Details */}
            <div className="p-6 flex flex-col space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">{event.title}</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <ClockIcon className="w-4 h-4 flex-shrink-0" />
                <span>{event.time}</span>
              </div>
              <p className="text-gray-600">
                {event.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
