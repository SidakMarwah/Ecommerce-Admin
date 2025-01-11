import { connectToDB } from "@/lib/database";
import Product from "@/models/Product";
import { isAdminRequest } from "../auth/[...nextauth]/route";
import Category from "@/models/Category";

export const GET = async (request) => {

    try {
        // Check if the user is an admin
        await isAdminRequest();
    } catch (error) {
        console.log(error.message);

        // Return a JSON response with the error message and appropriate status code
        return NextResponse.json(
            { error: error.message },
            { status: 403 } // Forbidden or adjust the status as necessary
        )
    }

    // If admin check passes, proceed to fetch categories

    try {
        await connectToDB();

        const Products = await Product.find({}, null, { sort: { "updatedAt": -1 } }).populate('category');

        return new Response(JSON.stringify(Products), { status: 200 });
    } catch (error) {
        console.log(error.message);
        return new Response(error.message, { status: 500 });
    }
}