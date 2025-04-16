import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Select1 } from '../Styles/GlobalStyles';

// Styled-components for the payment page
const PaymentContainer = styled.div`
  width: 50%;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fafafa;

  @media (max-width: 1024px) {
    width: 70%;
    padding: 15px;
  }

  @media (max-width: 768px) {
    width: 80%;
  }

  @media (max-width: 480px) {
    width: 80%;
    padding: 10px;
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #3330e4;
  margin-bottom: 20px;
  font-size: 24px;

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
  color: #555;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const Value = styled.span`
  font-size: 16px;
  font-weight: normal;
  color: #333;
  display: block;
  margin: 5px 0;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 10px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 8px;
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #3330e4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  width: 100%;
  font-size: 18px;

  &:hover {
    background-color: #3330e4;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const InstallmentContainer = styled.div`
  margin-top: 30px;

  @media (max-width: 480px) {
    margin-top: 20px;
  }
`;
const MainDashboard = styled.div`
  flex: 1;
  box-sizing: border-box;
  padding: 20px;
  width:  -webkit-fill-available;
  background-color: #f9f9f9;
  height: calc(100vh - 60px);
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 8px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #cecece;
    border-radius: 10px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #b3b3b3;
  }
 
`;


const PaymentPage = () => {
  const location = useLocation();
  const [fee, setFee] = useState(null);
  const [installmentAmount, setInstallmentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const { StudentId, CourseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeeDetails = async () => {
      console.log(location.state)
      try {
        const response = await fetch(`http://localhost:8000/fee/get/${StudentId}/${CourseId}`);
        const data = await response.json();
        setFee(data);
      } catch (err) {
        alert('Error fetching fee details');
      }
    };
    fetchFeeDetails();
  }, [StudentId, CourseId]);

  const handleInstallmentChange = (e) => {
    setInstallmentAmount(e.target.value);
  };

  const handleSubmitInstallment = async () => {
    // Validate the installment amount
    if (installmentAmount <= 0 || installmentAmount > fee.Balance) {
      alert(`Please enter an Valid amount`);
      return;
    } else if (!paymentMethod) {
      alert("Select Payment Method");
      return;
    }

    var dataToSend = new Date().toLocaleDateString().split("/")
    const installmentData = {
      Amount: parseFloat(installmentAmount),
      Date: `${dataToSend[1].padStart(2,0)}/${dataToSend[0].padStart(2,0)}/${dataToSend[2]}`,
      Time: new Date().toLocaleTimeString(),
      PaymentMethod: paymentMethod,
      Installment: location.state.Installment
    };

    try {
      const response = await fetch(`http://localhost:8000/fee/add-installment/${StudentId}/${CourseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ installment: installmentData }),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Installment submitted successfully!');
        var role = localStorage.getItem("Role");
        if(role == "Admin"){
          navigate('/admin/allfee');
        } else if(role == "Franchise"){
          navigate('/branch/allfee');
        } else if(role == "Teacher"){
          navigate('/teacher/allfee');
        }
        setInstallmentAmount("");
        setPaymentMethod("");
      } else {
        alert('Error processing the installment');
      }
    } catch (err) {
      alert('Error occurred while submitting the installment');
    }
  };

  if (!fee) {
    return <div>Loading fee details...</div>;
  }

  return (
    <MainDashboard>

      <PaymentContainer>
        <Title>Payment Page for {fee.StudentName}</Title>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", justifyItems: "center", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Label>Total Fee:</Label>
            <Value>₹{fee.TotalFee}</Value>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Label>Paid Fee:</Label>
            <Value>₹{fee.PaidFee}</Value>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Label>Balance:</Label>
            <Value>₹{fee.Balance}</Value>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Label>Installment Amount:</Label>
            <Value>₹{location.state.Amount}</Value>
          </div>
        </div>

        <InstallmentContainer>
          <Title>Installment {location.state.Installment}</Title>
          <div>
            <Label>Installment Amount: ₹{location.state.Amount}</Label>
            <InputField
              type="number"
              value={installmentAmount}
              onChange={handleInstallmentChange}
              max={location.state.Amount} // Max value for the installment is the current balance
              placeholder="Enter ₹Amount"
            />
          </div>
          <div>
            <Label>Payment Method</Label>
            <Select1 onChange={(e)=> setPaymentMethod(e.target.value)}>
              <option value="">Select Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Cheque">Cheque</option>
            </Select1>
          </div>
        </InstallmentContainer>

        <Button onClick={handleSubmitInstallment}>Submit Installment</Button>
      </PaymentContainer>
    </MainDashboard>
  );
};

export default PaymentPage;
