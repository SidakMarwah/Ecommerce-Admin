import Category from "@/models/Category";
import { connectToDB } from "@/lib/database";
import { isAdminRequest } from "../../auth/[...nextauth]/route";

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
        await Category.findByIdAndDelete(params.id);

        return new Response("Category deleted successfully.", { status: 200 })
    } catch (error) {
        return new Response("Failed to delete the Category.", { status: 500 })
    }
}