import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
 
import styled from 'styled-components'; 

import InvoiceViewer from '../pages/InvoiceViewer.jsx'
import { useSelector } from 'react-redux';

const UserCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;  
   align-items: center; 
  padding: 10px;
  border-radius: 30px;   
  span {
    font-size: 18px;
    color: #555;
    margin-bottom: 4px;
  } 
  strong {
    color: #222;
  }
`;
 
const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
 ; 
  background-color: ${({ theme }) => theme.background || '#f9f9f9'};
  color: ${({ theme }) => theme.text || '#333'};
 
  height: 100vh;  
  width: 100vw;   
`;

const RoundedButton = styled.button`
  padding: 5px 8px;
  background-color: ${({ backgroundColor }) => backgroundColor || 'transparent'};
  color: ${({ color }) => color || 'black'};
  border: 2px solid black;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 650;
  margin-left: 3px;
  width: ${({ width }) => width || 'auto'};  
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: ${({ hoverBackgroundColor }) => hoverBackgroundColor || 'transparent'};
    border-color: black; 
  }
`;
 
const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column; 
  padding: 30px;
  box-sizing: border-box;
`; 

  const Textarea = styled.textarea`
    padding: 10px;
    font-size: 16px;
    border-radius: 6px;
    border: 1px solid #ccc;
    width: 100%;
    resize: vertical;
  `; 

  const Invoices = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;  
    box-sizing: border-box; 
     margin-top: 10px; 
      gap: 5px;
  `; 

  const Payments = styled.div`
  display: flex;
  flex-wrap: wrap;           
  justify-content: center;   
  gap: 5px;                 
  margin-top: 5px;
  width: 100%;
  box-sizing: border-box;
`;


  const ProfileHeader = styled.div`
    font-size: 37px;
    font-weight: 800;
    color: #333; 
    width: 85%;
    text-align: center;  
    margin-bottom: 3px;
  `;   
  
const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 45%; 

  &:hover {
    opacity: 0.9;
  }
`;  

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: ${({ width }) => width || '100%'};
  height: 100%;
  background: rgba(0,0,0,0.3);
  display: flex;
  justify-content: center;
  align-items: center;
`;
 
const Modal = styled.div`
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 25px;
`;
 
const FormRow = styled.div`
  margin-bottom: 15px;
`;

const Input = styled.input`
  padding: 8px;
  width: 100%;
  box-sizing: border-box;
`;

const Label = styled.label`
  font-weight: 600;
  display: block;
  margin-bottom: 5px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const SmallButton = styled.button`
  padding: 6px 12px;
  border: none;
  background-color: #0077cc;
  color: white;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #005fa3;
  }
`; 

const ModalContent = styled.div`
  background: white;
  padding: 0 40px; 0px; 40px;
  border-radius: 8px; 
  height: 200px;
`;

const CloseButton = styled.button` 
  color: red;
  border: none; 
  background: none;
  border-radius: 4px;
  cursor: pointer;
  float: right;
  font-size: 35px;
  padding-top: 15px;
`; 

const Title = styled.div` 
  color: black;    
  font-size: 21px;
  font-weight: 700;
  margin-top: 25px;
`; 

const InputField = styled.input`
  padding: 10px;
  margin: 10px 0;
  width: ${({ width }) => width || '100%'};
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const SearchButton = styled.button`
  background: #4caf50;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 20px;
  font-weight: bold;
  font-size: 30px;
`;
  
const ProfilePage = () => {  
  const [modalOpen, setModalOpen] = useState(false); 
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 
  const [invoiceId, setInvoiceId] = useState('');
  const [invoiceData, setInvoiceData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const user = useSelector((state) => state.auth.user); 
  const ACCOUNTANT = user?.roles === "accountant"; 
  const ADMIN = user?.roles === "admin"; 
  const USER = user?.roles === "user"; 

  const navigate = useNavigate();    
    
  const fetchInvoiceData = async (id) => {
    try { 
      const response = await fetch(`http://localhost:3010/api/invoices/${id}`);
      if (!response.ok) { 
        setError('Invoice not found');
      }
      const data = await response.json(); 
      setInvoiceData(data)
      setIsModalOpen(true); 
    
    } catch (error) { 
      setError(error.message || 'Error fetching invoice data.');
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setInvoiceData(null);  
  };
 
  return (
    <PageContainer>  
      {user?.id > 0 ?  
        <>  
          <ProfileHeader>{ ACCOUNTANT ? "Accountant" : ADMIN ? "Admin" : "User" }</ProfileHeader>  
           
          <UserCard>  
            <span><strong>ID: </strong> { user.id}</span> 
            <span>{ user.name}</span>  
            <img src={user.picture} alt="User Avatar" style={{width: '200px', height: '200px', borderRadius: '100%'}} /> 
            <span>{ user.email}</span>
            <span><strong>Created: </strong> { new Date(user.dateCreated).toLocaleString()}</span> 
          </UserCard> 

          {user.roles == 'accountant' && 
          <>  
            <Payments> 
              <RoundedButton width="91px" hoverBackgroundColor="#A4CCF5" onClick={() => navigate('invoices-page')}>Invoices</RoundedButton> 
              <RoundedButton width="175px" hoverBackgroundColor="#A4CCF5" onClick={() => navigate('recurring-invoices')}>Recurring Invoices</RoundedButton>
              <RoundedButton width="93px" hoverBackgroundColor="#53B87D" onClick={() => navigate('accounts')}>Accounts</RoundedButton> 
            </Payments>  

            <Payments> 
              <RoundedButton width="67px" hoverBackgroundColor="#888DBF" onClick={() => navigate('taxes')}>Taxes</RoundedButton> 
              <RoundedButton width="116px" hoverBackgroundColor="#1AA17F" onClick={() => navigate('bank-transactions')}>Bank Trans.</RoundedButton> 
              <RoundedButton width="82px" hoverBackgroundColor="#C09BC2" onClick={() => navigate('journal-entries')}>Journal</RoundedButton> 
              <RoundedButton width="97px" hoverBackgroundColor="#F78745" onClick={() => navigate('payments')}>Payments</RoundedButton> 
              <RoundedButton width="85px" hoverBackgroundColor="#98CAD4" onClick={() => navigate('vendors')}>Vendors</RoundedButton> 
            </Payments>  
            </>        
          }
          {error && <ErrorMessage>{error}</ErrorMessage>}
  
          {isModalOpen && user.roles == 'accountant' && 
          <ModalBackdrop width="100%" isOpen={isModalOpen} >
            <ModalContent>
              <CloseButton onClick={() => {closeModal(); setInvoiceId(0);}}>×</CloseButton>
              <Title>INVOICE NUMBER:</Title>
              <InputField width="91%" type="number" placeholder="Enter Invoice ID" value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
              />
              <SearchButton onClick={() => {fetchInvoiceData(invoiceId); setInvoiceId(0);}}>Search</SearchButton> 
            </ModalContent>   
          </ModalBackdrop>  
          }
 
      <MainContent>
          <Outlet />  
      </MainContent>
        </ > 
      : navigate('/signin') 
      }
 
    </PageContainer>
  );
};

export default ProfilePage;
