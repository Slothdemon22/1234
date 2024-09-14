import connect from "@/helper/dbConn";
import {  NextResponse } from "next/server";
import EventModel from "../../schemas/event";


export async function GET()
{
    await connect()
    try {
        const allEvents = await EventModel.find({isAutherized: true})
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

        console.log(allEvents)

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