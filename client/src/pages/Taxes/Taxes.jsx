import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  min-width: 300px;
  width: 80%;
  margin: 40px auto;
  padding: 20px;
  box-sizing: border-box;
`;

const ErrorMessage = styled.div`
display: flex;
  justify-content: center;
  color: red;
  margin-top: 10px;
`;

const SuccessMessage = styled.div`
display: flex;
  justify-content: center;
  color: green;
  margin-top: 10px;
  font-weight: bold;
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

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  padding: 10px;
  width: 78%;
  margin-bottom: 20px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Table = styled.table`
  width: 80%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding-left: 9px;
  background-color: #888DBF;
  height: 10px;
  border-bottom: 2px solid #ddd;
  color: black;  
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #eee;
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

const ActionsButtonRow = styled.div`
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
  const [success, setSuccess] = useState(false);

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
      setSuccess(true);
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
      setSuccess(true);
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
      setSuccess(true);
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
    <>
    <Container>
      <TitleRow>
        <Title>All Taxes</Title>
        <RoundedButton width="101px" fontWeight="600" hoverBackgroundColor="#888DBF"
          onClick={() => {
            setFormData({ name: '', rate: '' });
            setNewTaxModal(true);
            setError("");
            setSuccess(false);
          }}
        >
          New Tax
        </RoundedButton>
      </TitleRow>

      <SearchInput type="text" placeholder="Search by name or rate..."
        value={filter} onChange={e => setFilter(e.target.value)}
      />

      {filteredTaxes.length === 0 ? (
        <NoResults>No matching taxes found.</NoResults>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Rate (%)</Th>
              <Th style={{textAlign: 'center'}}>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filteredTaxes.map(tax => (
              <tr key={tax.Id}>
                <Td>{tax.Id}</Td>
                <Td>{tax.Name}</Td>
                <Td>{tax.Rate}</Td>
                <Td>
                  <ActionsButtonRow>
                    <RoundedButton width="75px" hoverBackgroundColor="orange"
                      onClick={() => {
                        setFormData({ name: tax.Name, rate: tax.Rate });
                        setUpdateTaxItem(tax);
                        setError("");
                        setSuccess(false);
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
                        setSuccess(false);
                      }}
                    >
                      Delete
                    </RoundedButton>
                  </ActionsButtonRow>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
        
      )}

      {updateTaxItem && renderModal(updateTaxItem)}
      {deleteTaxItem && renderDeleteModal(deleteTaxItem)}
      {newTaxModal && renderModal({}, true)} 
 
    </Container> 
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>Successful</SuccessMessage>}
    </>
  );
};

export default Taxes;
