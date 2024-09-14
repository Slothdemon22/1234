import mongoose, { Document, Schema, Model } from "mongoose";
import TransactionModel from "./transactions";
// Define the Event interface extending mongoose's Document
interface Event extends Document {
    name: string;
    description: string;
    date: Date;
    time: string;
    location: string;
    image: string;
    organizer: mongoose.Types.ObjectId;
    participants: mongoose.Types.ObjectId[];
    transactions: mongoose.Types.ObjectId[];
    isAutherized:Boolean
}

// Create the EventSchema using the Event interface
const EventSchema: Schema<Event> = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isAutherized: {
        type: Boolean,
        default: false
    },
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction"
        }
    ]
}, { timestamps: true }); // timestamps will add createdAt and updatedAt fields


// Check if the model already exists before defining it

const EventModel: Model<Event> = mongoose.models.Event || mongoose.model<Event>("Event", EventSchema)


export default EventModel;
