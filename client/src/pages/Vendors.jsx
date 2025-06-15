import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { PageContainer, ActionsButtonRow, Cell, Items, TableRow, TableHeader, TableWrapper  } from '../components/ui/GridComponents'; 
import { PageHeader } from '../components/ui/PageHeader';
import { SearchInput } from '../components/ui/SearchInput';
  
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

const ModalButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
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

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ContactEmail: '',
    phone: ''
  });
  const [error, setError] = useState(''); 
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await fetch('http://localhost:3010/api/vendors');
      const data = await res.json(); 
      setVendors(data.data || []);
    } catch (err) {
      setError('Failed to load vendors');
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); 

    try {
      const res = await fetch('http://localhost:3010/api/vendors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.message || 'Failed to create vendor');
      }
 
      setFormData({ Name: '', ContactEmail: '', Phone: '' });
      fetchVendors();
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (id) => {
    const updatedVendor = vendors.find(v => v.id === id) || [];
    setFormData({
      name: updatedVendor.Name,
      ContactEmail: updatedVendor.ContactEmail,
      phone: updatedVendor.Phone
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        const res = await fetch(`http://localhost:3010/api/vendors/${id}`, {
          method: 'DELETE'
        });

        const result = await res.json();
        if (res.ok) { 
          fetchVendors();
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('Failed to delete vendor');
      }
    }
  };

 

  const filteredVendors = vendors.filter(p => {
    if (!searchTerm.trim()) return true;
  
    if (/^\d+$/.test(searchTerm)) {
      const searchId = parseInt(searchTerm, 10);
      return (p.Id  === searchId) ? true : false;
    }
  
    if (p.Name?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return true;
    }

     if (p.ContactEmail?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return true;
    }

     if (p.Phone?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return true;
     }

    return false;
  });

  return (
    <PageContainer> 
      <PageHeader
        title="Vendors"
        error={error}
        buttonText="New Vendor"
        buttonColor="white" 
        buttonHoverBg="#98CAD4" 
        buttonWidth="137px"
        onButtonClick={() => setIsModalOpen(true)}  
      />

      <ModalOverlay visible={isModalOpen}>
        <ModalContent> 
          <Form onSubmit={handleSubmit}>
            <Label>
              Name:
              <Input type="text" name="Name" value={formData.Name} required
                onChange={handleChange}
              />
            </Label>
            <Label>
              Contact Email:
              <Input type="email" name="ContactEmail" value={formData.ContactEmail}
                onChange={handleChange}
              />
            </Label>
            <Label>
              Phone:
              <Input type="text" name="Phone" value={formData.Phone}
                onChange={handleChange}
              />
            </Label>
             <ModalButtonRow> 
                <RoundedButton fontWeight='600' hoverBackgroundColor="orange" color="black" width="80px" type="submit">Submit</RoundedButton>
                <RoundedButton fontWeight='600' hoverBackgroundColor="#98CAD4" color="black" width="80px" onClick={() => setIsModalOpen(false)}>Close</RoundedButton>
            </ModalButtonRow>   
            
            {error && <ErrorMsg>{error}</ErrorMsg>} 
          </Form>
        </ModalContent>
      </ModalOverlay> 

      <SearchInput
        type="text"
        placeholder="Search by Name, Email, or Phone"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      /> 

        <TableWrapper> 
        <TableHeader backgroundColor="#98CAD4">  
            <Cell>ID</Cell>
            <Cell>Name</Cell>
            <Cell>Email</Cell>
            <Cell>Phone</Cell>
            <Cell>Actions</Cell> 
        </TableHeader>
        <tbody>
          {filteredVendors.map(v => ( 
            <TableRow key={v.Id} backgroundColor="#b8f1fc;">
              <Cell>{v.Id}</Cell>
              <Cell>{v.Name}</Cell>
              <Cell>{v.ContactEmail}</Cell>
              <Cell>{v.Phone}</Cell>
              <Cell>
                <RoundedButton hoverBackgroundColor="orange" color="black"
                  onClick={() => handleUpdate(v.Id)}
                >
                  Edit
                </RoundedButton>
                <RoundedButton hoverBackgroundColor="red" color="black"
                  onClick={() => handleDelete(v.Id)}
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

export default Vendors;
