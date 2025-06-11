import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import UserLayout from './components/UserLayout'; 
import ProfilePage from './pages/ProfilePage'; 
import AllUsers from './pages/AllUsers'; 

import './App.css';

function App() {
  return (
    <Router>
      <Routes> 
        <Route path="/" element={<SignIn />} />
        <Route path="/SignIn" element={<SignIn />} />

        <Route element={<UserLayout />}> 
          <Route
              path="/signup" element={
                
                  <SignUp />
                 
              }
            />
                <Route path="/users" element={
          
                  <AllUsers />
                
                }
            />  
            <Route path="/profile" element={
                 
                  <ProfilePage />
                
              }
            />  
         
        </Route>
 
      </Routes>
    </Router>
  );
}

export default App;
