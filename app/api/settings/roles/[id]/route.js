import { isAdminRequest } from "@/app/api/auth/[...nextauth]/route";
import { connectToDB } from "@/lib/database";
import Roles from "@/models/Roles";
import { NextResponse } from "next/server";

//DELETE (delete)
export const DELETE = async (request, { params }) => {

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

    try {
        await connectToDB();

        // Find the prompt by ID and remove it
        await Roles.findByIdAndDelete(params.id);

        return new Response("User deleted successfully.", { status: 200 })
    } catch (error) {
        return new Response("Failed to delete the User.", { status: 500 })
    }
}