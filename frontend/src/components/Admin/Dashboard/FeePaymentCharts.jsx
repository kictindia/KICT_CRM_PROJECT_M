import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import dayjs from "dayjs";

const TransactionsContainer = styled.div`
  max-width: 550px;
  max-height: 390px;
  background-color: #f9fbfd;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  font-family: "Arial", sans-serif;
  margin: 1rem auto;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

const TransactionCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
`;

const IconContainer = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${(props) => props.bgColor || "#e0f7fa"};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TransactionDetails = styled.div`
  flex: 1;
  margin-left: 12px;
`;

const TransactionTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #333;
`;

const TransactionDate = styled.div`
  font-size: 12px;
  color: #aaa;
  margin-top: 4px;
`;

const TransactionAmount = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: ${(props) => (props.isPositive ? "#34c759" : "#fc3d39")};
`;


const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("https://franchiseapi.kictindia.com/fee/all");
      processTransactions(response.data);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const processTransactions = (data) => {
    const processed = [];
    console.log("st data", data);
    data.forEach((student) => {
      student.Installment.forEach((payment) => {
        var temp = payment.Date.split("/");
        temp = `${temp[1]}/${temp[0]}/${temp[2]}`;
        processed.push({
          id: payment.id,
          title: `Payment by ${student.StudentName}`,
          date: dayjs(temp).format("DD MMMM YYYY"),
          amount: payment.Amount,
          isPositive: payment.Amount > 0,
          method: payment.method || "Cash",
        });
      });
    });

    // Sort transactions by date in descending order
    const sortedTransactions = processed.sort(
      (a, b) => dayjs(b.date) - dayjs(a.date)
    );

    // Only keep the 5 most recent transactions
    const recentTransactions = sortedTransactions.slice(0, 5);

    setTransactions(recentTransactions.reverse()); // Reverse to have recent ones on top
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <TransactionsContainer>
      <Title>Recent Transactions</Title>
      {transactions.map((transaction) => (
        <TransactionCard key={transaction.id}>
          <IconContainer
            bgColor={transaction.isPositive ? "#e7f9ed" : "#fde7e7"}
          >
            {transaction.method === "Card" && "💳"}
            {transaction.method === "Paypal" && "💲"}
            {transaction.method === "Cash" && "💵"}
          </IconContainer>
          <TransactionDetails>
            <TransactionTitle>{transaction.title}</TransactionTitle>
            <TransactionDate>{transaction.date}</TransactionDate>
          </TransactionDetails>
          <TransactionAmount isPositive={transaction.isPositive}>
            {transaction.isPositive ? "" : ""} ₹ {Math.abs(transaction.amount)}
          </TransactionAmount>
        </TransactionCard>
      ))}
    </TransactionsContainer>
  );
};

export default RecentTransactions;
