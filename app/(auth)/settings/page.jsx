"use client"

import ConfirmModal from '@/components/ConfirmModal';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Settings = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({ email: "", role: "" });
  const [allUsersWithTheirRoles, setAllUsersWithTheirRoles] = useState([]);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false);
  const [userToBeDeleted, setUserToBeDeleted] = useState(null);
  const [userToBeEdited, setUserToBeEdited] = useState(null);

  async function fetchAllUsersWithTheirRoles() {
    const response = await axios.get('/api/settings/roles');
    const data = response.data;
    // console.log(data);
    setAllUsersWithTheirRoles(data);
  }

  useEffect(() => {
    fetchAllUsersWithTheirRoles();
  }, [])


  const handleRoleFormSubmission = async (e) => {
    e.preventDefault();
    try {
      if (userToBeEdited) {
        // setUserToBeEdited({ ...userToBeEdited, email: formData.email, role: formData.role });
        // console.log(userToBeEdited);
        await axios.put('/api/settings/roles', userToBeEdited);
      } else {
        await axios.post('/api/settings/roles', formData);
      }
    } catch (error) {
      console.log(error);
    }
    setFormData({ email: "", role: "" });
    setIsFormVisible(false);
    fetchAllUsersWithTheirRoles();
  };

  const cancelFormSubmission = () => {
    setFormData({ email: '', role: '' });
    setIsFormVisible(false);
    setUserToBeEdited(null);
  }

  const showDeleteConfimationModal = (user) => {
    setIsDeleteConfirmationModalOpen(true);
    // console.log(user);
    setUserToBeDeleted(user);
  }

  const changeFormDataToEditUser = (user) => {
    // console.log(user);
    setUserToBeEdited(user);
    setIsFormVisible(true);
    setFormData({ email: user.email, role: user.role });
  }

  useEffect(() => {
    // console.log("Form Data: ", formData);
    if (userToBeEdited !== null) setUserToBeEdited({ ...userToBeEdited, email: formData.email, role: formData.role })

    if (formData.email || formData.role) {
      // Scroll to the top whenever formData changes (i.e., when add/edit form is shown)
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [formData])

  // useEffect(() => {
  //   console.log("User to be edited:", userToBeEdited);

  // }, [userToBeEdited])


  return (
    <>
      <div className='mx-3'>


        <h1 className='text-4xl font-bold mt-3 mb-4'>Settings</h1>
        <hr />
        {isFormVisible && (
          <>
            <h2 className='text-xl my-3' >{userToBeEdited === null ? 'Add User' : 'Edit User'}</h2>
            <form className='flex flex-col' onSubmit={handleRoleFormSubmission}>

              <label htmlFor="email">Email</label>
              <input className='rounded-md py-1 px-2 bg-inherit border-gray-600 border-2 my-2' value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="email" name="email" id="email" placeholder='Enter email' />


              <label htmlFor="role" className="block font-semibold mb-1">Role</label>
              <div className="flex items-center space-x-6 my-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value="Admin"
                    required
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    checked={formData.role === 'Admin'}
                    className="form-radio text-blue-600 border-gray-400 focus:ring-0 focus:border-blue-500"
                  />
                  <span>Admin</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value="Read-Only"
                    required
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    checked={formData.role === 'Read-Only'}
                    className="form-radio text-blue-600 border-gray-400 focus:ring-0 focus:border-blue-500"
                  />
                  <span>Read-Only</span>
                </label>
              </div>
              <p className="text-gray-500 text-sm">Please select a role.</p>



              <div className='flex gap-2'>
                <button type="submit" className='w-full sm:w-fit bg-blue-700 py-1 px-8 my-2 rounded-md'>{userToBeEdited === null ? 'Add' : 'Edit'}</button>
                <button type="button" className='w-full sm:w-fit bg-red-700 py-1 px-8 my-2 rounded-md' onClick={() => cancelFormSubmission()}>Cancel</button>
              </div>
            </form>
          </>
        )}

        <div className='flex justify-between my-3 flex-wrap max-w-4xl mx-auto'>
          <h2 className='text-xl text-nowrap' >Users with access</h2>
          <button type="button" className={`w-fit bg-blue-700 py-1 px-8 rounded-md text-nowrap ${isFormVisible ? "disabled cursor-not-allowed" : "cursor-pointer"}`} onClick={() => { setIsFormVisible(true) }}>Add More</button>
        </div>

        <div className='overflow-auto max-w-4xl mx-auto'>
          <table className='basic'>
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allUsersWithTheirRoles.length !== 0 && allUsersWithTheirRoles.map((user, index) =>
              (
                <tr key={index + 1}>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      type='button'
                      onClick={() => changeFormDataToEditUser(user)}
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mr-2"
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
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>


                      Edit
                    </button>
                    <button
                      type='button'
                      className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1 me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 text-nowrap"
                      onClick={() => showDeleteConfimationModal(user)}
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
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              )
              )}
            </tbody>
          </table>
        </div>

        {isDeleteConfirmationModalOpen && (
          <ConfirmModal
            user={userToBeDeleted}
            setIsDeleteConfirmationModalOpen={setIsDeleteConfirmationModalOpen}
            fetchAllUsersWithTheirRoles={fetchAllUsersWithTheirRoles}
          />
        )}



      </div>
    </>
  )
}

export default Settings