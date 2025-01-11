import Category from "@/models/Category";
import { NextResponse } from 'next/server';
import { connectToDB } from "@/lib/database";
import { isAdminRequest } from "../auth/[...nextauth]/route";

// GET request to fetch all categories
export async function GET() {
    try {
        // Check if the user is an admin
        await isAdminRequest();
    } catch (error) {
        // Return a JSON response with the error message and appropriate status code
        return NextResponse.json(
            { error: error.message },
            { status: 403 } // Forbidden or adjust the status as necessary
        )
    }

    // If admin check passes, proceed to fetch categories
    await connectToDB();
    const categories = await Category.find().populate('parent');
    return NextResponse.json(categories);
}

// POST request to create a new category
export async function POST(req) {
    try {
        // Check if the user is an admin
        await isAdminRequest();
    } catch (error) {
        // Return a JSON response with the error message and appropriate status code
        return NextResponse.json(
            { error: error.message },
            { status: 403 } // Forbidden or adjust the status as necessary
        )
    }

    // If admin check passes, proceed to fetch categories
    await connectToDB();
    const { name, parentCategory, properties } = await req.json();
    const categoryDoc = await Category.create({
        name,
        parent: parentCategory || undefined,
        properties,
    });
    return NextResponse.json(categoryDoc);
}

// PUT request to update a category
export async function PUT(req) {
    try {
        // Check if the user is an admin
        await isAdminRequest();
    } catch (error) {
        // Return a JSON response with the error message and appropriate status code
        return NextResponse.json(
            { error: error.message },
            { status: 403 } // Forbidden or adjust the status as necessary
        )
    }

    // If admin check passes, proceed to fetch categories
    await connectToDB();
    const { name, parentCategory, properties, _id } = await req.json();
    const categoryDoc = await Category.updateOne({ _id }, {
        name,
        parent: parentCategory || undefined,
        properties,
    });
    return NextResponse.json(categoryDoc);
}