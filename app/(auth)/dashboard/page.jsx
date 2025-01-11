"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
	const [orders, setOrders] = useState([]);
	const [totalRevenue, setTotalRevenue] = useState(0);
	const [totalOrders, setTotalOrders] = useState(0);
	const [uniqueCustomers, setUniqueCustomers] = useState(0);

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		try {
			const response = await axios.get("/api/orders");
			const fetchedOrders = response.data;
			setOrders(fetchedOrders);

			// Calculate total revenue
			const revenue = fetchedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
			setTotalRevenue(revenue);

			// Calculate total orders
			setTotalOrders(fetchedOrders.length);

			// Calculate unique customers
			const uniqueCustomerSet = new Set(fetchedOrders.map((order) => order.customerInfo.email));
			setUniqueCustomers(uniqueCustomerSet.size);
		} catch (error) {
			console.error("Failed to fetch orders:", error);
		}
	};

	return (
		<div className="mx-auto px-4">
			<h1 className="text-4xl font-bold text-center my-8">Admin Dashboard</h1>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{/* Total Revenue */}
				<div className="border-4 border-gray-400 shadow rounded-lg p-6">
					<h2 className="text-2xl font-semibold">Total Revenue</h2>
					<p className="text-4xl font-bold mt-4">₹{totalRevenue.toFixed(2)}</p>
				</div>

				{/* Total Orders */}
				<div className="border-4 border-gray-400 shadow rounded-lg p-6">
					<h2 className="text-2xl font-semibold">Total Orders</h2>
					<p className="text-4xl font-bold mt-4">{totalOrders}</p>
				</div>

				{/* Unique Customers */}
				<div className="border-4 border-gray-400 shadow rounded-lg p-6">
					<h2 className="text-2xl font-semibold">Unique Customers</h2>
					<p className="text-4xl font-bold mt-4">{uniqueCustomers}</p>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
