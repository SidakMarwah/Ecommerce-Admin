import { NextResponse } from "next/server";
import { isAdminRequest } from "../../auth/[...nextauth]/route";
import { connectToDB } from "@/lib/database";
import Roles from "@/models/Roles";

// GET request to fetch all roles
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
    const roles = await Roles.find();
    return NextResponse.json(roles);
}

// POST request to create a new roles
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

    // If admin check passes, proceed to fetch roles
    await connectToDB();
    const { email, role } = await req.json();
    const roleDoc = await Roles.create({
        email,
        role
    });
    return NextResponse.json(roleDoc);
}

// PUT request to update a Role
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
    const { email, role, _id } = await req.json();
    const roleDoc = await Roles.updateOne({ _id }, {
        email,
        role
    });
    return NextResponse.json(roleDoc);
}