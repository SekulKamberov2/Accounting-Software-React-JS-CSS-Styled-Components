import  { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SearchInput } from '../components/ui/SearchInput';
import { PageHeader } from '../components/ui/PageHeader';
import { PageContainer, ActionsButtonRow, Cell, Items, TableRow, TableHeader, TableWrapper  } from '../components/ui/GridComponents'; 

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

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  margin-bottom: 20px;
`;

const SearchInput2 = styled.input`
  padding: 10px;
  width: 88%;
  margin-bottom: 20px;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const Table = styled.table`
  width: 90%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding-left: 9px;
  background-color: #C09BC2;
  height: 10px;
  border-bottom: 2px solid #ddd;
  color: block;
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
  background: rgba(0, 0, 0, 0.3);
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
 
const ActionsButtonRow2 = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const TR = styled.tr`
  &:hover {
    background-color: #C09BC2;  
  }
`;

const JournalEntry = () => {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [updateEntry, setUpdateEntry] = useState(null);
  const [deleteEntry, setDeleteEntry] = useState(null);
  const [newEntryModal, setNewEntryModal] = useState(false);
  const [formData, setFormData] = useState({ date: '', description: '', lines: [] });
  const [success, setSuccess] = useState(false);
 

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch('http://localhost:3010/api/journal-entries');
        if (!response.ok) setError('Failed to fetch entries');
        const data = await response.json();
        setEntries(data);
        setFilteredEntries(data);
        setError('');
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEntries();
  }, []);

  const handleUpdate = async (id, data) => {
    try {
      const response = await fetch(`http://localhost:3010/api/journal-entries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) setError('Update failed');
      setSuccess(true);
      await refreshData();
      setUpdateEntry(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3010/api/journal-entries/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) setError('Delete failed');
      setSuccess(true);
      await refreshData();
      setDeleteEntry(null);
    } catch (err) {
      setError(err.message);
    }
  };

