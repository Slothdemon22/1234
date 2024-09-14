import connect from "@/helper/dbConn";
import {  NextRequest, NextResponse } from "next/server";
import EventModel from "../../schemas/event";
import jwt from 'jsonwebtoken'
import UserModel from "../../schemas/user";
import bcryptjs from 'bcrypt'

interface JwtPayload {
    id: string; // or number, depending on your setup
    // Add other fields if necessary
}

export async function GET(req: NextRequest)
{
    await connect()
    try {
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

        const adminID = decoded.id
        const admin = await UserModel.findById(adminID)
        if(!admin)
        {
            return NextResponse.json(
                {
                    message: "No Admin.",
                    success: false
                },
                {
                    status: 401
                }
            );
        }

        const nonHashedPassword = await bcryptjs.compare("12345678", admin.password )

        if(admin.email !== "admin@gmail.com" && !nonHashedPassword )
        {
            return NextResponse.json(
                {
                    message: "Invalid Admin Credentials.",
                    success: false
                },
                {
                    status: 401
                }
            );
        }



        const allEvents = await EventModel.find()
        if(!allEvents)
        {
            return NextResponse.json(
                {
                    message: "Couldn't get all events.",
                    success: false
                },
                {
                    status: 500
                }
            )
        }

        return NextResponse.json(
            {
                message: "Got all events.",
                success: true,
                events: allEvents
            },
            {
                status: 201
            }
        )
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {
                message: "Error Caught",
                success: false
            },
            {
                status: 500
            }
        )
    }

}