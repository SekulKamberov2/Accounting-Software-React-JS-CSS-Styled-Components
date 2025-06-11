import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetAllUsersQuery, useDeleteUserMutation } from '../redux/services/apiSlice'; 
import { useNavigate } from 'react-router-dom'; 
import styled from 'styled-components';

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

const UserGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  overflow-y: auto;
  padding: 10px;
`;
 const Created= styled.div`  
    font-size: 14px;
    color: #555; 
`; 
 const Important= styled.div`  
    padding: 3px; 
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
const DeleteButton = styled.button`
  margin-top: 10px;
  padding: 6px 10px;
  font-size: 12px;
  background-color: crimson;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-start;

  &:hover {
    background-color: darkred;
  }
`;
 
const UpdateButton = styled.button` 
  margin-top: 10px;
  padding: 6px 10px;
  font-size: 12px;
  background-color: orange;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-start;

  &:hover {
    background-color: darkred;
  }
`;
 
const ButtonWrapper = styled.div` 
  border-radius: 10px;  
  display: flex;
  flex-wrap: wrap;
  flex-direction: row; 
  cursor: pointer; 
  gap: 5px;
`; 

const AllUsers = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);  
    const currentUser = useSelector((state) => state.auth.user); 
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [newPassword, setNewPassword] = useState(''); 

    const { data: users = [], error, isLoading, refetch } = useGetAllUsersQuery(undefined, { refetchOnMountOrArgChange: true });
    const [deleteUser] = useDeleteUserMutation();  
  console.log(users);
    useEffect(() => {
      const fetchRoles = async () => {
        try {
          const token = localStorage.getItem('token'); 
            const response = await fetch('http://localhost:5003/api/HR/admin/all-roles',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
                },
          });
          const data = await response.json();  
        } catch (err) {
          console.error('Failed to fetch roles', err);
        }
      };

      if (isModalOpen) {
        fetchRoles();
      }
    }, [isModalOpen]);

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
                <span> {user.Id} </span>
                <Important>{user.Name}</Important>
                <Role><strong>{user.Role}</strong></Role>
                <img src={user.Picture} alt="User Image"
                    style={{ objectFit: 'cover', width: '150px', height: '150px', borderRadius: '100%', marginTop: '6px' }} />
                <Important>{user.Email}</Important>
                <Created><strong>Created:</strong> {new Date(user.dateCreated).toLocaleString()}</Created>

                <ButtonWrapper>
                <DeleteButton onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(user.id);
                }}>
                    Delete
                </DeleteButton>

                <UpdateButton onClick={() => navigate(`/edit-user/${user.id}`, { state: user })}>
                    Update
                </UpdateButton> 
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
