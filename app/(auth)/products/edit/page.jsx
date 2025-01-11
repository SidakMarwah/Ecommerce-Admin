"use client"
import Form from '@/components/Form'
import Sidebar from '@/components/Sidebar'
import axios from 'axios'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const EditProduct = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get('id');

    const [submitting, setSubmitting] = useState(false);
    const [product, setProduct] = useState({
        title: '',
        description: '',
        price: '',
        images: [],
        category: '',
        properties: {}
    });
    // console.log(product);

    useEffect(() => {
        const getProductDetails = async () => {
            const response = await axios.get(`/api/products/${productId}`)
            const data = response.data;

            setProduct({
                title: data.title,
                description: data.description,
                price: data.price,
                images: data.images,
                category: data.category,
                properties: data.properties
            })
        }
        if (productId) getProductDetails();
        // console.log(product);
    }, [productId])

    // console.log(product);


    const updateProduct = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        if (!productId) return alert('Product ID not found')
        await axios.put(`/api/products/${productId}`, product)
            // .then(response => console.log(response.data))
            .catch(error => console.error(error))
            .finally(() => {
                setSubmitting(false);
                router.push('/products');
            });
    }
    return (
        <Form
            type="Edit"
            product={product}
            setProduct={setProduct}
            submitting={submitting}
            handleSubmit={updateProduct}
        />
    )
}

export default EditProduct