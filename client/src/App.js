import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import UserLayout from './components/UserLayout'; 
import ProfilePage from './pages/ProfilePage'; 
import AllUsers from './pages/AllUsers'; 

import Payments from './pages/Payments/Payments.jsx'; 

import AllAccounts from './pages/Accounts/AllAccounts.jsx'; 

import Taxes from './pages/Taxes/Taxes.jsx'; 

import BankTransactions from './pages/BankTransactions/BankTransactions.jsx'; 
 
import JournalEntry from './pages/JournalEntries/JournalEntry.jsx'; 
  
import AllExpenses from './pages/Expenses/AllExpenses.jsx'; 
import ExpensesByDateRange from './pages/Expenses/ExpensesByDateRange.jsx'; 
import ProfitLossReport from './pages/ProfitLoss/ProfitLossReport.jsx'; 
 
import RecurringInvoices from './pages/RecurringInvoices/RecurringInvoices.jsx'; 
 
import AllVendors from './pages/Vendors/AllVendors.jsx'; 

import './App.css';

function App() {
  return (
    <Router>
      <Routes> 
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />

        <Route element={<UserLayout />}> 
          <Route path="/signup" element={<SignUp />} />
          <Route path="/users" element={<AllUsers />} />  

          {/* My Profile and Nested Routes */}
          <Route path="/profile" element={<ProfilePage />}> 
            
            <Route path="payments" element={<Payments />} /> 

            <Route path="accounts" element={<AllAccounts />} /> 

            <Route path="journal-entries" element={<JournalEntry />} /> 

            <Route path="expenses" element={<AllExpenses />} /> 
            <Route path="expenses/date-range" element={<ExpensesByDateRange />} />

            <Route path="reports/profit-loss" element={<ProfitLossReport />} />

            <Route path="vendors" element={<AllVendors />} /> 

            <Route path="bank-transactions" element={<BankTransactions />} /> 

            <Route path="taxes" element={<Taxes />} /> 

            <Route path="recurring-invoices" element={<RecurringInvoices />} /> 

          </Route>

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
