import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import styled from 'styled-components'; 

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


const RoundedButton = styled.button`
  padding: 5px 8px;
  background-color: transparent;
  color: black;
  border: 2px solid black;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 650;
  margin-left: 9px;
  width: ${({ width }) => width || 'auto'};  
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #d4edda;  
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

 const Invoices = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row; 
  padding: 30px;
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

const UserNameHeader = styled.div`
  font-size: 37px;
  font-weight: 700;
  color: #333;
  margin-top: 11px; 
  text-align: center; 
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
const ConfirmButton = styled.button`
  margin-top: 20px;
  padding: 10px;
  background-color: green;
  color: white;
  border: none;
  width: 100%;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: darkgreen;
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.3);
  display: flex;
  justify-content: center;
  align-items: center;
`;
 
const Modal = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  min-width: 300px;
`;

const RoundedResetButton = styled.button`
  padding: 5px 8px;
  background-color: transparent;
  color: black;
  border: 2px solid black;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 650;
  margin-left: 9px;
  margin-bottom: 15px;
  width: ${({ width }) => width || 'auto'};  
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #d4edda;  
    border-color: black; 
  }
`;

const ProfilePage = () => {  
  const user = useSelector((state) => state.auth.user);
  const ACCOUNTANT = user?.roles === "accountant"; 
  const ADMIN = user?.roles === "admin"; 
  const navigate = useNavigate();    

   
  return (
    <PageContainer> 
      {user?.id > 0 ?  
        <>  
          <ProfileHeader>{ user.roles ? "Accountant" : "Not Accountant"}</ProfileHeader> 
          <UserCard>  
            <span><strong>ID: </strong> { user.id}</span> 
            <span>{ user.name}</span> 
            <span><strong> { user.roles ? user.roles : "Not ACCOUNTANT"}</strong></span>
            <img src={user.picture} alt="User Avatar"
              style={{ width: '200px', height: '200px', borderRadius: '100%' }}
            /> 
            <span>{ user.email}</span>
            <span><strong>Created: </strong> { new Date(user.dateCreated).toLocaleString()}</span>
             
          </UserCard> 
          {user.roles &&  
            <Invoices> 
              {ACCOUNTANT && 
                  <RoundedButton width="121px" onClick={() => window.location.href = '/signup'}>New Invoice</RoundedButton>
              }
              {(ACCOUNTANT || ADMIN) &&
                  <RoundedButton width="115px" onClick={() => navigate('/users')}>All Invoices</RoundedButton>
              }
              {ACCOUNTANT && 
                  <>  
                    <RoundedButton width="55px" onClick={() => navigate('/roles')}>Find</RoundedButton>    
                  </>
              } 
            </Invoices>
          }  
        </ > 
      : navigate('/signin') }
    </PageContainer>
  );
};

export default ProfilePage;
