import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  min-width: 300px;
  width: 70%;
`;
  
const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
  margin: 40px auto;
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

const Title = styled.h2`
  margin-bottom: 1rem;
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
const SearchInput = styled.input`
  padding: 10px;
  width: 97.5%;
  margin-bottom: 20px;
  border-radius: 6px;
  border: 1px solid #ccc;
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

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #27ae60;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.17rem 0.17rem 0.17rem 0.75rem;
  background-color: #f5f5f5; 
  border-bottom: 2px solid #ddd;
  background-color: #F78745; 
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #eee; 
`;

const ErrorMsg = styled.p`
  color: #e74c3c;
`;

const SuccessMsg = styled.p`
  color: #2ecc71;
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

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
`; 

const TR = styled.tr`
  &:hover {
    background-color: #f7d2ba
  }
`;

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    invoice_id: '',
    amount: '',
    date: '',
    method: 'cash'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
        const res = await fetch('http://localhost:3010/api/payments');
        const data = await res.json();
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
    setSuccess('');

    try {
      const res = await fetch('http://localhost:3010/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json(); 
      if (!res.ok) {
        setError(result.message || 'Failed to record payment');
      }

      setSuccess('Payment recorded successfully');
      setFormData({ invoice_id: '', amount: '', date: '', method: 'cash' });
      fetchPayments();
      setIsModalOpen(false);
    } catch (err) {
        setError(err.message);
    }
  };

  const filteredPayments = payments.filter(p =>
    p.InvoiceId.toString().includes(searchTerm.toLowerCase()) ||
    p.Method.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(p.Date).toISOString().split('T')[0].includes(searchTerm)
  );

  return (
    <Container>
        <TitleRow>
          <Title>Record Payment</Title>
          <RoundedButton width="137px" fontWeight="600" hoverBackgroundColor="#F78745"
            onClick={() => setIsModalOpen(true)}
          >
            New Payment
          </RoundedButton>
        </TitleRow>

        <ModalOverlay visible={isModalOpen}>
          <ModalContent>
            <CloseButton onClick={() => setIsModalOpen(false)}>&times;</CloseButton>
            <Form onSubmit={handleSubmit}>
              <Label>
                Invoice ID:
                <Input type="number" name="invoice_id" value={formData.invoice_id}  required
                  onChange={handleChange} 
                />
              </Label>
              <Label>
                Amount:
                <Input type="number" name="amount" value={formData.amount} required step="0.01"
                  onChange={handleChange} 
                />
              </Label>
              <Label>
                Date:
                <Input type="date" name="date" value={formData.date} required
                  onChange={handleChange} 
                />
              </Label>
              <Label>
                Method:
                <Select name="method" value={formData.method} onChange={handleChange}>
                  <option value="cash">Cash</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </Select>
              </Label>
              <Button type="submit">Submit Payment</Button>
              {error && <ErrorMsg>{error}</ErrorMsg>}
              {success && <SuccessMsg>{success}</SuccessMsg>}
            </Form>
          </ModalContent>
        </ModalOverlay> 

        <Label> 
          <SearchInput type="text" placeholder="Search by Invoice ID, Method, or Date" value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </Label>
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Invoice ID</Th>
              <Th>Amount</Th>
              <Th>Date</Th>
              <Th>Method</Th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(p => (
              <TR key={p.Id}>
                <Td>{p.Id}</Td>
                <Td>{p.InvoiceId}</Td>
                <Td>{p.Amount}</Td>
                <Td>{new Date(p.Date).toISOString().split('T')[0]}</Td>
                <Td>{p.Method}</Td>
              </TR>
            ))}
          </tbody>
        </Table>
    </Container>
  );
};

export default Payments;
