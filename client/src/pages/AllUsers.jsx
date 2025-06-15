import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetAllUsersQuery, useDeleteUserMutation } from '../redux/services/apiSlice';  
import { useNavigate } from 'react-router-dom'; 
import styled from 'styled-components';
import { RoundedButton } from '../components/ui/Buttons'

const PageWrapper = styled.div` 
  display: flex;
  width: 100%; 
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f2f6f9; 
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

 
 const Created= styled.div`  
    font-size: 14px;
    color: #555; 
`; 
 const Important= styled.div`  
   
    font-size: 19px;
    color: #555; 
    font-weight: 700;
    color: black;
`;  
 const Role= styled.div`    
    font-size: 17px;
    background: #e6f2ff;  
    padding: 0 5px 3px 5px;
`;  
const UserCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;  
  align-items: center;  
 
  min-width: 230px;
  background: white;
  padding: 7px 18px 15px 18px;
  border-radius: 25px;   
  span {
    font-size: 18px;
    color: #555;
    margin-bottom: 2px;
  } 
  strong {
    color: #222;
  }
`;
const FlexRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
  justify-content: center;
`;
  
const ButtonWrapper = styled.div`  
  display: flex;
  flex-wrap: wrap;
  flex-direction: row; 
  cursor: pointer; 
  gap: 3px;
  margin-top: 5px;
`; 

const AllUsers = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);  
    const currentUser = useSelector((state) => state.auth.user);  

    const { data: users = [], error, isLoading, refetch } = useGetAllUsersQuery(undefined, { refetchOnMountOrArgChange: true });
    const [deleteUser] = useDeleteUserMutation();  
   
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading users</p>;

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this user?');
        if (confirmed) {
          try {
            await deleteUser(id).unwrap();
            refetch();  
          } catch (err) {
            alert('Failed to delete user.');
          }
        }
    };
 
return (
    <PageWrapper>
        <Title>All Members</Title>
        {users.length > 0 ? (
        <FlexRow>
            {users.slice().reverse().map((user) => (
            <UserCard key={user.Id}>
                <span>ID: {user.Id} </span>
                <Important>{user.Name}</Important>
                <Role><strong>{user.Role}</strong></Role>
                <img src={user.Picture} alt="User Image"
                    style={{ objectFit: 'cover', width: '150px', height: '150px', borderRadius: '100%', marginTop: '6px' }} />
                <Important>{user.Email}</Important>
                <Created><strong>Created:</strong> {new Date(user.CreatedAt).toLocaleString()}</Created>
                                                   
                <ButtonWrapper>
                  <RoundedButton hoverBackground="red" onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(user.id);
                  }}>
                      Delete
                  </RoundedButton>

                  <RoundedButton hoverBackground="orange" onClick={() => navigate(`/edit-user/${user.id}`, { state: user })}>
                      Update
                  </RoundedButton> 
                </ButtonWrapper>
            </UserCard>
            ))}
        </FlexRow>
        ) : (
        <p>No users found.</p>
        )}

        {users.length == 0 && <p>No users found.</p>}
    </PageWrapper>
    );
};

export default AllUsers;
