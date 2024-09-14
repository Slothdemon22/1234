import connect from "@/helper/dbConn";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcrypt'
import jwt from 'jsonwebtoken'
import EventModel from "../../schemas/event";
import UserModel from "../../schemas/user";
interface JwtPayload {
    id: string; // or number, depending on your setup
    // Add other fields if necessary
}

export async function POST(req:NextRequest) {
    try {
        await connect()

        // const token = req.cookies.get("token")?.value
        // if(!token)
        // {
        //     return NextResponse.json(
        //         {
        //             message: "No Token",
        //             success: false
        //         },
        //         {
        //             status: 401
        //         }
        //     );
        // }
        // const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
        // if(!decoded || !decoded.id)
        // {
        //     return NextResponse.json(
        //         {
        //             message: "User ID not found in token.",
        //             success: false
        //         },
        //         {
        //             status: 401
        //         }
        //     );
        // }

        // const adminID = decoded.id
        // const admin = await UserModel.findById(adminID)
        // if(!admin)
        // {
        //     return NextResponse.json(
        //         {
        //             message: "No Admin.",
        //             success: false
        //         },
        //         {
        //             status: 401
        //         }
        //     );
        // }

        // const nonHashedPassword = await bcryptjs.compare("12345678", admin.password )

        // if(admin.email !== "admin@gmail.com" && !nonHashedPassword )
        // {
        //     return NextResponse.json(
        //         {
        //             message: "Invalid Admin Credentials.",
        //             success: false
        //         },
        //         {
        //             status: 401
        //         }
        //     );
        // }


        const reqbody = await req.json()
        const {eventID, authorizationFlag} = reqbody
        if(!eventID  )
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
    
        const Event = await EventModel.findById(eventID)
        if(!Event)
        {
            return NextResponse.json(
                {
                    message: "No event found",
                    success: false
                },
                {
                    status: 500
                }
            )
        }
    
        Event.isAutherized = authorizationFlag
        await Event.save()
    
        return NextResponse.json(
            {
            message: `Event ${authorizationFlag ? "authorized" : "unauthorized"} successfully.`,
            success: true,
            Event,
            },
            {
            status: 200,
            }
        );
    } catch (error) {
        console.log(error);
    return NextResponse.json(
    {
        message: "Error processing request.",
        success: false,
    },
    {
        status: 500,
    }
    );
    }

    
}
