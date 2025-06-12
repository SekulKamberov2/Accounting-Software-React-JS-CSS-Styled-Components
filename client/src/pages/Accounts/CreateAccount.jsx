import { useState } from 'react';
import styled from 'styled-components';

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

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  transition: background-color 0.3s ease;
`;

const CancelButton = styled(Button)`
  background-color: #ccc;
  color: black;
`;

const AccountList = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const AccountItem = styled.li`
  padding: 8px 0;
  border-bottom: 1px solid #eee;
`;

const Select = styled.select`
  padding: 8px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
`;
 
const RoundedButton = styled.button`
  padding: 5px 8px;
  background-color: ${({ backgroundColor }) => backgroundColor || 'transparent'};
  color: ${({ color }) => color || 'black'};
  border: 1px solid black;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  margin-left: 3px;
  width: ${({ width }) => width || 'auto'};  
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: ${({ hoverBackgroundColor }) => hoverBackgroundColor || 'transparent'};
    border-color: black; 
  }
`;

const CreateAcount = () => {
 const [newAccount, setNewAccount] = useState({
    name: '',
    type: '',
    code: '',
  }); 
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAccount((prev) => ({ ...prev, [name]: value }));
  }; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:3010/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAccount),
      }); 
      if (!response.ok) throw new Error('Failed to create account');

      alert('Account created successfully!');
      setNewAccount({ name: '', type: '', code: '' }); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ModalBackdrop>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>Create New Account</Title>

        <form onSubmit={handleSubmit}>
          <FormRow>
            <Label>Name</Label>
            <Input
              name="name"
              type="text"
              value={newAccount.name}
              onChange={handleChange}
              required
            />
          </FormRow>

          <FormRow>
            <Label>Type</Label>
            <Select name="type" value={newAccount.type} onChange={handleChange} required>
              <option value="">Select type</option>
              <option value="Asset">Asset</option>
              <option value="Liability">Liability</option>
              <option value="Expense">Expense</option>
              <option value="Revenue">Revenue</option>
              <option value="Equity">Equity</option>
            </Select>
          </FormRow>

          <FormRow>
            <Label>Code</Label>
            <Input name="code" type="text" value={newAccount.code} onChange={handleChange} required />
          </FormRow>

          <ButtonRow>
            <RoundedButton width="75px" hoverBackgroundColor="#53B87D" type="submit">Create</RoundedButton>
            <RoundedButton width="75px" hoverBackgroundColor="#A4CCF5" type="button" onClick={() => window.history.back()}>Cancel</RoundedButton>
          </ButtonRow>
        </form>
 
        {error && <div style={{ color: 'red' }}>{error}</div>}
         
      </Modal>
    </ModalBackdrop>
  );
};
export default CreateAcount;