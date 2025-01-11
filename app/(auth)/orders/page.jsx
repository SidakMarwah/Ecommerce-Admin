"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		try {
			const response = await axios.get("/api/orders");
			setOrders(response.data.reverse());
		} catch (error) {
			console.error("Failed to fetch orders:", error);
		}
	};

	const handleDelete = async (orderId) => {
		try {
			await axios.delete(`/api/orders?id=${orderId}`);
			fetchOrders(); // Re-fetch orders after deletion
		} catch (error) {
			console.error("Failed to delete order:", error);
		}
	};

	return (
		<>
			<h1 className="text-4xl font-bold my-3 text-center">Orders</h1>
			<div className="max-w-4xl mx-auto mt-10">
				<h2 className="text-2xl font-semibold mb-4">Orders List</h2>
				<div className="overflow-x-auto">
					<table className="primary">
						<thead>
							<tr>
								<th>Order ID</th>
								<th>Customer Name</th>
								<th>Email</th>
								<th>Order Date</th>
								<th>Status</th>
								<th>Total Amount</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{orders.map((order, index) => (
								<tr key={index}>
									<td>{order._id}</td> {/* Use MongoDB _id */}
									<td>{order.customerInfo.name}</td> {/* Customer's name */}
									<td>{order.customerInfo.email}</td> {/* Customer's email */}
									<td>
										{new Date(order.createdAt).toLocaleDateString("en-US", {
											year: "numeric",
											month: "short",
											day: "numeric",
										})}
									</td>
									<td>
										<span
											className={`px-2 py-1 rounded-md text-white ${order.paid
												? "bg-green-500"
												: "bg-yellow-500"
												}`}
										>
											{order.paid ? "Completed" : "Pending"}
										</span>
									</td>
									<td>₹{order.totalAmount.toFixed(2)}</td>
									<td>
										<button
											className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
											onClick={() => alert(`View order ${order._id}`)}
										>
											View
										</button>
										<button
											className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
											onClick={() => handleDelete(order._id)} // Call delete function
										>
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

export default Orders;
