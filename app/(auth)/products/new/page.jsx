"use client"
import Form from '@/components/Form';
import Sidebar from '@/components/Sidebar';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const AddNewProduct = () => {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        images: [],
        category: '',
        properties: {}
    });
    // const handleChange = (event) => {
    //     const { name, value } = event.target;

    //     setFormData({
    //         ...formData,
    //         [name]: value
    //     });

    // };
    async function handleAddProduct(event) {
        event.preventDefault();

        const response = await axios.post('/api/products/new', formData);
        if (response.status === 201) router.push('/products');


    }
    return (
        <>

            <Form
                type="Add"
                product={formData}
                setProduct={setFormData}
                submitting={submitting}
                handleSubmit={handleAddProduct}
            />
        </>
    )
}

export default AddNewProduct