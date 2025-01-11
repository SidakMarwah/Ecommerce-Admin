import { NextResponse } from 'next/server';
import Order from "@/models/Order";
import { connectToDB } from "@/lib/database";
import { isAdminRequest } from "../auth/[...nextauth]/route";

// GET request to fetch all orders
export async function GET() {
    try {
        // Check if the user is an admin
        await isAdminRequest();
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 403 });
    }

    try {
        // Connect to the database
        await connectToDB();

        // Fetch all orders with populated fields
        const orders = await Order.find().populate('itemsOrdered.productId');

        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}

// POST request to create a new order
export async function POST(req) {
    try {
        // Check if the user is an admin
        await isAdminRequest();
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 403 });
    }

    try {
        // Connect to the database
        await connectToDB();

        // Extract the order data from the request body
        const { customerInfo, itemsOrdered, totalAmount, paid } = await req.json();

        // Create a new order in the database
        const newOrder = new Order({
            customerInfo,
            itemsOrdered,
            totalAmount,
            paid: paid || false,
        });

        // Save the new order
        await newOrder.save();

        return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}

// PUT request to update an existing order
export async function PUT(req) {
    try {
        // Check if the user is an admin
        await isAdminRequest();
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 403 });
    }

    try {
        // Connect to the database
        await connectToDB();

        // Extract the order data from the request body
        const { _id, customerInfo, itemsOrdered, totalAmount, paid } = await req.json();

        // Find the order and update it
        const updatedOrder = await Order.findByIdAndUpdate(
            _id,
            { customerInfo, itemsOrdered, totalAmount, paid },
            { new: true }
        );

        if (!updatedOrder) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(updatedOrder);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }
}

// DELETE request to delete an order
export async function DELETE(req) {
    try {
        // Check if the user is an admin
        await isAdminRequest();
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 403 });
    }

    try {
        // Connect to the database
        await connectToDB();

        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get("id");

        // Find the order by ID and delete it
        const deletedOrder = await Order.findByIdAndDelete(orderId);

        if (!deletedOrder) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Order deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete the order" }, { status: 500 });
    }
}
