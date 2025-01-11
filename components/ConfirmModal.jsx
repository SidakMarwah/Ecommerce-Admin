import axios from 'axios'
import React from 'react'

const ConfirmModal = ({ user, setIsDeleteConfirmationModalOpen, fetchAllUsersWithTheirRoles }) => {

  async function DeleteUser(event) {
    event.preventDefault();

    try {
      if (user.role === "Admin") {
        // Fetch all users to check the number of admins
        const response = await axios.get('/api/settings/roles');
        const allUsers = response.data;
        const adminCount = allUsers.filter((u) => u.role === "Admin").length;

        // If only one admin remains, prevent deletion
        if (adminCount <= 1) {
          alert("Cannot delete this user as there must be at least one admin.");
          setIsDeleteConfirmationModalOpen(false);
          return;
        }
      }

      // Proceed with deletion if the check passes
      await axios.delete(`/api/settings/roles/${user._id}`);
      setIsDeleteConfirmationModalOpen(false);
      fetchAllUsersWithTheirRoles();
    } catch (error) {
      console.log("Error deleting user:", error);
    }
  }

  return (
    <>

      <div
        title="modal"
        className="modal fixed top-0 left-0 h-full w-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50"
        onClick={() => { setIsDeleteConfirmationModalOpen(false) }}
      >
        <div
          className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md relative w-3/4 max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className='flex justify-between items-center mb-4'>
            <h3 className="text-lg font-semibold text-black dark:text-white">Confirm Delete</h3>
            <button
              type='button'
              className="text-2xl text-gray-600 dark:text-gray-300"
              onClick={() => { setIsDeleteConfirmationModalOpen(false) }}
            >
              &times;
            </button>
          </div>

          <form onSubmit={DeleteUser} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
            <p className="text-lg font-semibold text-gray-800 mb-2">Are you sure you want to delete this user?</p>

            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <p className="text-gray-700"><span className="font-semibold">Email:</span> {user.email}</p>
              <p className="text-gray-700"><span className="font-semibold">Role:</span> {user.role}</p>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md transition duration-150 ease-in-out"
            >
              Delete
            </button>
          </form>


        </div>
      </div>

    </>
  )
}

export default ConfirmModal