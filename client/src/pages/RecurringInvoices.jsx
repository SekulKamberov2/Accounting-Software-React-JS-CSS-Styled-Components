import { useEffect, useState } from 'react';
import styled from 'styled-components';
 import { SearchInput } from '../components/ui/SearchInput';
import { PageHeader } from '../components/ui/PageHeader'; 
import { PageContainer, ActionsButtonRow, Cell, Items, TableRow, TableHeader, TableWrapper  } from '../components/ui/GridComponents'; 


const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  min-width: 300px; 
  width: 100%;  
  box-sizing: border-box;
`; 

const RoundedButton = styled.button`
  padding: 5px 8px;
  background-color: ${({ backgroundColor }) => backgroundColor || 'transparent'};
  color: ${({ color }) => color || 'black'};
  border: 2px solid black;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem; 
  font-weight: ${({ fontWeight }) => fontWeight}; 
  margin-left: 3px;
  width: ${({ width }) => width || 'auto'};  
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: ${({ hoverBackgroundColor }) => hoverBackgroundColor || 'transparent'};
    border-color: black; 
  }
`;

const Title = styled.h2`  
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 20px;
`;

 
 
const NoResults = styled.div`
  margin-top: 20px;
  color: #999;
  text-align: center;
  width: 100%;
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
  max-width: 600px;
  padding: 25px;
  box-sizing: border-box;
  max-height: 90vh;
  overflow-y: auto;
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
const ModalButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`; 

 const ItemRow = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px 0;  
`;
 

