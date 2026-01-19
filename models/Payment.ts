import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
    {
        transactionId: {
            type: String,
            required: true,
            unique: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false, // Can be optional if guest checkout is allowed
        },
        amount: {
            type: Number,
            required: true,
        },
        productInfo: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "success", "failed"],
            default: "pending",
        },
        paymentGateway: {
            type: String,
            default: "payu",
        },
        mode: {
            type: String,
        },
        gatewayResponse: {
            type: Object,
        },
        metadata: {
            type: Object, // Store grade, board, subjects, etc.
        },
    },
    { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
