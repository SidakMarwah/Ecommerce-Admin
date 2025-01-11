"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { withSwal } from 'react-sweetalert2';

const Categories = ({ swal }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editedCategory, setEditedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const response = await axios.get('/api/categories');

    setCategories(response.data.reverse());
  };

  const saveCategory = async (e) => {
    e.preventDefault();
    const data = {
      name: inputValue,
      parentCategory: selectedOption,
      properties: properties.map(p => ({
        name: p.name,
        values: p.values.split(','),
      })),
    };

    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put('/api/categories', data);
      setEditedCategory(null);
    } else {
      await axios.post('/api/categories', data);
    }

    resetForm();
    fetchCategories();
  };

  const resetForm = () => {
    setInputValue('');
    setSelectedOption('');
    setProperties([]);
  };

  const editCategory = (category) => {
    setEditedCategory(category);
    setInputValue(category.name);
    setSelectedOption(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(',')
      }))
    );
  };

  const deleteCategory = (category) => {
    swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${category.name}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, Delete!',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        await axios.delete('/api/categories/' + category._id);
        fetchCategories();
      }
    });
  };

  const addProperty = () => {
    setProperties([...properties, { name: '', values: '' }]);
  };

  const handlePropertyChange = (index, field, value) => {
    const newProperties = properties.map((property, i) => {
      if (i === index) {
        return { ...property, [field]: value };
      }
      return property;
    });
    setProperties(newProperties);
  };

  const removeProperty = (index) => {
    setProperties(properties.filter((_, i) => i !== index));
  };

  return (
    <>
      <h1 className='text-4xl font-bold my-3 text-center'>Categories</h1>
      <div className="max-w-md mx-auto mt-6">
        <form onSubmit={saveCategory} className="space-y-4">
          <p className='text-2xl mb-3'>
            {editedCategory ? `Edit category "${editedCategory.name}"` : 'Create new category'}
          </p>

          <div className="md:flex md:space-x-4">
            <div className="md:flex-1">
              <label htmlFor="textInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Enter Text
              </label>
              <input
                type="text"
                id="textInput"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                required
              />
            </div>

            <div className="md:flex-1">
              <label htmlFor="selectOption" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Choose an option
              </label>
              <select
                id="selectOption"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
              >
                <option value="">No parent category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>

          <p className='text-2xl mb-3'>Properties</p>

          {properties.map((property, index) => (
            <div className="md:flex md:space-x-4 items-center mb-4" key={index}>
              <div className="md:flex-1">
                <input
                  type="text"
                  placeholder="Property Name"
                  value={property.name}
                  onChange={(e) => handlePropertyChange(index, 'name', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                />
              </div>
              <div className="md:flex-1">
                <input
                  type="text"
                  placeholder="Property Value"
                  value={property.values}
                  onChange={(e) => handlePropertyChange(index, 'values', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => removeProperty(index)}
                  className="mt-1 bg-red-600 dark:bg-red-700 text-white py-2 px-4 rounded-md hover:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addProperty}
            className="w-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500"
          >
            Add Property
          </button>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 dark:bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500"
            >
              {editedCategory ? 'Edit' : 'Save'}
            </button>
          </div>
        </form>
      </div>

      <div className="max-w-4xl mx-auto mt-10">
        <h2 className="text-2xl font-semibold mb-4">Category List</h2>
        <div className="overflow-x-auto">
          <table className="primary">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Parent Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr key={index}>
                  <td>{category.name}</td>
                  <td>{category.parent?.name || 'No parent Category'}</td>
                  <td>
                    <button
                      onClick={() => editCategory(category)}
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mr-2"
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
                    </button>
                    <button
                      onClick={() => deleteCategory(category)}
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
      </div>
    </>
  );
};

export default withSwal(({ swal }, ref) => (
  <Categories swal={swal} />
));
