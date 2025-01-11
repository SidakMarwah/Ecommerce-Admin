import mongoose, { Schema, model, models } from "mongoose";

// Define the schema for the items ordered
const ItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    subTotal: { type: Number, required: true },
});

// Define the schema for the customer information
const CustomerInfoSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
});

// Define the main Order schema
const OrderSchema = new Schema(
    {
        customerInfo: { type: CustomerInfoSchema, required: true },
        itemsOrdered: { type: [ItemSchema], required: true },
        totalAmount: { type: Number, required: true },
        paid: { type: Boolean, default: false },
    },
    { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Create and export the Order model
const Order = models.Order || model("Order", OrderSchema);

export default Order;