const RecurringInvoices = () => { 
  const [invoices, setInvoices] = useState([]);
  const [filter, setFilter] = useState('');
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [updateInvoice, setUpdateInvoice] = useState(null);
  const [deleteInvoice, setDeleteInvoice] = useState(null);
  const [newInvoiceModal, setNewInvoiceModal] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    interval: '',
    startDate: '',
    items: [{ description: '', quantity: '', unitPrice: '' }]
  });
  const [error, setError] = useState(null);
 
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch('http://localhost:3010/api/recurring-invoices');
      if (!res.ok) throw new Error('Failed to fetch invoices');
      const data = await res.json();
      setInvoices(data);
      setFilteredInvoices(data); 
    } catch (err) {
      setError(err.message);
    }
  };
 
  useEffect(() => {
    const filtered = invoices.filter(inv => {
      if (!filter.trim()) return true;
 
      if (/^\d+$/.test(filter)) {
        const searchId = parseInt(filter, 10);
        return inv.id === searchId;
      }
 
      const searchTerm = filter.toLowerCase();
      return (
        inv.interval?.toLowerCase().includes(searchTerm) ||
        inv.startDate?.toLowerCase().includes(searchTerm)
      );
    });

    setFilteredInvoices(filtered);
  }, [filter, invoices]);
 
  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: '', unitPrice: '' }]
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const body = {
        customerId: Number(formData.customerId),
        interval: formData.interval,
        startDate: formData.startDate,
        items: formData.items.map(item => ({
          description: item.description,
          quantity: Number(item.quantity),
          unitPrice: parseFloat(item.unitPrice)
        })),
      };
      const res = await fetch('http://localhost:3010/api/recurring-invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) setError('Create failed');
      await fetchInvoices();
      setNewInvoiceModal(false);
      resetForm();
    } catch (err) {
        setError(err.message);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      const body = {
        id,
        customerId: Number(data.customerId),
        interval: data.interval,
        startDate: data.startDate,
        items: data.items.map(item => ({
          description: item.description,
          quantity: Number(item.quantity),
          unitPrice: parseFloat(item.unitPrice)
        })),
      };
      const res = await fetch(`http://localhost:3010/api/recurring-invoices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) setError('Update failed');
      await fetchInvoices();
      setUpdateInvoice(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3010/api/recurring-invoices/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');
      await fetchInvoices();
      setDeleteInvoice(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      customerId: '',
      interval: '',
      startDate: '',
      items: [{ description: '', quantity: '', unitPrice: '' }]
    });
    setError(null);
  };
 
  const renderModal = (invoice, isNew = false) => (
    <ModalBackdrop onClick={() => {
      if (isNew) {
        setNewInvoiceModal(false);
      } else {
        setUpdateInvoice(null);
      }
      resetForm();
    }}>
      <Modal onClick={e => e.stopPropagation()}>
        <form onSubmit={isNew ? handleCreate : (e) => {
          e.preventDefault();
          handleUpdate(invoice.id, formData);
        }}>
          <Title>{isNew ? 'New Recurring Invoice' : 'Update Recurring Invoice'}</Title> 
          <FormRow>
            <Label>Customer ID</Label>
            <Input type="number" value={formData.customerId}
              onChange={e => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
              required
            />
          </FormRow> 
          <FormRow>
            <Label>Interval (e.g. Monthly, Weekly)</Label>
            <Input value={formData.interval}
              onChange={e => setFormData(prev => ({ ...prev, interval: e.target.value }))}
              required
            />
          </FormRow> 
          <FormRow>
            <Label>Start Date</Label>
            <Input type="date" value={formData.startDate}
              onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              required
            />
          </FormRow> 
          <Title>Items</Title> 
          {formData.items.map((item, i) => (
            <div key={i} style={{ borderBottom: '1px solid #ddd', paddingBottom: 10, marginBottom: 10 }}>
              <FormRow>
                <Label>Description</Label>
                <Input value={item.description}  required
                  onChange={e => handleItemChange(i, 'description', e.target.value)} 
                />
              </FormRow>
              <FormRow>
                <Label>Quantity</Label>
                <Input type="number" min="0" value={item.quantity}  required
                  onChange={e => handleItemChange(i, 'quantity', e.target.value)} 
                />
              </FormRow>
              <FormRow>
                <Label>Unit Price</Label>
                <Input type="number" min="0" step="0.01" value={item.unitPrice}
                  onChange={e => handleItemChange(i, 'unitPrice', e.target.value)}  required 
                />
              </FormRow>
              <RoundedButton hoverBackgroundColor="red" color="black"
                onClick={() => handleRemoveItem(i)}
                style={{ marginTop: '6px' }}
              >
                Remove Item
              </RoundedButton>
            </div>
          ))} 
          <RoundedButton hoverBackgroundColor="orange" color="black" onClick={handleAddItem}>
            Add Item
          </RoundedButton> 
          <ModalButtonRow>
            <RoundedButton hoverBackgroundColor="#A4CCF5" color="black" onClick={() => {
              if (isNew) {
                setNewInvoiceModal(false);
              } else {
                setUpdateInvoice(null);
              }
              resetForm();
            }}>Cancel</RoundedButton>
            <RoundedButton hoverBackgroundColor="orange" color="black" type="submit">{isNew ? 'Create' : 'Update'}</RoundedButton>
          </ModalButtonRow> 
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </form>
      </Modal>
    </ModalBackdrop>
  );
 
  const renderDeleteModal = (invoice) => (
    <ModalBackdrop onClick={() => setDeleteInvoice(null)}>
      <Modal onClick={e => e.stopPropagation()}>
        <Title>Delete Recurring Invoice</Title>
        <p>Are you sure you want to delete invoice #{invoice.id}?</p>
        <ModalButtonRow>
          <RoundedButton hoverBackgroundColor="#A4CCF5" color="black" onClick={() => setDeleteInvoice(null)}>Cancel</RoundedButton>
          <RoundedButton hoverBackgroundColor="red" color="black" onClick={() => handleDelete(invoice.id)}>Delete</RoundedButton>
        </ModalButtonRow>
      </Modal>
    </ModalBackdrop>
  );

  return (
    <PageContainer> 
      <PageHeader
        title="Recurring Invoices"
        error={error}
        buttonText="New Invoice"
        buttonColor="white" 
        buttonHoverBg="#A4CCF5" 
        buttonWidth="210"
        onButtonClick={() => {
          resetForm();
          setNewInvoiceModal(true);
        }}  
      /> 

      <SearchInput
        type="text"
        placeholder="Search by invoice ID, customer ID or interval"
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <Container>
        {filteredInvoices.length === 0 && <NoResults>No recurring invoices found.</NoResults>}

        {filteredInvoices.length > 0 && (
          <TableWrapper>
            <TableHeader backgroundColor="#a4ccf5"> 
                <Cell width="10px">ID</Cell>
                <Cell>Customer ID</Cell>
                <Cell>Interval</Cell>
                <Cell>Start Date</Cell>
                <Cell>Items</Cell>
                <Cell>Actions</Cell> 
            </TableHeader>
            <tbody>
              {filteredInvoices.map(inv => (
                <TableRow key={inv.id} backgroundColor="#a4ccf5">
                  <Cell  >{inv.id}</Cell>
                  <Cell>{inv.customerId}</Cell>
                  <Cell>{inv.interval}</Cell>
                  <Cell> {inv.startDate && !isNaN(new Date(inv.startDate)) ? new Date(inv.startDate).toISOString().slice(0, 10) : 'Invalid date'}</Cell>
                  <Items>
                    {inv.items.map((item, i) => (
                      <ItemRow key={i}>
                        <strong>{item.description}</strong>
                        <span>Qty: {item.quantity}</span>
                        <span>Price: ${item.unitPrice.toFixed(2)}</span>
                      </ItemRow>
                    ))}
                  </Items>
                  <Cell>
                    <ActionsButtonRow> 
                      <RoundedButton hoverBackgroundColor="orange" color="black"
                        onClick={() => {
                          setUpdateInvoice(inv);
                          setFormData({
                            customerId: inv.customerId,
                            interval: inv.interval,
                            startDate: inv.startDate,
                            items: inv.items.map(it => ({
                              description: it.description,
                              quantity: it.quantity,
                              unitPrice: it.unitPrice
                            }))
                          });
                        }}
                      >
                        Update
                      </RoundedButton>
                      <RoundedButton hoverBackgroundColor="red" color="black"
                        onClick={() => setDeleteInvoice(inv)}
                        style={{ marginLeft: '5px' }}
                      >
                        Delete
                      </RoundedButton>
                    </ActionsButtonRow>
                  </Cell>
                </TableRow>
              ))}
            </tbody> 
          </TableWrapper>
        )}
      </Container>

      {newInvoiceModal && renderModal(null, true)}
      {updateInvoice && renderModal(updateInvoice, false)}
      {deleteInvoice && renderDeleteModal(deleteInvoice)}
    </PageContainer>
  );
};

export default RecurringInvoices;
