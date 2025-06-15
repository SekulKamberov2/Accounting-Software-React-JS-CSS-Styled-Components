import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 30px;
  box-sizing: border-box; 
  width: 100%;
  max-width: 900px; 
  margin: 0 auto; 
  
  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 15px; 
  }
`; 

export const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%; 
`;

export const TableHeader = styled.div`
  display: flex;   
  background-color: ${({ backgroundColor }) => backgroundColor || 'white'};
  color: black;
  font-weight: bold;
  padding: 5px; 
  border-bottom: 2px solid #ddd; 
  min-width: 300px; 
  
  @media (max-width: 600px) {
    padding: 6px;
    gap: 8px;
  }
`;

export const TableRow = styled.div` 
  display: flex; 
  border-bottom: 1px solid #eee; 
  min-width: 300px;

  &:hover {
    background-color: ${({ backgroundColor }) => backgroundColor || 'white'}; 
  }
  
  @media (max-width: 600px) { 
    padding: 6px;
    gap: 8px;
  }
`;

export const Cell = styled.div` 
  display: flex;
  width: ${({ width }) => width || '100%'};
  align-items: center; 
  word-wrap: break-word; 
  padding: 3px;
  &:first-child { 
    width: 100%;
    min-width: 25px;  
  }

  &:last-child {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
`;

export const Items = styled.div` 
  display: flex;
  flex-direction: column;
  justify-content: flex-start; 
  width: 100%;     
  word-wrap: break-word; 
`;

export const ActionsButtonRow = styled.div`
  display: flex;   
  justify-content: center;
`;