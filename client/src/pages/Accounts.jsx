import { useEffect, useState } from 'react';

import styled from 'styled-components';
import { SearchInput } from '../components/ui/SearchInput';
import { PageHeader } from '../components/ui/PageHeader';
import { PageContainer, ActionsButtonRow, Cell, Items, TableRow, TableHeader, TableWrapper  } from '../components/ui/GridComponents'; 
import { RoundedButton } from '../components/ui/Buttons'
  
const Title = styled.h2`
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 20px;
`; 
 
const NoResults = styled.div`
  margin-top: 20px;
  color: #999;
  text-align: center;
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
  z-index: 999;
`;

const Modal = styled.div`
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  padding: 25px;
  box-sizing: border-box;
`;

const FormRow = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  font-weight: 600;
  display: block;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 8px;
  width: 100%;
  box-sizing: border-box;
`;

const Select = styled.select`
  padding: 8px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ModalButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;
  
const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [updateAccount, setUpdateAccount] = useState(null);
  const [deleteAccount, setDeleteAccount] = useState(null);
  const [newAccountModal, setNewAccountModal] = useState(false);
  const [formData, setFormData] = useState({ Name: '', Type: '', Code: '' });

  const fetchAccounts = async () => {
    try {
      const response = await fetch('http://localhost:3010/api/accounts');
      const data = await response.json();
      setAccounts(data);
      setFilteredAccounts(data);
    } catch (err) {
      console.error('Failed to fetch accounts:', err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
  const filtered = accounts.filter((acc) => {
    if (!filter.trim()) return true;
 
    if (/^\d+$/.test(filter)) { 
      const searchId = parseInt(filter, 10);
      if (acc.Id === searchId) {
        return true;
      }
      return false;  
    }
 
    const searchTerm = filter.toLowerCase();
    return (
      acc.Name?.toLowerCase().includes(searchTerm) ||
      acc.Type?.toLowerCase().includes(searchTerm)
    );
  });

  setFilteredAccounts(filtered);
}, [filter, accounts]);

  const handleUpdate = async (id, data) => {
    try {
      const response = await fetch(`http://localhost:3010/api/accounts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) setError('Update failed');
      await fetchAccounts();
      setUpdateAccount(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3010/api/accounts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) setError('Delete failed');
      await fetchAccounts();
      setDeleteAccount(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3010/api/accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) setError('Create failed');
      await fetchAccounts();
      setNewAccountModal(false);
      setFormData({ Name: '', Type: '', Code: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const renderModal = (account, isNew = false) => (
    <ModalBackdrop onClick={() => {
      if (isNew) setNewAccountModal(false);
      else setUpdateAccount(null);
    }}>
      <Modal onClick={e => e.stopPropagation()}>
        <form onSubmit={isNew ? handleCreate : (e) => {
          e.preventDefault();
          handleUpdate(account.Id, formData);
        }}>
          <Title>{isNew ? 'New Account' : 'Update Account'}</Title>
          <FormRow>
            <Label>Name</Label>
            <Input name="Name" value={formData.Name} onChange={e => setFormData(prev => ({ ...prev, Name: e.target.value }))} required />
          </FormRow>
          <FormRow>
            <Label>Type</Label>
            <Select name="Type" value={formData.Type} onChange={e => setFormData(prev => ({ ...prev, Type: e.target.value }))} required>
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
            <Input name="Code" value={formData.Code} onChange={e => setFormData(prev => ({ ...prev, Code: e.target.value }))} required />
          </FormRow>
          <ModalButtonRow> 
            <RoundedButton type="submit" hoverBackgroundColor="orange" color="black">Save</RoundedButton> 
            <RoundedButton hoverBackgroundColor="#53B87D" color="black" onClick={() => isNew ? setNewAccountModal(false) : setUpdateAccount(null)}>Cancel</RoundedButton>
          </ModalButtonRow>
        </form>
      </Modal>
    </ModalBackdrop>
  );

  const renderDeleteModal = (account) => (
    <ModalBackdrop onClick={() => setDeleteAccount(null)}>
      <Modal onClick={e => e.stopPropagation()}>
        <h3>Delete Account ID {account.Id}</h3>
        <p>Are you sure you want to delete <b>{account.Name}</b>?</p>
        <ModalButtonRow>
         <RoundedButton hoverBackgroundColor="red" color="black" onClick={() => handleDelete(account.Id)}>Delete</RoundedButton>
         <RoundedButton hoverBackgroundColor="#53B87D" color="black" onClick={() => setDeleteAccount(null)}>Cancel</RoundedButton>
        </ModalButtonRow>
      </Modal>
    </ModalBackdrop>
  );

  return (
    <PageContainer>
      <PageHeader
        title="All Accounts"
        error={error}
        buttonText="New Account"
        buttonColor="white" 
        buttonHoverBg="#53B87D" 
        buttonWidth="55"
        onButtonClick={() => {
          setFormData({ Name: '', Type: '', Code: '' });
          setNewAccountModal(true);
        }}  
      />   
      <SearchInput
        type="text"
        placeholder="Search by id, name, or type..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {filteredAccounts.length === 0 ? (
        <NoResults>No matching accounts found.</NoResults>
      ) : (
        <TableWrapper>
          <TableHeader backgroundColor="#53B87D">
            <Cell>ID</Cell>
            <Cell>Name</Cell>
            <Cell>Type</Cell>
            <Cell>Code</Cell>
            <Cell>Actions</Cell>
          </TableHeader>

          {filteredAccounts.map(account => (
            <TableRow key={account.Id} backgroundColor="#75ffac">
              <Cell>{account.Id}</Cell>
              <Cell>{account.Name}</Cell>
              <Cell>{account.Type}</Cell>
              <Cell>{account.Code}</Cell>
              <Cell>
                <ActionsButtonRow>
                  <RoundedButton width="75px" hoverBackgroundColor="#53B87D"
                    onClick={() => {
                      setFormData({ Name: account.Name, Type: account.Type, Code: account.Code });
                      setUpdateAccount(account);
                    }}
                  >
                    Update
                  </RoundedButton>
                  <RoundedButton width="75px" hoverBackgroundColor="#E74C3C"
                    onClick={() => setDeleteAccount(account)}
                  >
                    Delete
                  </RoundedButton>
                </ActionsButtonRow>
              </Cell>
            </TableRow>
          ))}
        </TableWrapper> 
      )}

      {updateAccount && renderModal(updateAccount)}
      {deleteAccount && renderDeleteModal(deleteAccount)}
      {newAccountModal && renderModal({}, true)}
    </PageContainer>
  );
};

export default Accounts;
