import { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  max-width: 1000px;
  margin: auto;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  margin-bottom: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Label = styled.label`
  flex: 1 1 200px;
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

const Button = styled.button`
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #2980b9;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.25rem 0.25rem 0.25rem 0.61rem;
  background-color: #1AA17F;
  border-bottom: 2px solid #ddd;
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
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

const ErrorList = styled.ul`
  margin-top: 1rem;
  color: #e74c3c;
`;

const TR = styled.tr`
  &:hover {
    background-color: #e0f7f1;  
  }
`;


const BankTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    accountId: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    search: ''
  });
  const [csvFile, setCsvFile] = useState(null);
  const [importErrors, setImportErrors] = useState([]);
  const [filter, setFilter] = useState('');
  const [formData, setFormData] = useState({});
  const [updateEntry, setUpdateEntry] = useState(null);
  const [deleteEntry, setDeleteEntry] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

const fetchTransactions = async () => {
  try { 
    const snakeCaseFilters = {
      account_id: filters.accountId,
      start_date: filters.startDate,
      end_date: filters.endDate,
      min_amount: filters.minAmount,
      max_amount: filters.maxAmount,
      search: filters.search
    };

    const query = new URLSearchParams(snakeCaseFilters).toString();
    const response = await fetch(`http://localhost:3010/api/bank-transactions?${query}`);

    if (!response.ok) {
      setError('Failed to fetch transactions');
      return;
    }

    const data = await response.json();
    setTransactions(data.data);
  } catch (error) {
    setError(error);
  }
};


  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => setCsvFile(e.target.files[0]);

  const handleImport = async () => {
    if (!csvFile) return alert('Please select a CSV file.');

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await fetch('/api/bank-transactions/import', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setImportErrors(data.errors || []);
      fetchTransactions();
    } catch (err) {
      console.error('Error importing transactions:', err);
    }
  };

  return (
    <Container>
      <Section>
        <Title>Filters</Title>
        <Form>
          <Label>
            Account ID:
            <Input type="number" name="accountId" value={filters.accountId} onChange={(e) => handleFilterChange(e)} />
          </Label>
          <Label>
            Start Date:
            <Input type="date" name="startDate" value={filters.startDate} onChange={(e) => handleFilterChange(e)} />
          </Label>
          <Label>
            End Date:
            <Input type="date" name="endDate" value={filters.endDate} onChange={(e) => handleFilterChange(e)} />
          </Label>
          <Label>
            Min Amount:
            <Input type="number" name="minAmount" value={filters.minAmount} onChange={(e) => handleFilterChange(e)} />
          </Label>
          <Label>
            Max Amount:
            <Input type="number" name="maxAmount" value={filters.maxAmount} onChange={(e) => handleFilterChange(e)} />
          </Label>
          <Label>
            Description Search:
            <Input type="text" name="search" value={filters.search} onChange={(e) => handleFilterChange(e)} />
          </Label>
        </Form>
      </Section>

      <Section>
        <Title>Import Transactions from CSV</Title>
        <Input type="file" accept=".csv" onChange={handleFileChange} style={{border: '2px solid black', marginRight: '10px', borderRadius: '10px', paddingBottom: '13px', height: '15px'}}/>
        <RoundedButton width="86px" hoverBackgroundColor="#1AA17F" color="black" onClick={handleImport}>Import</RoundedButton>
        {importErrors.length > 0 && (
          <ErrorList>
            {importErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ErrorList>
        )}
      </Section> 

      <Section>
        <Title>Transaction List</Title>
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Date</Th>
              <Th>Account Code</Th> 
              <Th>AccountId</Th>
              <Th>Account Name</Th> 
              <Th>Amount</Th> 
              <Th>Description</Th> 
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 && transactions
              .filter(tx => tx.Date?.includes(filter))
              .map(entry => (
                <TR key={entry.Id}>
                  <Td>{entry.Id}</Td>
                  <Td>{new Date(entry.Date).toISOString().split('T')[0]}</Td>
                  <Td>{entry.AccountCode}</Td> 
                  <Td>{entry.AccountId}</Td>
                  <Td>{entry.AccountName}</Td> 
                  <Td>{entry.Amount}</Td> 
                  <Td>{entry.Description}</Td>  
                </TR>
              ))}
          </tbody>
        </Table>
      </Section>
    </Container>
  );
};

export default BankTransactions;
