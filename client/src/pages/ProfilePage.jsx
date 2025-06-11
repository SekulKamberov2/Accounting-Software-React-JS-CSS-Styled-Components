import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
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
  max-width: 800px;
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

const InvoiceDetails = styled.div`
  margin-top: 20px;
`;

const InvoiceImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-top: 20px;
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

  const user = useSelector((state) => state.auth.user);

  const ACCOUNTANT = user?.roles === "accountant"; 
  const ADMIN = user?.roles === "admin"; 
  const navigate = useNavigate();    
  
  const [newInvoice, setNewInvoice] = useState({
    CustomerId: '',
    Date: '',
    TaxRate: '',
    items: [
      { Description: '', Quantity: '', UnitPrice: '' }
    ],
  });

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
      items: [...prev.items, { Description: '', Quantity: '', UnitPrice: '' }]
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
 
    try {
      const response = await fetch('http://localhost:3010/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInvoice)
      });

      if (!response.ok) throw new Error('Failed to create invoice');
 
      setCreateModalOpen(false);
      setNewInvoice({
        CustomerId: '',
        Date: '',
        TaxRate: '',
        items: [{ Description: '', Quantity: '', UnitPrice: '' }],
      });

      alert('Invoice created successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleShowInvoices = async () => {
    setLoading(true);
    setError(null);
    setModalOpen(true);

    try {
      const response = await fetch('http://localhost:3010/api/invoices');
      if (!response.ok) throw new Error('Failed to fetch invoices');
      const data = await response.json();
      console.log(data);
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
        throw new Error('Invoice not found');
      }
      const data = await response.json();
      setIsModalOpen(false);
      setInvoiceData(data)
      console.log('data ========>', data,  );
    } catch (error) {
      console.error('Error fetching invoice data:', error);
      alert('Failed to fetch invoice data');
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
                <RoundedButton width="121px" onClick={() => setCreateModalOpen(true)}>New Invoice</RoundedButton>
              }
              {(ACCOUNTANT || ADMIN) &&
                <RoundedButton width="115px" onClick={() => handleShowInvoices()}>All Invoices</RoundedButton>
              }
              {ACCOUNTANT &&  
                <RoundedButton width="55px" onClick={() => openModal()}>Find</RoundedButton>    
              } 
            </Invoices>
          }  
          <InvoiceViewer
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            invoices={invoices}
            loading={loading}
            error={error}
          />

           {createModalOpen && (
            <ModalBackdrop width="100%" onClick={() => setCreateModalOpen(false)}>
              <Modal onClick={e => e.stopPropagation()}>
                <h2>Create New Invoice</h2> 
                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', flexWrap: 'wrap' }}>
                    <FormRow style={{ flex: '1 1 200px', minWidth: '200px' }}>
                      <Label htmlFor="CustomerId">Customer ID</Label>
                      <Input id="CustomerId" name="CustomerId" type="number" value={newInvoice.CustomerId}
                        onChange={handleInvoiceChange} required />
                    </FormRow>
                    <FormRow style={{ flex: '1 1 200px', minWidth: '200px' }}>
                      <Label htmlFor="Date">Date</Label>
                      <Input id="Date" name="Date" type="date" value={newInvoice.Date}
                        onChange={handleInvoiceChange} required />
                    </FormRow>
                    <FormRow style={{ flex: '1 1 200px', minWidth: '200px' }}>
                      <Label htmlFor="TaxRate">Tax Rate (decimal)</Label>
                      <Input id="TaxRate" name="TaxRate" type="number" step="0.01" value={newInvoice.TaxRate}
                        onChange={handleInvoiceChange} required />
                    </FormRow>
                  </div>

                  <h3 style={{ marginBottom: '1px', fontWeight: '700' }}>Invoice Items</h3>
                  {newInvoice.items.map((item, index) => (
                    <div key={index} style={{ marginBottom: 55, borderBottom: '2px solid #eee', paddingBottom: 10 }}>
                      <FormRow style={{ width: '100%'}}>
                        <Label>Description</Label>
                        <Textarea
                          name="Description"
                          rows="3"
                          value={item.Description}
                          onChange={(e) => handleItemChange(index, e)}
                          required
                          style={{ width: '100%' }}
                        />
                      </FormRow>
                      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <FormRow style={{ flex: '1 1 150px', minWidth: '150px' }}>
                          <Label>Quantity</Label>
                          <Input
                            name="Quantity"
                            type="number"
                            min="1"
                            value={item.Quantity}
                            onChange={(e) => handleItemChange(index, e)}
                            required
                          />
                        </FormRow>
                        <FormRow style={{ flex: '1 1 150px', minWidth: '150px' }}>
                          <Label>Unit Price</Label>
                          <Input
                            name="UnitPrice"
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.UnitPrice}
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
                    <Button type="submit">Create Invoice</Button>
                    <Button type="button" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
                  </ButtonRow>
                </form> 
              </Modal>
            </ModalBackdrop>
          )}

         
          {isModalOpen && 
          <ModalBackdrop width="100%" isOpen={isModalOpen} >
            <ModalContent>
              <CloseButton onClick={() => closeModal()}>×</CloseButton>
              <Title>INVOICE NUMBER:</Title>
              <InputField width="91%" type="number" placeholder="Enter Invoice ID" value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
              />
              <SearchButton onClick={() => fetchInvoiceData(invoiceId)}>Search</SearchButton> 
            </ModalContent>   
          </ModalBackdrop>  
          }
          {invoiceData && (
            <InvoiceViewer
              isOpen={(openModal)}
              onClose={closeModal}
              invoices={[invoiceData]}
              loading={loading}
              error={error}
            />
          )}
        </ > 
      : navigate('/signin') 
      }
    </PageContainer>
  );
};

export default ProfilePage;
