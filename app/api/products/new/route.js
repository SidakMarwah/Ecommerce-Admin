import { connectToDB } from "@/lib/database";
import Product from "@/models/Product";
import { isAdminRequest } from "../../auth/[...nextauth]/route";

export const POST = async (req) => {

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

    const { title, description, price, images, category, properties } = await req.json();

    // if (category === '') {
    //     category = null;
    // }

    // console.log(properties);


    try {
        await connectToDB();
        const newProduct = new Product({
            title,
            description,
            price,
            images,
            category,
            properties
        });

        await newProduct.save();

        return new Response(JSON.stringify(newProduct), { status: 201 });
    } catch (error) {
        // console.log(error);

        return new Response('Failed to create a new product', { status: 500 });
    }
};
