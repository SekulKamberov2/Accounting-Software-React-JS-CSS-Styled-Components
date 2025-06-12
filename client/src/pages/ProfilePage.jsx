import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
 
import styled from 'styled-components'; 

import {InvoiceViewer} from '../components/InvoiceViewer'
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
  const [createModalOpen, setCreateModalOpen] = useState(false); 
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [invoiceId, setInvoiceId] = useState('');
  const [invoiceData, setInvoiceData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);

  const user = useSelector((state) => state.auth.user);

  const ACCOUNTANT = user?.roles === "accountant"; 
  const ADMIN = user?.roles === "admin"; 
  const navigate = useNavigate();    
  
  const [newInvoice, setNewInvoice] = useState({
    customer_id: '',
    date: '',
    tax_rate: '',
    items: [
      { description: '', quantity: '', unit_price: '' }
    ],
  });

const handleUpdateInvoice = (invoice) => {
 
  setModalOpen(false);
  setIsModalOpen(false);  

 
  setNewInvoice({
    customer_id: invoice.CustomerId,
    date: invoice.Date?.substring(0, invoice.Date.indexOf('T')),  
    tax_rate: invoice.TaxRate,
    items: invoice.items.map(item => ({
      description: item.Description,
      quantity: item.Quantity,
      unit_price: item.UnitPrice
    }))
  });

  setEditingInvoiceId(invoice.Id);
  setIsUpdating(true);
  setCreateModalOpen(true);
};
  
  const handleInvoiceChange = (e) => {
    const { name, value } = e.target;
    setNewInvoice(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    setNewInvoice(prev => {
      const items = [...prev.items];
      items[index] = { ...items[index], [name]: value };
      return { ...prev, items };
    });
  };

  const addItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: '', unit_price: '' }]
    }));
  };

  const removeItem = (index) => {
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const url = isUpdating
    ? `http://localhost:3010/api/invoices/${editingInvoiceId}`
    : 'http://localhost:3010/api/invoices';

  const method = isUpdating ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInvoice),
    });

    if (!response.ok) 
      setError(isUpdating ? 'Failed to update invoice' : 'Failed to create invoice');

    setCreateModalOpen(false);
    setIsUpdating(false);
    setEditingInvoiceId(null);
    setNewInvoice({
      customer_id: '',
      date: '',
      tax_rate: '',
      items: [{ description: '', quantity: '', unit_price: '' }],
    });

    alert(isUpdating ? 'Invoice updated successfully!' : 'Invoice created successfully!'); //TO DO: IMPLEMENT NOTIDIER FOR MY APP
    handleShowInvoices();  
  } catch (err) {
    setError(err.message || 'An unexpected error occurred');
  }
};

  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;

    try {
      const response = await fetch(`http://localhost:3010/api/invoices/${invoiceId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        setError('Failed to delete invoice');
      }
 
      setInvoices(prev =>
        prev.filter(invoice => invoice.Id !== invoiceId)
      );

      alert('Invoice deleted successfully');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert(`Error: ${error.message}`);
    }
  };


  const handleShowInvoices = async () => {
    setLoading(true);
    setError(null);
    setModalOpen(true);

    try {
      const response = await fetch('http://localhost:3010/api/invoices');
      if (!response.ok) setError('Failed to fetch invoices');
      const data = await response.json();
     
      setInvoices(data);
    } catch (err) {
        setError(err.message || 'Unknown error');
        setInvoices([]);
    } finally {
        setLoading(false);
    }
  };

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
          <ProfileHeader>{ user.roles ? "Accountant" : user.roles }</ProfileHeader>   
          <UserCard>  
            <span><strong>ID: </strong> { user.id}</span> 
            <span>{ user.name}</span>  
            <img src={user.picture} alt="User Avatar"
              style={{ width: '200px', height: '200px', borderRadius: '100%' }}
            /> 
            <span>{ user.email}</span>
            <span><strong>Created: </strong> { new Date(user.dateCreated).toLocaleString()}</span>
             
          </UserCard> 
          {user.roles == 'accountant' && 
          <> 
            <Invoices> 
              {(ACCOUNTANT || ADMIN) &&
                <RoundedButton width="91px" hoverBackgroundColor="#A4CCF5" 
                  onClick={() => handleShowInvoices()}>Invoices</RoundedButton>
              }

              {ACCOUNTANT && 
                <RoundedButton width="59px" hoverBackgroundColor="#A4CCF5" 
                 onClick={() => setCreateModalOpen(true)}>New</RoundedButton>
              }
     
              {ACCOUNTANT &&  
                <RoundedButton width="55px" hoverBackgroundColor="#A4CCF5" 
                  onClick={() => openModal()}>Find</RoundedButton>    
              } 
            </Invoices>
             <Payments>
              <RoundedButton width="175px" hoverBackgroundColor="#A4CCF5" onClick={() => navigate('recurring-invoices')}>Recurring Invoices</RoundedButton>
              <RoundedButton width="53px" hoverBackgroundColor="#A4CCF5" onClick={() => navigate('recurring-invoices/create"')}>New</RoundedButton> 
              <RoundedButton width="75px" hoverBackgroundColor="orange" onClick={() => navigate('recurring-invoices/update/:id')}>Update</RoundedButton>  
              <RoundedButton width="75px" hoverBackgroundColor="red" onClick={() => navigate('recurring-invoices/delete/:id')}>Delete</RoundedButton>
 
              <RoundedButton width="82px" hoverBackgroundColor="#53B87D" onClick={() => navigate('accounts')}>Acounts</RoundedButton>
              <RoundedButton width="55px" hoverBackgroundColor="#53B87D" onClick={() => navigate('accounts/create')}>New</RoundedButton> 
              <RoundedButton width="75px" hoverBackgroundColor="orange" onClick={() => navigate('accounts/update/:id')}>Update</RoundedButton>
              <RoundedButton width="75px" hoverBackgroundColor="red" onClick={() => navigate('accounts/delete/:id')}>Delete</RoundedButton> 
            </Payments>  

            <Payments>  
              <RoundedButton width="67px" hoverBackgroundColor="#888DBF" onClick={() => navigate('taxes')}>Taxes</RoundedButton>
              <RoundedButton width="53px" hoverBackgroundColor="#888DBF" onClick={() => navigate('taxes/create')}>New</RoundedButton>
              <RoundedButton width="75px" hoverBackgroundColor="orange" onClick={() => navigate('taxes/update/:id')}>Update</RoundedButton> 
              <RoundedButton width="75px" hoverBackgroundColor="red" onClick={() => navigate('taxes/delete/:id')}>Delete</RoundedButton> 

              <RoundedButton width="116px" hoverBackgroundColor="#1AA17F" onClick={() => navigate('bank-transactions')}>Bank Trans.</RoundedButton>
              <RoundedButton width="55px" hoverBackgroundColor="#1AA17F" onClick={() => navigate('bank-transactions/create')}>New</RoundedButton> 
              <RoundedButton width="75px" hoverBackgroundColor="orange" onClick={() => navigate('bank-transactions/update/:id')}>Update</RoundedButton>
              <RoundedButton width="75px" hoverBackgroundColor="red" onClick={() => navigate('bank-transactions/delete/:id')}>Delete</RoundedButton> 
 
              <RoundedButton width="82px" hoverBackgroundColor="#C09BC2" onClick={() => navigate('journal-entries')}>Journal</RoundedButton>
              <RoundedButton width="53px" hoverBackgroundColor="#C09BC2" onClick={() => navigate('journal-entries/create')}>New</RoundedButton> 
              <RoundedButton width="75px" hoverBackgroundColor="orange" onClick={() => navigate('journal-entries/update/:id')}>Update</RoundedButton>
              <RoundedButton width="75px" hoverBackgroundColor="red" onClick={() => navigate('journal-entries/delete/:id')}>Delete</RoundedButton> 
            </Payments> 
            <Payments> 
    
              <RoundedButton width="97px" hoverBackgroundColor="#F78745" onClick={() => navigate('payments')}>Payments</RoundedButton>
              <RoundedButton width="53px" hoverBackgroundColor="#F78745" onClick={() => navigate('payments/create')}>New</RoundedButton>
              <RoundedButton width="75px" hoverBackgroundColor="orange" onClick={() => navigate('payments/update/:id')}>Update</RoundedButton> 
              <RoundedButton width="75px" hoverBackgroundColor="red" onClick={() => navigate('payments/delete/:id')}>Delete</RoundedButton> 
              <RoundedButton width="85px" hoverBackgroundColor="#98CAD4" onClick={() => navigate('vendors')}>Vendors</RoundedButton>
              <RoundedButton width="55px" hoverBackgroundColor="#98CAD4" onClick={() => navigate('vendors/create')}>New</RoundedButton> 
              <RoundedButton width="75px" hoverBackgroundColor="orange" onClick={() => navigate('vendors/update/:id')}>Update</RoundedButton>
              <RoundedButton width="75px" hoverBackgroundColor="red" onClick={() => navigate('vendors/delete/:id')}>Delete</RoundedButton> 
            </Payments>  
            </>        
          }
          {error && <ErrorMessage>{error}</ErrorMessage>}
  
          <InvoiceViewer
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            invoices={invoices}
            loading={loading}
            error={error}
            handleDeleteInvoice={handleDeleteInvoice}
            handleUpdateInvoice={handleUpdateInvoice}
          />

           {createModalOpen && (
            <ModalBackdrop width="100%" onClick={() => setCreateModalOpen(false)}>
              <Modal onClick={e => e.stopPropagation()}>
                <h2>{isUpdating ? 'Update Invoice' : 'Create New Invoice'}</h2>
                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <FormRow style={{ flex: '1 1 200px', minWidth: '200px' }}>
                      <Label htmlFor="CustomerId">Customer ID</Label>
                      <Input id="CustomerId" name="customer_id" type="number" value={newInvoice.customer_id}
                        onChange={handleInvoiceChange} required />
                    </FormRow>
                    <FormRow style={{ flex: '1 1 200px', minWidth: '200px' }}>
                      <Label htmlFor="Date">Date</Label>
                      <Input id="Date" name="date" type="date" value={newInvoice.date}
                        onChange={handleInvoiceChange} required />
                    </FormRow>
                    <FormRow style={{ flex: '1 1 200px', minWidth: '200px' }}>
                      <Label htmlFor="TaxRate">Tax Rate (decimal)</Label>
                      <Input id="TaxRate" name="tax_rate" type="number" step="0.01" value={newInvoice.tax_rate}
                        onChange={handleInvoiceChange} required />
                    </FormRow>
                  </div>

                  <h3 style={{ marginBottom: '1px', fontWeight: '700' }}>Invoice Items</h3>
                  {newInvoice.items.map((item, index) => (
                    <div key={index} style={{ marginBottom: 15, borderBottom: '2px solid #eee', paddingBottom: 10 }}>
                      <FormRow style={{ width: '97%'}}>
                        <Label>Description</Label>
                        <Textarea
                          name="description"
                          rows="3"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, e)}
                          required
                          style={{ width: '100%' }}
                        />
                      </FormRow>
                      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <FormRow style={{ flex: '1 1 150px', minWidth: '150px' }}>
                          <Label>Quantity</Label>
                          <Input
                            name="quantity"
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, e)}
                            required
                          />
                        </FormRow>
                        <FormRow style={{ flex: '1 1 150px', minWidth: '150px' }}>
                          <Label>Unit Price</Label>
                          <Input
                            name="unit_price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.unit_price}
                            onChange={(e) => handleItemChange(index, e)}
                            required
                          />
                        </FormRow>
                      </div>
                      {newInvoice.items.length > 1 && (
                        <SmallButton type="button" onClick={() => removeItem(index)} style={{ marginTop: '8px' }}>
                          Remove Item
                        </SmallButton>
                      )}
                    </div>
                  ))}

                  <SmallButton type="button" onClick={addItem}>+ Add Item</SmallButton>

                  <ButtonRow style={{ justifyContent: 'space-between', marginTop: '25px' }}>
                    <Button type="submit">{isUpdating ? 'Update Invoice' : 'Create Invoice'}</Button>
                    <Button type="button" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
                  </ButtonRow>
                </form> 
              </Modal>
            </ModalBackdrop>
          )}

         
          {isModalOpen && 
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
          {isModalOpen && invoiceData && (
            <InvoiceViewer
              isOpen={isModalOpen}
              onClose={closeModal}
              invoices={[invoiceData]}
              loading={loading}
              error={error} 
              handleDeleteInvoice={handleDeleteInvoice}
              handleUpdateInvoice={(inv) => {
                closeModal();  
                handleUpdateInvoice(inv);  
          }}
        />
      )} 
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
