import React from 'react'

const Modal = ({ children, setIsModalOpen, title }) => {
    return (
        <>
            <div
                title="modal"
                className="modal fixed top-0 left-0 h-full w-full flex items-center justify-center bg-black bg-opacity-50 backdrop-blur z-50"
                onClick={() => { setIsModalOpen(false) }}
            >
                <div
                    className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md relative w-3/4 max-w-lg"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className='flex justify-between items-center mb-4'>
                        <h3 className="text-lg font-semibold text-black dark:text-white">{title}</h3>
                        <button
                            type='button'
                            className="text-2xl text-gray-600 dark:text-gray-300"
                            onClick={() => { setIsModalOpen(false) }}
                        >
                            &times;
                        </button>
                    </div>
                    {children}

                </div>
            </div>
        </>
    )
}

export default Modal