const handleCreate = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:3010/api/journal-entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: formData.date,
        description: formData.description,
        entries: formData.entries.map(entry => ({
          account_id: Number(entry.account_id),
          debit: Number(entry.debit) || 0,
          credit: Number(entry.credit) || 0
        }))
      }),
    });

    if (!response.ok) setError('Create failed');

    setSuccess(true);
    await refreshData();
    setNewEntryModal(false);
    setFormData({ date: '', description: '', entries: [] });
  } catch (err) {
    setError(err.message);
  }
};


  const refreshData = async () => {
    try {
      const response = await fetch('http://localhost:3010/api/journal-entries');
      if (!response.ok) setError('Failed to fetch entries');
      const data = await response.json();
      setEntries(data);
      setFilteredEntries(data);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

    const renderModal = (entry, isNew = false) => (
      <ModalBackdrop onClick={() => {
        if (isNew) setNewEntryModal(false);
        else setUpdateEntry(null);
      }}>
        <Modal onClick={e => e.stopPropagation()}>
          <form onSubmit={isNew ? handleCreate : (e) => {
            e.preventDefault();
            handleUpdate(entry.id, formData);
          }}>
            <Title>{isNew ? 'New Entry' : 'Update Entry'}</Title> 
            <FormRow>
              <Label>Date</Label>
              <Input name="date" type="date" value={formData.date} required
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}  
              />
            </FormRow> 
            <FormRow>
              <Label>Description</Label>
              <Input name="description" value={formData.description} required
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} 
              />
            </FormRow>

            <FormRow>
              <Label>Entries</Label>
              {formData.entries.length > 0 && formData.entries.map((line, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <Input placeholder="Account ID" type="number" value={line.account_id}
                    onChange={e => {
                      const updated = [...formData.entries];
                      updated[index].account_id = Number(e.target.value);
                      setFormData(prev => ({ ...prev, entries: updated }));
                    }}
                  />
                  <Input placeholder="Debit" type="number" value={line.debit}
                    onChange={e => {
                      const updated = [...formData.entries];
                      updated[index].debit = Number(e.target.value);
                      setFormData(prev => ({ ...prev, entries: updated }));
                    }}
                  />
                  <Input placeholder="Credit" type="number" value={line.credit}
                    onChange={e => {
                      const updated = [...formData.entries];
                      updated[index].credit = Number(e.target.value);
                      setFormData(prev => ({ ...prev, entries: updated }));
                    }}
                  />
                </div>
              ))}
              <RoundedButton hoverBackgroundColor="#C09BC2"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    entries: [...(prev.entries || []), { account_id: '', debit: '', credit: '' }]
                  }));
                }}
              >
                + Add Entry
              </RoundedButton>
            </FormRow>

            <ModalButtonRow>
              <RoundedButton width="81px" fontWeight="600" hoverBackgroundColor="orange" type="submit">
                Save
              </RoundedButton>
              <RoundedButton width="81px" fontWeight="600" hoverBackgroundColor="#C09BC2"
                onClick={() => isNew ? setNewEntryModal(false) : setUpdateEntry(null)} 
              >
                Cancel
              </RoundedButton>
            </ModalButtonRow>
          </form>
        </Modal>
      </ModalBackdrop>
    );
 
  const renderDeleteModal = (entry) => (
    <ModalBackdrop onClick={() => setDeleteEntry(null)}>
      <Modal onClick={e => e.stopPropagation()}>
        <h3>Delete Entry ID {entry.id}</h3>
        <p>Are you sure you want to delete <b>{entry.date ? new Date(entry.date).toISOString().slice(0, 10) : 'Invalid date'}</b> ?</p>
        <ModalButtonRow>
          <RoundedButton width="81px" fontWeight="600" hoverBackgroundColor="red" onClick={() => handleDelete(entry.id)}>
            Delete
          </RoundedButton>
          <RoundedButton width="81px" fontWeight="600" hoverBackgroundColor="#53B87D" onClick={() => setDeleteEntry(null)}>
            Cancel
          </RoundedButton>
        </ModalButtonRow>
      </Modal>
    </ModalBackdrop>
  ); 
  return ( 
      <PageContainer> 
        <PageHeader
          title="All Journal Entries"
          error={error}
          buttonText="New Entry"
          buttonColor="white" 
          buttonHoverBg="#C09BC2" 
          buttonWidth="107px"
          onButtonClick={() => {
            setFormData({ date: '', description: '', entries: [] });
            setNewEntryModal(true);
            setError('');
            setSuccess(false);
          }}  
        />   
        <SearchInput
          type="text"
          placeholder="Search by date (YYYY-MM-DD)..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}  
         {filteredEntries.length === 0 ? 
         <NoResults>No matching entries found.</NoResults>
         : 
          <TableWrapper>
            <TableHeader backgroundColor="#C09BC2">
                <Cell>ID</Cell>
                <Cell>Date</Cell>
                <Cell>Description</Cell>
                <Cell style={{ textAlign: 'center' }}>Lines</Cell>
                <Cell style={{ textAlign: 'center' }}>Actions</Cell> 
            </TableHeader>
            <tbody>
              {entries
                .filter(entry => entry.date.includes(filter))
                .map(entry => (
                  <TableRow key={entry.id} backgroundColor="#dbbedd"> 
                    <Cell>{entry.id}</Cell>
                    <Cell>{new Date(entry.date).toISOString().split('T')[0]}</Cell>
                    <Cell>{entry.description}</Cell>
                    <Cell>
                      <ul>
                        {entry.lines?.map((line, index) => (
                          <li key={index}> {line.accountName}: Debit {line.debit}, Credit {line.credit} </li>
                        ))}
                      </ul>
                    </Cell>
                    <Cell>
                      <ActionsButtonRow>
                        <RoundedButton width="75px" hoverBackgroundColor="orange"
                          onClick={() => {
                            setFormData({
                              date: entry.date,
                              description: entry.description,
                              entries: entry.lines?.map(line => ({
                                account_id: line.accountId || '',  
                                debit: line.debit || '',
                                credit: line.credit || ''
                              })) || []  
                            });
                            setUpdateEntry(entry);
                            setError('');
                            setSuccess(false);
                          }}
                        >
                          Update
                        </RoundedButton>
                        <RoundedButton width="75px" hoverBackgroundColor="#E74C3C"
                          onClick={() => {
                            setDeleteEntry(entry);
                            setError('');
                            setSuccess(false);
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
        }

        {updateEntry && renderModal(updateEntry)}
        {deleteEntry && renderDeleteModal(deleteEntry)}
        {newEntryModal && renderModal({}, true)}
      </PageContainer>

      
  );
};

export default JournalEntry; 
