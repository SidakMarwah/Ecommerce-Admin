"use client"
import Modal from '@/components/Modal'
import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Products = () => {
  const [searchText, setSearchText] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [isFeaturedModalOpen, setIsFeaturedModalOpen] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [editedFeaturedProducts, setEditedFeaturedProducts] = useState([]);

  const getProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      const data = response.data;
      // console.log(data);

      setAllProducts(data);
    } catch (error) {
      console.log(error);

    }
  };

  const getFeaturedProducts = async () => {
    try {
      // Fetch featured products
      const response = await axios.get("/api/featured-products");
      // console.log(response.data);
      setFeaturedProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
    getFeaturedProducts();
  }, [])

  useEffect(() => {
    // When modal opens, copy featured products to editedFeaturedProducts
    if (isFeaturedModalOpen) {
      const editedArray = featuredProducts.map((p) => p.product._id);
      // console.log(editedArray)
      setEditedFeaturedProducts([...editedArray]);
    }
  }, [isFeaturedModalOpen, featuredProducts]);

  // useEffect(() => {
  //   console.log(editedFeaturedProducts);
  // }, [editedFeaturedProducts])


  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleCheckboxChange = (productId) => {
    setEditedFeaturedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const saveFeaturedProducts = async () => {
    const addedProducts = editedFeaturedProducts.filter(
      (id) => !featuredProducts.some((product) => product.product._id === id)
    );

    const removedProducts = featuredProducts
      .map((product) => product.product._id)
      .filter((id) => !editedFeaturedProducts.includes(id));

    // Only proceed if there are changes to be made
    if (addedProducts.length > 0 || removedProducts.length > 0) {
      try {
        await axios.post("/api/featured-products", {
          addedProducts,
          removedProducts,
        });

        getFeaturedProducts();

        setIsFeaturedModalOpen(false); // Close the modal after save
      } catch (error) {
        console.error("Error updating featured products:", error);
      }
    } else {
      console.log("No changes to save.");
      setIsFeaturedModalOpen(false); // Close modal even if no changes
    }
  };

  // Filter products directly in the render method
  const filteredProducts = allProducts.filter((product) => {
    const regex = new RegExp(searchText, "i");

    // Check if the title matches
    const titleMatches = regex.test(product?.title);

    // Check if the category matches
    const categoryMatches = product?.category && regex.test(product?.category?.name);

    // Check if any property values match
    const propertiesMatch = Object.values(product?.properties || {}).some((value) =>
      regex.test(value)
    );

    // Return true if any of the matches are true
    return titleMatches || categoryMatches || propertiesMatch;
  });

  return (
    <>
      <div className="m-3 mb-1 flex justify-between items-start flex-col md:flex-row gap-2">
        <h1 className='text-4xl font-bold'>Products</h1>
        <Link href={'/products/new'} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 h-fit'>Add new product →</Link>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-3">
        <div className="pb-4">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              id="table-search"
              className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-full md:w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for products"
              value={searchText}
              onChange={handleSearchChange}

            />
          </div>
        </div>
        <table className="secondary">
          <thead>
            <tr>
              <th scope="col">Product name</th>
              <th scope="col">Category</th>
              <th scope="col">Price</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={index}>
                <th scope="row">
                  <Link className="hover:underline" href="https://www.google.com/" target="_blank">
                    {product?.title.length > 25 ? product?.title.slice(0, 25) + '...' : product?.title}
                  </Link>
                </th>
                <td>{product?.category?.name ?? 'Uncategorized'}</td>
                <td>{product?.price}</td>
                <td>
                  <Link
                    href={`/products/edit?id=${product?._id}`}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mr-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6 inline-block mb-1 mr-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931ZM16.862 4.487L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                    Edit
                  </Link>
                  <Link
                    href={`/products/delete?id=${product?._id}`}
                    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 text-nowrap"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6 inline-block mb-1 mr-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9L14.394 18M9.606 18L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                    Delete
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>


      <div className='m-3'>
        <div className='flex items-center flex-wrap gap-4'>
          <h2 className='text-2xl text-nowrap'>Featured Products</h2>
          <button
            type='button'
            className='px-3 py-1 bg-blue-700 rounded-md text-nowrap text-white'
            onClick={() => setIsFeaturedModalOpen(true)}
          >
            Edit featured</button>
        </div>
      </div>

      {isFeaturedModalOpen && (
        <Modal setIsModalOpen={setIsFeaturedModalOpen} title='Edit Featured Products'>

          <table className="secondary">
            <thead>
              <tr>
                <th scope="col">Product name</th>
                <th>Added</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={index}>
                  <th scope="row">
                    <Link
                      className="hover:underline"
                      href={`/products/view?id=${product?._id}`}
                    >
                      {product?.title.length > 25
                        ? product?.title.slice(0, 25) + "..."
                        : product?.title}
                    </Link>
                  </th>
                  <td>
                    <input
                      type="checkbox"
                      name="featuredProducts"
                      id={product._id}
                      checked={editedFeaturedProducts.includes(product._id)} // Use editedFeaturedProducts here
                      onChange={() => handleCheckboxChange(product?._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={saveFeaturedProducts}
            className="mt-4 px-4 py-2 bg-blue-700 text-white rounded"
          >
            Save Changes
          </button>
        </Modal>
      )}

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-3 max-w-md">
        <table className="secondary">
          <thead>
            <tr>
              <th scope="col">Product name</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {featuredProducts.map((fp, index) => (
              <tr key={index}>
                <th scope="row">
                  <Link className="hover:underline" href="https://www.google.com/" target="_blank">
                    {fp?.product?.title.length > 25 ? fp?.product?.title.slice(0, 25) + '...' : fp?.product?.title}
                  </Link>
                </th>
                <td>
                  <button
                    onClick={async () => {
                      try {
                        await axios.post("/api/featured-products", {
                          addedProducts: [],
                          removedProducts: [fp?.product?._id], // Pass the product ID to remove
                        });
                        getFeaturedProducts(); // Refresh featured products list
                      } catch (error) {
                        console.error("Error removing featured product:", error);
                      }
                    }}
                    className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1 me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 text-nowrap"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6 inline-block mb-1 mr-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9L14.394 18M9.606 18L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </>
  )
}

export default Products