import { connectToDB } from "@/lib/database";
import Product from "@/models/Product";
import { isAdminRequest } from "../../auth/[...nextauth]/route";

// GET (read)
export const GET = async (request, { params }) => {

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

        const product = await Product.findById(params.id).populate('category');
        if (!product) return new Response("Product not found.", { status: 404 })

        return new Response(JSON.stringify(product), { status: 200 });
    } catch (error) {
        return new Response('Failed to fetch the product.', { status: 500 });
    }
}

//PUT (update), we can also use PATCH for update
export const PUT = async (request, { params }) => {

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

    const { title, description, price, images, category, properties } = await request.json();

    try {
        await connectToDB();

        const existingProduct = await Product.updateOne({ _id: params.id }, {
            title,
            description,
            price,
            images,
            category,
            properties

        });

        if (!existingProduct) return new Response("Product not found.", { status: 404 })

        // Product.findOne is also one option if we save the product after fetching and updating in code logic

        //one more way is given below using Product.findById

        // const existingProduct = await Product.findById(params.id);

        // if (!existingProduct) return new Response("Product not found.", { status: 404 })

        // existingProduct.title = title;
        // existingProduct.description = description;
        // existingProduct.price = price;

        // await existingProduct.save();

        //for more ways go check mongoose js documentation  (❁´◡`❁)  >>>----------->

        return new Response(JSON.stringify(existingProduct), { status: 200 })
    } catch (error) {
        // console.log(error);

        return new Response("Failed to update the product.", { status: 500 })
    }
}

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
        await Product.findByIdAndDelete(params.id);

        return new Response("Product deleted successfully.", { status: 200 })
    } catch (error) {
        return new Response("Failed to delete the product.", { status: 500 })
    }
}