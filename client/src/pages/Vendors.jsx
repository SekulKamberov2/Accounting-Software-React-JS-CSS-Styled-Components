import { useState, useEffect } from 'react';
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.17rem 0.17rem 0.17rem 0.75rem;
  background-color: #f5f5f5;
  border-bottom: 2px solid #ddd;
  background-color: #98CAD4;
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
    background-color: #d2f1f7;
  }
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
  const [success, setSuccess] = useState('');
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
    setSuccess('');

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

      setSuccess('Vendor created successfully');
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
          setSuccess(result.message);
          fetchVendors();
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('Failed to delete vendor');
      }
    }
  };

  const filteredVendors = vendors.filter(v =>
    v.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.ContactEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.Phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <TitleRow>
        <Title>Vendors</Title>
        <RoundedButton width="137px" fontWeight="600" hoverBackgroundColor="#98CAD4"
          onClick={() => setIsModalOpen(true)}
        >
          New Vendor
        </RoundedButton>
      </TitleRow>

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
            {success && <SuccessMsg>{success}</SuccessMsg>}
          </Form>
        </ModalContent>
      </ModalOverlay>

      <Label>
        <Input type="text" placeholder="Search by Name, Email, or Phone" value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </Label>
      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {filteredVendors.map(v => (
            <TR key={v.Id}>
              <Td>{v.Id}</Td>
              <Td>{v.Name}</Td>
              <Td>{v.ContactEmail}</Td>
              <Td>{v.Phone}</Td>
              <Td>
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
              </Td>
            </TR>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Vendors;
