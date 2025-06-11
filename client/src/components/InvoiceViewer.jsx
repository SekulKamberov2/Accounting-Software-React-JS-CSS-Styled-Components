import React, { useState } from 'react';
import styled from 'styled-components';
 
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);           /* Darker overlay */
  backdrop-filter: blur(9px);               /* Blur behind */
  -webkit-backdrop-filter: blur(9px);       /* Safari support */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const RoundedButton = styled.button`
  padding: 5px 8px;
  background-color: transparent;
  color: black;
  border: 2px solid black;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  margin-left: 9px;
  width: ${({ width }) => width || 'auto'};  
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #d4edda;  
    border-color: black; 
  }
`;
 
const Modal = styled.div`
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  padding: 20px;
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
  }

  th {
    background-color: #f0f0f0;
  }
`;

const InvoiceHeader = styled.div`
  display: flex;
  flex-direction: row;         
  justify-content: center;     
  align-items: center;         
  gap: 20px; 
  padding-top: 10px;                
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

const Picture = styled.img`
  display: flex; 
  flex-direction: column;
  width: 150px;
  height: 150px;  
  border-radius: 100%;
  object-fit: cover; 
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center; 
`;

export function InvoiceViewer({ isOpen, onClose, invoices, loading, error }) {
  if (!isOpen) return null;

  return (
    <ModalBackdrop onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <h1>INVOICES</h1> 
        {loading && <p>Loading...</p>}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && invoices.length === 0 && <p>No invoices found.</p>} 
        {!loading && !error &&  
            [...invoices]
            .sort((a, b) => a.CustomerId !== b.CustomerId ? a.CustomerId - b.CustomerId : a.Id - b.Id)
            .map(inv => ( 
            <div key={inv.Id} style={{ marginBottom: '10px', marginTop: '60px', background: 'lightsteelblue' }}>
                <InvoiceHeader key={inv.Id}> 
                    <Picture src={inv.CustomerPicture} alt="User Avatar" />
                    <TextContent>
                        <span><strong>INVOICE ID:</strong> {inv.Id}</span> <br />
                        <span> <strong>CUSTOMER ID:</strong> {inv.CustomerId} | <strong>CUSTOMER NAME: </strong> {inv.CustomerName}</span>  <br />
                    
                        <span> <strong>DATE:</strong> {new Date(inv.Date).toLocaleDateString()}</span> <br />
                        <span> <strong>TAX RATE:</strong> {(inv.TaxRate * 100).toFixed(2)}%</span> <br />
                        <span> <strong>CREATED AT:</strong> {new Date(inv.CreatedAt).toLocaleString()}</span> <br />
                    </TextContent>
                
                </InvoiceHeader> 
                {inv.items.length > 0 ? 
                    <Table>
                        <thead>
                            <tr>
                            <th>DESCRIPTION</th>
                            <th>QUENTITY</th>
                            <th>UNIT PRICE</th>
                            <th>TOTAL</th>
                            </tr>
                        </thead>
                        <tbody> 
                            {inv.items?.map(item => (
                            <tr key={item.Id} style={{textAlign: 'center'}}>
                                <td>{item.Description}</td>
                                <td>{item.Quantity}</td>
                                <td>${item.UnitPrice.toFixed(2)}</td>
                                <td>${(item.Quantity * item.UnitPrice).toFixed(2)}</td>
                            </tr>
                            ))}
                        </tbody>
                    </Table>
                    :
                    <NOINVOICES>NO INFORMATION</NOINVOICES>
                }  
                    
            </div> 
        ))}

        <RoundedButton onClick={onClose}>Close</RoundedButton>
      </Modal>
    </ModalBackdrop>
  );
}