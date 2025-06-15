import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PageContainer, ActionsButtonRow, Cell, Items, TableRow, TableHeader, TableWrapper  } from '../components/ui/GridComponents'; 
import { PageHeader } from '../components/ui/PageHeader';
import { SearchInput } from '../components/ui/SearchInput';
 

const ModalButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const RoundedButton = styled.button`
  padding: 5px 8px;
  background-color: ${({ backgroundColor }) => backgroundColor || 'transparent'};
  color: ${({ color }) => color || 'black'};
  border: 2px solid black;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: ${({ fontWeight }) => fontWeight || 'normal'};
  margin-left: 3px;
  width: ${({ width }) => width || 'auto'};
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: ${({ hoverBackgroundColor }) => hoverBackgroundColor || 'transparent'};
    border-color: black;
  }
`; 

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
`; 

const Input = styled.input`
  padding: 0.5rem;
  margin-top: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 0.5rem;
  margin-top: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`; 
 
 
const ErrorMsg = styled.p`
  color: #e74c3c;
`; 

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ visible }) => (visible ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: relative;
`; 
 

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPayment, setEditPayment] = useState(null);
  const [deletePayment, setDeletePayment] = useState(null);
  const [formData, setFormData] = useState({
    invoice_id: '',
    amount: '',
    date: '',
    method: 'cash'
  });
  const [error, setError] = useState(''); 
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch('http://localhost:3010/api/payments');
      const data = await res.json();
      console.log(data);
      setPayments(data || []);
    } catch (err) {
      setError('Failed to load payments');
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); 

    const method = editPayment ? 'PUT' : 'POST';
    const url = editPayment
      ? `http://localhost:3010/api/payments/${editPayment.Id}`
      : `http://localhost:3010/api/payments`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      if (!res.ok) setError(result.message || 'Failed to save payment');
 
      setFormData({ invoice_id: '', amount: '', date: '', method: 'cash' });
      setEditPayment(null);
      setIsModalOpen(false);
      fetchPayments();
    } catch (err) {
        setError(err.message);
    }
  };

  const handleDelete = async id => {
    try {
      const res = await fetch(`http://localhost:3010/api/payments/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) setError('Failed to delete payment');
 
      setDeletePayment(null);
      fetchPayments();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredPayments = payments.filter(p => {
    if (!searchTerm.trim()) return true;
  
    if (/^\d+$/.test(searchTerm)) {
      const searchId = parseInt(searchTerm, 10);
      return (p.InvoiceId  === searchId) ? true : false;
    }
  
    if (p.Method?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return true;
    }
  
    try {
      const paymentDate = new Date(p.Date).toISOString().split('T')[0];
      if (paymentDate.includes(searchTerm)) {
        return true;
      }
    } catch (e) {
      console.error('Invalid date format:', p.Date);
    }

    return false;
  });

  return (
    <PageContainer> 

      <PageHeader
        title="Payments"
        error={error}
        buttonText="New Payment"
        buttonColor="white" 
        buttonHoverBg="#F78745" 
        buttonWidth="137px"
        onButtonClick={() =>{
          setFormData({ invoice_id: '', amount: '', date: '', method: 'cash' });
          setEditPayment(null);
          setIsModalOpen(true);
          setError(''); 
        }}  
      />  

      <ModalOverlay visible={isModalOpen}>
        <ModalContent> 
          <Form onSubmit={handleSubmit}>
            <Label>
              Invoice ID:
              <Input type="number" name="invoice_id" value={formData.invoice_id} required onChange={handleChange} />
            </Label>
            <Label>
              Amount:
              <Input type="number" name="amount" value={formData.amount} required step="0.01" onChange={handleChange} />
            </Label>
            <Label>
              Date:
              <Input type="date" name="date" value={formData.date} required onChange={handleChange} />
            </Label>
            <Label>
              Method:
              <Select name="method" value={formData.method} onChange={handleChange}>
                <option value="cash">Cash</option>
                <option value="credit_card">Credit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
              </Select>
            </Label>
            <ModalButtonRow> 
                <RoundedButton width="83px" hoverBackgroundColor="orange" fontWeight="600" type="submit">
                    {editPayment ? 'Update' : 'Submit'}
                </RoundedButton>
                <RoundedButton width="92px" fontWeight="600" hoverBackgroundColor="#F78745"
                    onClick={() => setIsModalOpen(false)}
                >
                    Cancel
                </RoundedButton>  
           </ModalButtonRow>   

            {error && <ErrorMsg>{error}</ErrorMsg>} 
          </Form>
        </ModalContent>
      </ModalOverlay>

      {deletePayment && (
        <ModalOverlay visible={true}>
          <ModalContent>
            <p>Are you sure you want to delete payment ID {deletePayment.Id}?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <RoundedButton width="81px" fontWeight="600" hoverBackgroundColor="red"
                onClick={() => handleDelete(deletePayment.Id)}
              >
                Delete
              </RoundedButton>
              <RoundedButton width="81px" fontWeight="600" hoverBackgroundColor="#C09BC2"
                onClick={() => setDeletePayment(null)}
              >
                Cancel
              </RoundedButton>
            </div>
          </ModalContent>
        </ModalOverlay>
      )} 

      <SearchInput
        type="text"
        placeholder="Search by Invoice ID, Method, or Date"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      /> 

      <TableWrapper>
        <TableHeader backgroundColor="#f78745"> 
            <Cell>ID</Cell>
            <Cell>Invoice ID</Cell>
            <Cell>Amount</Cell>
            <Cell>Date</Cell>
            <Cell>Method</Cell>
            <Cell>Actions</Cell> 
        </TableHeader>
        <tbody>
          {filteredPayments.map(p => ( 
            <TableRow key={p.Id} backgroundColor="#ff8c49">
              <Cell>{p.Id}</Cell>
              <Cell>{p.InvoiceId}</Cell>
              <Cell>{p.Amount}</Cell>
              <Cell>{new Date(p.Date).toISOString().split('T')[0]}</Cell>
              <Cell>{p.Method}</Cell>
              <Cell>
                <RoundedButton width="75px" hoverBackgroundColor="orange"
                  onClick={() => {
                    setEditPayment(p);
                    setFormData({
                      invoice_id: p.InvoiceId,
                      amount: p.Amount,
                      date: new Date(p.Date).toISOString().split('T')[0],
                      method: p.Method
                    });
                    setIsModalOpen(true);
                    setError(''); 
                  }}
                >
                  Update
                </RoundedButton>
                <RoundedButton width="75px" hoverBackgroundColor="red"
                  onClick={() => setDeletePayment(p)}
                >
                  Delete
                </RoundedButton>
              </Cell>
            </TableRow>
          ))}
        </tbody>
      </TableWrapper>
    </PageContainer>
  );
};

export default Payments;
