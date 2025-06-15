import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ErrorNotification from '../components/ErrorNotification';
 import { RoundedButton } from '../components/ui/Buttons'
 
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
`;

const FormWrapper = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 320px;
  text-align: center;

  @media (max-width: 600px) {
    max-width: 90%;
  }
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  text-align: left;
  font-size: 14px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 16px;
  box-sizing: border-box;

  &:focus {
    border-color: #4e9f3d;
    outline: none;
  }
`;
 
const SuccessMessage = styled.div`
  background-color: #e6ffed;
  padding: 20px;
  border-radius: 8px;
  text-align: left;
  color: #2e7d32;
  font-size: 16px;
`;

const Field = styled.span`
  font-weight: 600;
`;

const SignUp = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '', 
    role: '',
    picture: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3010/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData),
      });
        
      const result = await response.json();

      if (response.ok) {
        navigate('/signin');
      } else {
        setError(result.error || 'Sign up failed');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>Sign Up</Title>

        {error && <ErrorNotification message={error} />}

        <form onSubmit={handleSubmit}>
          <Label htmlFor="UserName">Username:</Label>
          <Input type="text" required name="name" value={userData.name}
            onChange={handleChange} 
          />

          <Label htmlFor="Email">Email:</Label>
          <Input type="email" required name="email" value={userData.email}
            onChange={handleChange} 
          />

          <Label htmlFor="Password">Password:</Label>
          <Input  type="password" name="password" value={userData.password}  required
            onChange={handleChange} 
          /> 

          <Label htmlFor="Role">Role:</Label>
          <Input  type="text" name="role" value={userData.role} required
          onChange={handleChange} 
          /> 

          <Label htmlFor="Picture">Picture (URL):</Label>
          <Input type="text" name="picture" value={userData.picture}
            onChange={handleChange} placeholder="https://somewebaddress.com/photo.jpg"
          />

           <RoundedButton hoverBackgroundColor="lightGreen" type="submit">Sign Up</RoundedButton>
        </form>
      </FormWrapper>
    </Container>
  );
};

export default SignUp;
