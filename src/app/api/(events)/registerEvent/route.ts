import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/helper/dbConn";
import EventModel from "../../schemas/event";
import { NextRequest, NextResponse } from "next/server";
import UserModel from "../../schemas/user";
import jwt, { JwtPayload } from 'jsonwebtoken';
import mongoose, { Document } from "mongoose";

// POST handler for creating an event
export const POST = async (req: NextRequest) => {
    await dbConnect();
    
    // Get token from cookies and verify it
    const cookieStore: any = req.cookies.get('token');
    const decodedToken = jwt.verify(cookieStore.value, process.env.JWT_SECRET!) as JwtPayload;

    //console.log(decodedToken.id);
    const user = await UserModel.findById(decodedToken.id);

    try {
        const { name, description, date, time, location, image, organizer, isAuthorized } = await req.json();

        // Validate that all required fields are present
        if (!name || !description || !date || !time || !location || !image ) {
            return NextResponse.json({
                status: "error",
                message: "All required fields must be provided"
            }, { status: 400 });
        }
     
        // Create a new event
        const event = new EventModel({
            name,
            description,
            date,
            time,
            location,
            image,
            organizer: user?._id,
            isAuthorized
        });

        // Save the event to the database and cast to Document
        const savedEvent = await event.save();

        // Access _id correctly
        const eventId = savedEvent._id as mongoose.Types.ObjectId;

        // Push the event _id into user's organizer array and save the user
        user?.organizer?.push(eventId);
        const res=await user?.save();
        //console.log(res)

        return NextResponse.json({
            status: "success",
            message: "Event created successfully",
            event: savedEvent
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            status: "error",
            message: "Error creating event"
        }, { status: 500 });
    }
};
