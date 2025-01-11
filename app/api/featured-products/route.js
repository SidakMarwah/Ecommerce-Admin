// File: /app/api/featured-products/route.js
import Featured from "@/models/Featured";
import { connectToDB } from "@/lib/database";
import { isAdminRequest } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Check if the user is an admin
        await isAdminRequest();
    } catch (error) {
        // Return a JSON response with the error message and 403 status code
        return NextResponse.json({ error: error.message }, { status: 403 });
    }

    await connectToDB();

    try {
        const featuredProducts = await Featured.find().populate("product");
        return NextResponse.json(featuredProducts, { status: 200 });
    } catch (error) {
        console.error("Error fetching featured products:", error);
        return NextResponse.json({ message: "Failed to fetch featured products." }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        // Check if the user is an admin
        await isAdminRequest();
    } catch (error) {
        // Return a JSON response with the error message and 403 status code
        return NextResponse.json({ error: error.message }, { status: 403 });
    }

    await connectToDB();

    try {
        const { addedProducts, removedProducts } = await req.json();

        // Add new featured products
        if (addedProducts && addedProducts.length > 0) {
            const newFeatured = addedProducts.map((productId) => ({ product: productId }));
            await Featured.insertMany(newFeatured);
        }

        // Remove unfeatured products
        if (removedProducts && removedProducts.length > 0) {
            await Featured.deleteMany({ product: { $in: removedProducts } });
        }

        return NextResponse.json({ message: "Featured products updated successfully." }, { status: 200 });
    } catch (error) {
        console.error("Error updating featured products:", error);
        return NextResponse.json({ message: "Failed to update featured products." }, { status: 500 });
    }
}