import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import UserLayout from './components/UserLayout'; 
import ProfilePage from './pages/ProfilePage'; 
import AllUsers from './pages/AllUsers';  
import Payments from './pages/Payments.jsx';  
import InvoicePage from './pages/InvoicePage.jsx';  
import Accounts from './pages/Accounts.jsx';  
import Taxes from './pages/Taxes.jsx';  
import BankTransactions from './pages/BankTransactions.jsx';  
import JournalEntry from './pages/JournalEntry.jsx';  
import Expenses from './pages/Expenses.jsx';  
import RecurringInvoices from './pages/RecurringInvoices.jsx';  
import Vendors from './pages/Vendors.jsx'; 
import ProtectedRoute from '../src/components/ProtectedRoute.jsx'
import './App.css';

function App() {
  return (
    <Router>
      <Routes> 
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />

        <Route path="/signup" element={<SignUp />} />
        <Route path="/unauthorized" element={<div style={{  display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',fontSize:"60px", color:"red"}}>Unauthorized Access</div>} />

        <Route element={<ProtectedRoute roles={['admin', 'user', 'accountant']} />}> 
            
                <Route element={<UserLayout />}>   
                        <Route path="/users" element={<AllUsers />} />    
                        <Route path="/profile" element={<ProfilePage />}>    
                            <Route path="invoices-page" element={<InvoicePage />} />  
                            <Route path="payments" element={<Payments />} />   
                            <Route path="accounts" element={<Accounts />} />  
                            <Route path="journal-entries" element={<JournalEntry />} />  
                            <Route path="expenses" element={<Expenses />} />  
                            <Route path="vendors" element={<Vendors />} />  
                            <Route path="bank-transactions" element={<BankTransactions />} />  
                            <Route path="taxes" element={<Taxes />} /> 
                            <Route path="invoices-page" element={<InvoicePage />} /> 
                            <Route path="recurring-invoices" element={<RecurringInvoices />} />  
                        </Route> 
              </Route>

        </Route> 


      </Routes> 
    </Router>
  );
}

export default App;
