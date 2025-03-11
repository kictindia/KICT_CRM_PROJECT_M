import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

const FeePayment = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the backend API
  const fetchData = async () => {
    try {
      const response = await axios.get("https://franchiseapi.kictindia.com/fee/all");
      processPaymentData(response.data);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to process payment data
  const processPaymentData = (data) => {
    // Retrieve the FranchiseId from localStorage
    const franchiseId = localStorage.getItem("Id");
    if (!franchiseId) {
      setError("FranchiseId not found in localStorage");
      return;
    }

    const today = dayjs();
    const last7Days = [];

    // Filter data based on the FranchiseId from localStorage
    const filteredData = data.filter(
      (student) => student.FranchiseId === franchiseId
    );

    // Loop through filtered payments and filter out those from the last 7 days
    filteredData.forEach((student) => {
      student.Installment.forEach((payment) => {
        const paymentDate = dayjs(payment.Date, "DD/MM/YYYY"); // Use DD/MM/YYYY format
        if (paymentDate.isAfter(today.subtract(7, "days"))) {
          const dateStr = paymentDate.format("DD/MM/YYYY"); // Format as DD/MM/YYYY
          last7Days.push({ date: dateStr, paidAmount: payment.Amount });
        }
      });
    });

    // Sum the PaidAmount for each date in the last 7 days
    const paymentAmounts = {};
    last7Days.forEach((payment) => {
      const { date, paidAmount } = payment;
      paymentAmounts[date] = (paymentAmounts[date] || 0) + paidAmount;
    });

    // Prepare data for the bar chart
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const day = today.subtract(i, "days").format("DD/MM/YYYY"); // Format as DD/MM/YYYY
      chartData.push({
        date: day,
        "Total Amount": paymentAmounts[day] || 0,
      });
    }

    setPaymentData(chartData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Loading or error state
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Fee Payments in the Last 7 Days (Total Amount)</h2>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={paymentData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => dayjs(date, "DD/MM/YYYY").format("DD/MM/YYYY")} // Format as DD/MM/YYYY
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Total Amount" fill="#fc858f9a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeePayment;
