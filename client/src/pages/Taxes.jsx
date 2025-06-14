import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { PageContainer, ActionsButtonRow, Cell, Items, TableRow, TableHeader, TableWrapper  } from '../components/ui/GridComponents'; 
import { PageHeader } from '../components/ui/PageHeader';
import { SearchInput } from '../components/ui/SearchInput';
 

const ErrorMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: red;
  margin-top: 10px;  
  width: 100%;
  height: 60px;
  padding: 10px;
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

const ModalButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const ModalButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  color: white;
  background-color: ${({ variant }) =>
    variant === 'cancel' ? '#777' :
    variant === 'delete' ? '#E74C3C' :
    '#27AE60'};

  &:hover {
    opacity: 0.85;
  }
`;

const ActionsButtonRow2 = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px; 
`;

const Taxes = () => {
  const [taxes, setTaxes] = useState([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState('');
  const [filteredTaxes, setFilteredTaxes] = useState([]);
  const [updateTaxItem, setUpdateTaxItem] = useState(null);
  const [deleteTaxItem, setDeleteTaxItem] = useState(null);
  const [newTaxModal, setNewTaxModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', rate: '' }); 

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('http://localhost:3010/api/taxes');
        if (!response.ok) throw new Error('Failed to fetch taxes');
        const data = await response.json();
        console.log(data);
        setTaxes(data.data);

        const filtered = data.data.filter(tax =>
          tax.Name.toLowerCase().includes(filter.toLowerCase()) ||
          tax.Rate.toString().includes(filter)
        );

        setFilteredTaxes(filtered);
        setError("");
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [filter]);

  const handleUpdate = async (id, data) => {
    try {
      const response = await fetch(`http://localhost:3010/api/taxes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Update failed');
     
      await refreshData();
      setUpdateTaxItem(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3010/api/taxes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Delete failed');
      
      await refreshData();
      setDeleteTaxItem(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3010/api/taxes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Create failed');
      
      await refreshData();
      setNewTaxModal(false);
      setFormData({ name: '', rate: '' });
    } catch (err) {
      setError(err.message);
    }
  };
 
  const refreshData = async () => {
    try {
      const response = await fetch('http://localhost:3010/api/taxes');
      if (!response.ok) throw new Error('Failed to fetch taxes');
      const data = await response.json();
      setTaxes(data.data);

      const filtered = data.data.filter(tax =>
        tax.Name.toLowerCase().includes(filter.toLowerCase()) ||
        tax.Rate.toString().includes(filter)
      );

      setFilteredTaxes(filtered);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const renderModal = (tax, isNew = false) => (
    <ModalBackdrop onClick={() => {
      if (isNew) setNewTaxModal(false);
      else setUpdateTaxItem(null);
    }}>
      <Modal onClick={e => e.stopPropagation()}>
        <form onSubmit={isNew ? handleCreate : (e) => {
          e.preventDefault();
          handleUpdate(tax.Id, formData);
        }}>
          <Title>{isNew ? 'New Tax' : 'Update Tax'}</Title>
          <FormRow>
            <Label>Name</Label>
            <Input name="name" value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </FormRow>
          <FormRow>
            <Label>Rate (%)</Label>
            <Input type="number" step="0.01" min="0" name="rate" value={formData.rate}
              onChange={e => setFormData(prev => ({ ...prev, rate: e.target.value }))}
              required
            />
          </FormRow>
          <ModalButtonRow> 
            <RoundedButton width="81px" fontWeight="600" hoverBackgroundColor="orange" type="submit">
              Save
            </RoundedButton>
            <RoundedButton width="81px" fontWeight="600" hoverBackgroundColor="#888DBF" 
              onClick={() => isNew ? setNewTaxModal(false) : setUpdateTaxItem(null)}
              type="button"
            >
              Cancel
            </RoundedButton> 
          </ModalButtonRow>
        </form>
      </Modal>
    </ModalBackdrop>
  );

  const renderDeleteModal = (tax) => (
    <ModalBackdrop onClick={() => setDeleteTaxItem(null)}>
      <Modal onClick={e => e.stopPropagation()}>
        <h3>Delete Tax ID {tax.Id}</h3>
        <p>Are you sure you want to delete <b>{tax.Name}</b>?</p>  
        <ModalButtonRow>  
          <RoundedButton width="81px" fontWeight="600" hoverBackgroundColor="red" onClick={() => handleDelete(tax.Id)}>
            Delete
          </RoundedButton>
          <RoundedButton width="81px" fontWeight="600" hoverBackgroundColor="#888DBF" onClick={() => setDeleteTaxItem(null)}>
            Cancel
          </RoundedButton> 
        </ModalButtonRow> 
      </Modal>
    </ModalBackdrop>
  );

  return ( 
    <PageContainer> 
      <PageHeader
        title="All Taxes"
        error={error}
        buttonText="New Tax"
        buttonColor="white" 
        buttonHoverBg="#888DBF" 
        buttonWidth="101px"
        onButtonClick={() => {
          setFormData({ name: '', rate: '' });
          setNewTaxModal(true);
          setError(""); 
        }}  
      />   
      <SearchInput
        type="text"
        placeholder="Search by name or rate..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
      /> 

      {error && <ErrorMessage>{error}</ErrorMessage>} 

      {filteredTaxes.length === 0 ? (
        <NoResults>No matching taxes found.</NoResults>
      ) : (
        <TableWrapper>
          <TableHeader backgroundColor="#888DBF"> 
              <Cell>ID</Cell>
              <Cell>Name</Cell>
              <Cell>Rate (%)</Cell>
              <Cell>Actions</Cell> 
          </TableHeader>
          <tbody>
            {filteredTaxes.map(tax => (
              <TableRow key={tax.Id} backgroundColor="#ced3ff;">
                <Cell>{tax.Id}</Cell>
                <Cell>{tax.Name}</Cell>
                <Cell>{tax.Rate}</Cell>
                <Cell>
                  <ActionsButtonRow>
                    <RoundedButton width="75px" hoverBackgroundColor="orange"
                      onClick={() => {
                        setFormData({ name: tax.Name, rate: tax.Rate });
                        setUpdateTaxItem(tax);
                        setError(""); 
                      }}
                    >
                      Update
                    </RoundedButton>
                    <RoundedButton
                      width="75px"
                      hoverBackgroundColor="#E74C3C"
                      onClick={() => {
                        setDeleteTaxItem(tax);
                        setError(""); 
                      }}
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

      {updateTaxItem && renderModal(updateTaxItem)}
      {deleteTaxItem && renderDeleteModal(deleteTaxItem)}
      {newTaxModal && renderModal({}, true)} 
 
    </PageContainer>   
  );
};

export default Taxes;
