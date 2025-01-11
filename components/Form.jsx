import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ReactSortable } from 'react-sortablejs';
import { useRouter } from 'next/navigation';

const Form = ({ type, product, setProduct, submitting, handleSubmit }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [propertiesToFill, setPropertiesToFill] = useState([]);
  const [isManageUploadsModalOpen, setIsManageUploadsModalOpen] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]); // New state for images to delete

  const router = useRouter();

  // console.log(product);


  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data } = await axios.get('/api/categories');
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {

    { product.category === '' && setPropertiesToFill([]); }

    if (product.category) {

      let category = categories.find(c => c._id === product.category._id);
      // console.log(category);

      const properties = [];

      while (category) {
        properties.push(...category.properties);
        category = category.parent ? categories.find(c => c._id === category.parent._id) : null;
      }

      setPropertiesToFill(properties);
    }

  }, [product.category, categories]);

  async function uploadImages(ev) {
    setIsUploading(true);
    const files = ev.target.files;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024;

    if (files.length > 0) {
      const formData = new FormData();
      for (const file of files) {
        if (!allowedTypes.includes(file.type)) {
          alert(`File type ${file.type} is not allowed. Only JPEG, PNG, and GIF are accepted.`);
          setIsUploading(false);
          return;
        }
        if (file.size > maxSize) {
          alert(`File size exceeds the 5MB limit. Please upload a smaller file.`);
          setIsUploading(false);
          return;
        }
        formData.append('files', file);
      }

      try {
        const { data } = await axios.post('/api/products/images/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const uploadedUrls = data.url;
        setProduct(prev => ({
          ...prev,
          images: [...(prev.images || []), ...uploadedUrls]
        }));
      } catch (error) {
        console.error('Upload error:', error);
      } finally {
        setIsUploading(false);
      }
    }
  }

  function sortProductImages(images) {
    setProduct(prev => ({
      ...prev,
      images
    }));
  }

  function setProductProp(propName, value) {
    value && setProduct(prev => ({
      ...prev, properties: { ...prev.properties, [propName]: value }
    }));
    if (value === '') {
      let tempProductProperties = product.properties;
      delete tempProductProperties[propName];
      setProduct(prev => ({ ...prev, properties: tempProductProperties }));
    }

  }

  // useEffect(() => {
  //   console.log(product.properties);
  // }, [product.properties])

  useEffect(() => {
    if (product.category === '') {
      setProduct(prev => ({
        ...prev,
        category: null,
        properties: {}
      }))
    }

  }, [product.category])

  const showManageUploadsModal = () => setIsManageUploadsModalOpen(true);
  const hideManageUploadsModal = () => setIsManageUploadsModalOpen(false);

  // Function to handle closing the zoomed-in view
  const closeZoomView = () => setZoomedImage(null);

  // Handler for selecting/unselecting images to delete
  const toggleSelectedImages = (imageUrl) => {
    setSelectedImages(prev =>
      prev.includes(imageUrl)
        ? prev.filter(img => img !== imageUrl)
        : [...prev, imageUrl]
    );
  };

  // useEffect(() => {
  //   console.log(selectedImages);

  // }, [selectedImages])

  function extractFileNamesFromUrls(urls) {
    return urls.map((url) => {
      // Use URL API to extract the pathname
      const pathSegments = new URL(url).pathname.split('/');
      // Return the last segment as the file name
      return pathSegments[pathSegments.length - 1];
    });
  }


  // Delete selected images
  async function deleteSelectedImages() {
    console.log("1");

    setIsDeleting(true);

    if (selectedImages.length === 0) {
      console.log("2");

      setIsDeleting(false)
      alert('No images selected for deletion.');
      return;
    }

    // Extract file names from selected URLs
    const fileNames = extractFileNamesFromUrls(selectedImages);

    try {
      const { data } = await axios.delete('/api/products/images/delete', {
        data: { fileNames }
      });

      // Update the product's images array without the deleted images
      setProduct(prev => ({
        ...prev,
        images: prev.images.filter(img => !selectedImages.includes(img))
      }));
      setSelectedImages([]);
      alert(data.message);
    } catch (error) {
      console.error('Failed to delete images:', error);
      alert('Failed to delete images.');
    } finally {
      setIsDeleting(false)
    }
  }



  return (
    <>
      <h2 className='text-3xl text-black dark:text-white text-center mt-3 mb-6 font-bold'>{type} Product</h2>
      <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product title</label>
          <input
            type="text"
            id="title"
            name="title"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
            required
            value={product.title}
            onChange={(e) => setProduct({ ...product, title: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <select
            id="category"
            name="category"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
            value={product?.category?._id || ""}
            onChange={(e) => {
              const selectedCategory = categories.find(c => c._id === e.target.value);
              setProduct(prev => ({
                ...prev,
                category: selectedCategory || "",
                // properties: e.target.value !== '' ? prev.properties : {}
              }));
            }}
          >
            <option value="">Uncategorized</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

        </div>

        {propertiesToFill.length > 0 && propertiesToFill.map(p => (
          <div key={p.name} className="mb-4">
            <label htmlFor={p.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {p.name[0].toUpperCase() + p.name.substring(1)}
            </label>
            <select
              id={p.name}
              name={p.name}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
              value={product.properties?.[p.name] || ''}
              onChange={(e) => setProductProp(p.name, e.target.value)}
            >
              <option value="">Select {p.name}</option>
              {p.values.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        ))}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Photos</label>
          <div className="flex flex-wrap gap-1">
            <ReactSortable
              className="flex flex-wrap gap-1"
              list={product.images}
              setList={sortProductImages}
            >
              {product.images.map((imageUrl, index) => (
                <div key={index} className="h-24 mb-2 relative">
                  <img
                    src={imageUrl}
                    alt={`Product Image ${index + 1}`}
                    className="h-full object-cover rounded-md border border-gray-300 dark:border-gray-600"
                  />
                </div>
              ))}
            </ReactSortable>
            {isUploading && (
              <div className="h-24 flex items-center">
                {/* Add your spinner component here */}
              </div>
            )}
            <label htmlFor="file" className={`w-24 h-24 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 cursor-pointer flex justify-center items-center gap-1 ${isUploading ? "disabled cursor-not-allowed" : ""}`}>
              {isUploading ? (
                // Add your upload spinner here
                <div>Loading...</div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  Upload
                </>
              )}
              <input
                type="file"
                name="files"
                id="file"
                onChange={uploadImages}
                className='hidden'
                multiple
              />
            </label>
            {product.images.length !== 0 && !isUploading && (
              <button
                type="button"
                className='w-24 h-24 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 cursor-pointer'
                onClick={showManageUploadsModal}
              >
                Manage uploads
              </button>
            )}
            {isManageUploadsModalOpen && (
              <div
                title="manage uploads modal"
                className="fixed top-0 left-0 h-full w-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50"
                onClick={hideManageUploadsModal}
              >
                <div
                  className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md relative w-3/4 max-w-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className='flex justify-between items-center mb-4'>
                    <h3 className="text-lg font-semibold text-black dark:text-white">Manage Uploads</h3>
                    <button
                      type='button'
                      className="text-2xl text-gray-600 dark:text-gray-300"
                      onClick={hideManageUploadsModal}
                    >
                      &times;
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {product.images.map((imageUrl, index) => (
                      <div key={index} className='text-center'>
                        <div className="relative rounded-md overflow-hidden group">
                          <img
                            src={imageUrl}
                            alt={`Product Image ${index + 1}`}
                            className="w-full h-24 object-cover cursor-pointer border border-gray-300 dark:border-gray-600"
                          />

                          {/* Overlay container for zoom and checkbox */}
                          <div className="absolute inset-0 flex items-center justify-around p-1 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Zoom button: visible only on hover */}
                            <button
                              type="button"
                              onClick={() => setZoomedImage(imageUrl)}
                              className="text-white opacity-0 group-hover:opacity-100 transition-opacity hover:text-blue-300"
                            >
                              Zoom
                            </button>
                          </div>
                        </div>
                        {/* Checkbox: visible on hover or if selected */}
                        < input
                          type="checkbox"
                          className={`mr-2`}
                          checked={selectedImages.includes(imageUrl)}
                          onChange={() => toggleSelectedImages(imageUrl)}
                        />
                      </div>

                    ))}
                  </div>
                  {/* Bulk action and delete button */}
                  <div className="mt-4 p-3 border-t border-gray-300 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Bulk actions:</p>
                    <button
                      type="button"
                      className={`bg-red-600 text-white py-1 px-3 rounded-md shadow hover:bg-red-700 transition-colors ${isDeleting || selectedImages.length === 0 ? "disabled cursor-not-allowed" : "cursor-pointer"}`}
                      onClick={deleteSelectedImages}
                      disabled={selectedImages.length === 0}
                    >
                      {isDeleting ? "Deleting..." : " Delete Selected"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Zoomed-in view modal */}
            {zoomedImage && (
              <div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
                onClick={closeZoomView}
              >
                <div className="relative max-w-3xl w-full p-4">
                  <button
                    className="absolute -top-8 right-8 text-white text-3xl font-bold"
                    onClick={closeZoomView}
                  >
                    &times;
                  </button>
                  <img
                    src={zoomedImage}
                    alt="Zoomed In"
                    className="w-full h-auto object-contain rounded-md shadow-lg"
                  />
                </div>
              </div>
            )}

          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            id="description"
            name="description"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price (in INR)</label>
          <input
            type="number"
            id="price"
            name="price"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 numberinputwithoutarrows"
            required
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`bg-blue-600 dark:bg-blue-500 text-white font-bold py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${submitting ? 'cursor-not-allowed opacity-50' : ''
            }`}
        >
          {submitting ? 'Submitting...' : 'Save'}
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={() => !submitting && router.push('/products')}
          className={`ml-2 bg-red-600 dark:bg-red-500 text-white font-bold py-2 px-4 rounded-md shadow-sm hover:bg-red-700 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 ${submitting ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          Cancel
        </button>
      </form>
    </>
  );
};

export default Form;
