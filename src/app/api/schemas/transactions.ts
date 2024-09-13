import mongoose, { Document, Schema, Model } from "mongoose";

// Define the Transaction interface extending mongoose's Document
interface Transaction extends Document {
    name: string;
    amount: number;
    category?: string; // Category is optional
    date: Date;
    description: string;
}

// Create the TransactionSchema using the Transaction interface
const TransactionSchema: Schema<Transaction> = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    
    date: {
        type: Date,
        required: true
    },
   
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Export the Transaction model
const TransactionModel: Model<Transaction> = mongoose.models.Transaction || mongoose.model<Transaction>("Transaction", TransactionSchema);

export default TransactionModel;
