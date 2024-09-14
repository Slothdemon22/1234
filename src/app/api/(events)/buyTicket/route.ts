import connect from "@/helper/dbConn";
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from "next/server";
import EventModel from "../../schemas/event";
import UserModel from "../../schemas/user";

interface JwtPayload {
    id: string;
}

export async function POST(req:NextRequest)
{
    
try {
        await connect()
        const reqBody = await req.json()
        const {eventID} = reqBody

        if(!eventID)
        {
            return NextResponse.json(
                {
                    message: "Incomplete Credentials",
                    success: false
                },
                {
                    status: 400
                }
            )
        }
        const token = req.cookies.get("token")?.value
        if(!token)
        {
            return NextResponse.json(
                {
                    message: "No Token",
                    success: false
                },
                {
                    status: 401
                }
            );
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
        if(!decoded || !decoded.id)
        {
            return NextResponse.json(
                {
                    message: "User ID not found in token.",
                    success: false
                },
                {
                    status: 401
                }
            );
        }

        const userID = decoded.id

        const updatedEvent = await EventModel.findByIdAndUpdate(eventID,
            {$addToSet: {participants: userID}},
            {new: true, runValidators:  true}
        )

        if (!updatedEvent) {
            return NextResponse.json(
                {
                    message: "Event not found or couldn't update",
                    success: false
                },
                {
                    status: 404
                }
            );
        }

        const updatedUser = await UserModel.findByIdAndUpdate(userID,
            {$addToSet: {events: eventID}},
            {new: true, runValidators: true}
        )

        if (!updatedUser) {
            return NextResponse.json(
                {
                    message: "User not found or couldn't update",
                    success: false
                },
                {
                    status: 404
                }
            );
        }

        return NextResponse.json(
            {
                message: "Participant added successfully",
                success: true,
                event: updatedEvent,
                user: updatedUser
            },
            {
                status: 200
            }
        );

    
} catch (error) {
    console.error(error);
        return NextResponse.json(
            {
                message: "An error occurred",
                success: false,
            },
            {
                status: 500
            }
        );
}
}