import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import UserLayout from './components/UserLayout'; 
import ProfilePage from './pages/ProfilePage'; 
import AllUsers from './pages/AllUsers'; 

import AllPayments from './pages/Payments/AllPayments.jsx';
import CreatePayment from './pages/Payments/CreatePayment.jsx';
import UpdatePayment from './pages/Payments/UpdatePayment.jsx';
import DeletePayment from './pages/Payments/DeletePayment.jsx';

import AllAccounts from './pages/Accounts/AllAccounts.jsx';
import CreateAccount from './pages/Accounts/CreateAccount.jsx';
import UpdateAccount from './pages/Accounts/UpdateAccount.jsx';
import DeleteAccount from './pages/Accounts/DeleteAccount.jsx';

import AllTaxes from './pages/Taxes/AllTaxes.jsx';
import CreateTax from './pages/Taxes/CreateTax.jsx';
import DeleteTax from './pages/Taxes/DeleteTax.jsx';
import UpdateTax from './pages/Taxes/UpdateTax.jsx';

import AllBankTransactions from './pages/BankTransactions/AllBankTransactions.jsx';
import CreateBankTransaction from './pages/BankTransactions/CreateBankTransaction.jsx';
import DeleteBankTransaction from './pages/BankTransactions/DeleteBankTransaction.jsx';
import UpdateBankTransaction from './pages/BankTransactions/UpdateBankTransaction.jsx';
 
import AllJournalEntries from './pages/JournalEntries/AllJournalEntries.jsx';
import CreateJournalEntry from './pages/JournalEntries/CreateJournalEntry.jsx';
import UpdateJournalEntry from './pages/JournalEntries/UpdateJournalEntry.jsx';
import DeleteJournalEntry from './pages/JournalEntries/DeleteJournalEntry.jsx';
  
import AllExpenses from './pages/Expenses/AllExpenses.jsx';
import CreateExpense from './pages/Expenses/CreateExpense.jsx';
import DeleteExpense from './pages/Expenses/DeleteExpense.jsx';
import ExpensesByDateRange from './pages/Expenses/ExpensesByDateRange.jsx';
import UpdateExpense from './pages/Expenses/DeleteExpense.jsx'; 
import ProfitLossReport from './pages/ProfitLoss/ProfitLossReport.jsx'; 
 
import AllRecurringInvoices from './pages/RecurringInvoices/AllRecurringInvoices.jsx';
import CreateRecurringInvoice from './pages/RecurringInvoices/CreateRecurringInvoice.jsx';
import DeleteRecurringInvoice from './pages/RecurringInvoices/DeleteRecurringInvoice.jsx'; 
import UpdateRecurringInvoice from './pages/RecurringInvoices/UpdateRecurringInvoice.jsx'; 
 
import AllVendors from './pages/Vendors/AllVendors.jsx';
import CreateVendor from './pages/Vendors/CreateVendor.jsx'; 
import UpdateVendor from './pages/Vendors/UpdateVendor.jsx'; 
import DeleteVendor from './pages/Vendors/DeleteVendor'; 

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
            
            <Route path="payments" element={<AllPayments />} />
            <Route path="payments/create" element={<CreatePayment />} />
            <Route path="payments/update/:id" element={<UpdatePayment />} />
            <Route path="payments/delete/:id" element={<DeletePayment />} />

            <Route path="accounts" element={<AllAccounts />} />
            <Route path="accounts/create" element={<CreateAccount />} />
            <Route path="accounts/update/:id" element={<UpdateAccount />} />
            <Route path="accounts/delete/:id" element={<DeleteAccount />} />

            <Route path="journal-entries" element={<AllJournalEntries />} />
            <Route path="journal-entries/create" element={<CreateJournalEntry />} />
            <Route path="journal-entries/update/:id" element={<UpdateJournalEntry />} />
            <Route path="journal-entries/delete/:id" element={<DeleteJournalEntry />} />

            <Route path="expenses" element={<AllExpenses />} />
            <Route path="expenses/create" element={<CreateExpense />} />
            <Route path="expenses/update/:id" element={<UpdateExpense />} />
            <Route path="expenses/delete/:id" element={<DeleteExpense />} />
            <Route path="expenses/date-range" element={<ExpensesByDateRange />} />

            <Route path="reports/profit-loss" element={<ProfitLossReport />} />

            <Route path="vendors" element={<AllVendors />} />
            <Route path="vendors/create" element={<CreateVendor />} />
            <Route path="vendors/update/:id" element={<UpdateVendor />} />
            <Route path="vendors/delete/:id" element={<DeleteVendor />} />

            <Route path="bank-transactions" element={<AllBankTransactions />} />
            <Route path="bank-transactions/create" element={<CreateBankTransaction />} />
            <Route path="bank-transactions/update/:id" element={<UpdateBankTransaction />} />
            <Route path="bank-transactions/delete/:id" element={<DeleteBankTransaction />} />

            <Route path="taxes" element={<AllTaxes />} />
            <Route path="taxes/create" element={<CreateTax />} />
            <Route path="taxes/update/:id" element={<UpdateTax />} />
            <Route path="taxes/delete/:id" element={<DeleteTax />} />

            <Route path="recurring-invoices" element={<AllRecurringInvoices />} />
            <Route path="recurring-invoices/create" element={<CreateRecurringInvoice />} />
            <Route path="recurring-invoices/update/:id" element={<UpdateRecurringInvoice />} />
            <Route path="recurring-invoices/delete/:id" element={<DeleteRecurringInvoice />} />

          </Route>

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
