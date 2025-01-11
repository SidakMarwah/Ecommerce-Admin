"use client"
import Sidebar from '@/components/Sidebar';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const DeleteProduct = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get('id');
    const [deleting, setDeleting] = useState(false);
    const [product, setProduct] = useState({
        title: '',
        description: '',
        price: ''
    });

    useEffect(() => {
        const getProductDetails = async () => {
            try {
                const response = await axios.get(`/api/products/${productId}`);
                const data = response.data;

                // console.log(data);

                setProduct({
                    title: data.title,
                    description: data.description,
                    price: data.price
                });

                // setProduct(data);
                // console.log(product);

            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };

        if (productId) getProductDetails();
    }, [productId]);

    const deleteProduct = async (e) => {
        e.preventDefault();
        setDeleting(true);

        if (!productId) {
            alert('Product ID not found');
            setDeleting(false);
            return;
        }

        try {
            const response = await axios.delete(`/api/products/${productId}`);
            // console.log("Delete response:", response.data);
            router.push('/products');
        } catch (error) {
            console.error("Error deleting product:", error);
        } finally {
            setDeleting(false);
        }
    }

    return (
        <>
            <h2 className="text-2xl font-semibold mb-4 text-center">Are you sure you want to delete this product?</h2>
            <div className="space-y-4 flex flex-col justify-center items-center">
                <div>
                    <h2 className="text-center text-xl font-semibold">Product title:</h2>
                    <p className="text-center text-lg">{product.title}</p>
                </div>
                <div>
                    <h2 className="text-center text-xl font-semibold">Product description:</h2>
                    <p className="text-center text-lg">{product.description}</p>
                </div>
                <div>
                    <h2 className="text-center text-xl font-semibold">Product price:</h2>
                    <p className="text-center text-lg">{product.price}</p>
                </div>
            </div>
            <div className="flex justify-center items-center w-full mt-4 gap-2 " aria-disabled={deleting}>
                <button
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    onClick={deleteProduct}
                    disabled={deleting}
                >
                    {deleting ? "Deleting..." : "Yes, delete"}
                </button>
                <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    onClick={() => router.push('/products')}
                >
                    No, go back
                </button>
            </div>
        </>
    );
}

export default DeleteProduct;
