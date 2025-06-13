import { useState, useEffect } from 'react';
import styled from 'styled-components';

 

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

const ProfileHeader = styled.div`
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 20px;
   
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

const FormRow = styled.div`
  margin-bottom: 15px; 
`;

const Input = styled.input`
  padding: 8px;
  margin-bottom: 10px;
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
  
const Title = styled.div` 
  color: black;    
  font-size: 21px;
  font-weight: 700; 
`; 

const TitleWrapper = styled.div` 
  display: flex;
  justify-content: space-between;
  color: black;    
  font-size: 21px;
  font-weight: 700;
  margin-top: 25px;
  height: 50px
  padding: 10px;
`; 

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 67%;
  margin-bottom: 20px;
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(9px);
  -webkit-backdrop-filter: blur(9px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  padding: 20px 40px;
  max-height: 80vh;
  overflow-y: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;

  th, td {
    padding: 8px 12px;
    border: 1px solid #ccc;
    text-align: center;
  }

  th {
    background-color: #f0f0f0;
  }
`;
 

const NOINVOICES = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 21px;
  color: black;
  font-weight: 700;
  padding: 15px;
  margin-top: -20px;
`;

const DeleteButton = styled.button`
  padding: 5px 8px;
  background-color: transparent;
  color: black;
  border: 2px solid red;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 550;
  margin-left: 9px;
  width: ${({ width }) => width || 'auto'};
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: red;
    border-color: black;
    color: white;
  }
`;

const UpdateButton = styled.button`
  padding: 5px 8px;
  background-color: transparent;
  color: black;
  border: 2px solid orange;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 550;
  margin-left: 9px;
  width: ${({ width }) => width || 'auto'};
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: orange;
    border-color: black;
    color: white;
  }
`;

const SearchInput = styled.input`
  padding: 10px;
  width: 65%;
  margin-bottom: 20px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  min-width: 600px;
  width: 70%;
  margin: 40px auto;
  padding: 20px;
  box-sizing: border-box;
`;

const NoResults = styled.div`
  margin-top: 20px;
  color: #999;
  text-align: center;
  width: 100%;
`;

const InvoiceHeader = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  align-items: center;
  
`;

const Picture = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
  justify-content: flex-end;
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column; 
`;

const ErrorMessage = styled.div`
display: flex;
  justify-content: center;
  color: red;
  margin-top: 10px;
`;

 

function InvoicePage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);  
  const [filter, setFilter] = useState('');
  const [filteredInvoices, setFilteredInvoices] = useState([]); 
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); 
  const [isUpdating, setIsUpdating] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    CustomerId: '',
    Date: '',
    TaxRate: '',
    items: [{ Description: '', Quantity: 1, UnitPrice: 0 }],
  });
  
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
 
  useEffect(() => {
    fetchInvoices();
  }, []);
 
  useEffect(() => {
    const filtered = invoices.filter(inv => {
      if (!filter.trim()) return true;
      
      const searchTerm = filter.toLowerCase();
      const numericSearch = !isNaN(filter);
       
      if (numericSearch) {
        return (
          String(inv.Id).includes(filter) ||
          String(inv.CustomerId).includes(filter)
        );
      }
       
      return (
        (inv.CustomerName && inv.CustomerName.toLowerCase().includes(searchTerm)) ||
        (inv.Date && inv.Date.toLowerCase().includes(searchTerm)) ||
        (inv.items && inv.items.some(item => 
          item.Description && item.Description.toLowerCase().includes(searchTerm)
        ))
      );
    });
    
    setFilteredInvoices(filtered);
  }, [filter, invoices]);

  async function fetchInvoices() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3010/api/invoices');
      if (!res.ok) setError('Failed to fetch invoices');
  
      const data = await res.json(); 
      setInvoices(data);
      setFilteredInvoices(data);
    } catch (err) {
      setError(err.message); 
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setIsUpdating(false);
    setNewInvoice({
      CustomerId: '',
      Date: '',
      TaxRate: '',
      items: [{ Description: '', Quantity: 1, UnitPrice: 0 }],
    });
    setCreateModalOpen(true);
  }

  function openUpdateModal(invoice) {
    setIsUpdating(true);
    setNewInvoice({
      CustomerId: invoice.CustomerId,
      Date: invoice.Date.substring(0, invoice.Date.indexOf('T')),
      TaxRate: invoice.TaxRate,
      items: invoice.items && invoice.items.length ? invoice.items : [{ Description: '', Quantity: 1, UnitPrice: 0 }],
      Id: invoice.Id, 
    }); 
    setCreateModalOpen(true);
  }

  function handleInvoiceChange(e) {
    const { name, value } = e.target;
    setNewInvoice((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleItemChange(index, e) {
    const { name, value } = e.target;
    setNewInvoice((prev) => {
      const items = [...prev.items];
      items[index] = {
        ...items[index],
        [name]: name === 'Description' ? value : Number(value),
      };
      return { ...prev, items };
    });
  }

  function addItem() {
    setNewInvoice((prev) => ({
      ...prev,
      items: [...prev.items, { Description: '', Quantity: 1, UnitPrice: 0 }],
    }));
  }

  function removeItem(index) {
    setNewInvoice((prev) => {
      const items = prev.items.filter((_, i) => i !== index);
      return { ...prev, items };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const method = isUpdating ? 'PUT' : 'POST';
      const url = isUpdating ? `http://localhost:3010/api/invoices/${newInvoice.Id}` : 'http://localhost:3010/api/invoices';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInvoice),
      });

      if (!res.ok) { 
        return;
      } 
      fetchInvoices();
      setCreateModalOpen(false);
    } catch (err) {
      setError('Error saving invoice');
    }
  }

  function openDeleteModal(id) {
    setSelectedInvoiceId(id);
    setDeleteModalOpen(true);
  }

  async function handleDelete() {
    try {
      const res = await fetch(`http://localhost:3010/api/invoices/${selectedInvoiceId}`, { method: 'DELETE' });
      if (!res.ok) {
        alert('Failed to delete invoice');
        return;
      } 
      fetchInvoices();
      setDeleteModalOpen(false);
    } catch (err) {
      setError('Error deleting invoice');
    }
  }

  return (
    <PageContainer>   
      <TitleRow>
        <ProfileHeader>Invoices</ProfileHeader>

        {error && <ErrorMessage>{error}</ErrorMessage>}  

        <RoundedButton hoverBackgroundColor="#A4CCF5" color="black" fontWeight="bold" width="143px"
          onClick={openCreateModal} 
        >
          Create Invoice
        </RoundedButton>
      </TitleRow>

      <SearchInput type="text" value={filter}
        placeholder="Search by ID, customer, date, or item description"  
        onChange={(e) => setFilter(e.target.value)}
      />

      {loading && <div>Loading invoices...</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      {!loading && !error && filteredInvoices.length === 0 && (
        <NoResults>No invoices found matching your search.</NoResults>
      )}

      {!loading && !error && filteredInvoices.length > 0 && (
        <Container>
          {[...filteredInvoices]
            .sort((a, b) =>
              a.CustomerId !== b.CustomerId ? a.CustomerId - b.CustomerId : a.Id - b.Id
            )
            .map(inv => (
              <div key={inv.Id} style={{ 
                marginBottom: '20px', 
                marginTop: '10px', 
                background: 'lightsteelblue',
                padding: '15px',
                borderRadius: '8px',
                width: '100%'
              }}>
                <InvoiceHeader>
                  {inv.CustomerPicture && (
                    <Picture src={inv.CustomerPicture} alt="Customer" />
                  )}
                  <TextContent>
                    <span><strong>INVOICE ID:</strong> {inv.Id}</span> <br />
                    <span><strong>CUSTOMER ID:</strong> {inv.CustomerId} | <strong>CUSTOMER NAME:</strong> {inv.CustomerName}</span> <br />
                    <span><strong>DATE:</strong> {new Date(inv.Date).toLocaleDateString()}</span> <br />
                    <span><strong>TAX RATE:</strong> {(inv.TaxRate * 100).toFixed(2)}%</span> <br />
                    {inv.CreatedAt && (
                      <span><strong>CREATED AT:</strong> {new Date(inv.CreatedAt).toLocaleString()}</span>
                    )}
                  </TextContent>
                </InvoiceHeader>

                {inv.items && inv.items.length > 0 ? (
                  <Table>
                    <thead>
                      <tr>
                        <th>DESCRIPTION</th>
                        <th>QUANTITY</th>
                        <th>UNIT PRICE</th>
                        <th>TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inv.items.map(item => (
                        <tr key={item.Id || item.Description}>
                          <td>{item.Description || item.Description}</td>
                          <td>{item.Quantity || item.Quantity}</td>
                          <td>${(item.UnitPrice || item.UnitPrice).toFixed(2)}</td>
                          <td>${((item.Quantity || item.Quantity) * (item.UnitPrice || item.UnitPrice)).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <NOINVOICES>NO ITEMS IN THIS INVOICE</NOINVOICES>
                )}

                <ButtonWrapper>
                  <DeleteButton onClick={() => openDeleteModal(inv.Id)}>Delete</DeleteButton>
                  <UpdateButton onClick={() => openUpdateModal(inv)}>Update</UpdateButton>
                </ButtonWrapper>
              </div>
            ))}
        </Container>
      )}
 
      {createModalOpen && (
        <ModalBackdrop>
          <Modal>  
            <TitleWrapper> 
              <Title>{isUpdating ? 'Update Invoice' : 'Create Invoice'}</Title>
              <RoundedButton hoverBackgroundColor="#A4CCF5" color="black" height='30' fontWeight="bold" width="95px" 
                onClick={() => setCreateModalOpen(false)}
              >
                Close
              </RoundedButton>
            </TitleWrapper> 
            <form onSubmit={handleSubmit}>
              <FormRow>
                <Label htmlFor="CustomerId">Customer ID</Label>
                <Input id="CustomerId" name="CustomerId" value={newInvoice.CustomerId} required
                  onChange={handleInvoiceChange} 
                />
              </FormRow>

              <FormRow>
                <Label htmlFor="Date">Date</Label>
                <Input type="date" id="Date" name="Date" value={newInvoice.Date} required
                  onChange={handleInvoiceChange} 
                />
              </FormRow>

              <FormRow>
                <Label htmlFor="TaxRate">Tax Rate (%)</Label>
                <Input type="number" id="TaxRate" name="TaxRate" value={newInvoice.TaxRate} min="0" step="0.01" required
                  onChange={handleInvoiceChange} 
                />
              </FormRow>

              <Title>Items</Title>

              {newInvoice.items.map((item, index) => (
                <FormRow key={index}>
                  <Label>Description</Label>
                  <Input type="text" name="Description" value={item.Description} required
                    onChange={(e) => handleItemChange(index, e)} 
                  />
                  <Label>Quantity</Label>
                  <Input type="number" name="Quantity" value={item.Quantity} min="1" required
                    onChange={(e) => handleItemChange(index, e)} 
                  />
                  <Label>Unit Price</Label>
                  <Input type="number" name="UnitPrice" value={item.UnitPrice} 
                    onChange={(e) => handleItemChange(index, e)} 
                  /> 
                  {newInvoice.items.length > 1 && (
                    <ButtonRow style={{ marginTop: '10px' }}> 
                    <RoundedButton hoverBackgroundColor="red" color="black" fontWeight="bold" width="132px" 
                      onClick={() => removeItem(index)}
                    >
                      Remove Item
                    </RoundedButton>
                    </ButtonRow> 
                  )}
                </FormRow>
              ))}
              <ButtonRow style={{ marginTop: '20px' }}> 
                <RoundedButton hoverBackgroundColor="orange" color="black" fontWeight="bold" width="95px" 
                  onClick={addItem}
                >
                  Add Item
                </RoundedButton> 
                <RoundedButton hoverBackgroundColor="orange" color="black" fontWeight="bold" width="81px" type="submit" >
                  {isUpdating ? 'Update' : 'Submit'}
                </RoundedButton>
                <RoundedButton hoverBackgroundColor="#A4CCF5" color="black" fontWeight="bold" width="95px" 
                  onClick={() => setCreateModalOpen(false)}
                >
                  Close
                </RoundedButton>
              </ButtonRow>
            </form>
          </Modal>
        </ModalBackdrop>
      )}
 
      {deleteModalOpen && (
        <ModalBackdrop>
          <Modal> 
            <Title>Confirm Deletion</Title>
            <div>Are you sure you want to delete invoice ID: {selectedInvoiceId}?</div>
            <ButtonRow style={{ marginTop: '20px' }}>
              <RoundedButton hoverBackgroundColor="red" color="black" fontWeight="bold" width="81px"
                onClick={handleDelete}
              >
                Delete
              </RoundedButton>
              <RoundedButton hoverBackgroundColor="#A4CCF5" color="black" fontWeight="bold" width="95px" 
                onClick={() => setDeleteModalOpen(false)}
              >
                Close
              </RoundedButton>
            </ButtonRow>
          </Modal>
        </ModalBackdrop>
      )}
    </PageContainer>
  );
}

export default InvoicePage;