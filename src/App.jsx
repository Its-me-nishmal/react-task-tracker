import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login';
import Register from './Register';
import Cookies from 'js-cookie';
import TodoDetails from './TodoDetails';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in when the component mounts
    const userId = Cookies.get('userId');
    if (userId) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false); // Make sure to set isLoggedIn to false if userId is not found
    }
  }, []);
  const handleLogout = () => {
    Cookies.remove('userId');
    setIsLoggedIn(false); // Update isLoggedIn state to indicate user is not logged in
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          {isLoggedIn && <Route path="/" element={<Dashboard handleLogout={handleLogout} />} />}
          {!isLoggedIn && <Route path="/" element={<NotLoggedIn />} />}
          <Route path="/todo/:id" element={<TodoDetails/>} />
        </Routes>
      </div>
    </Router>
  );
};

// Placeholder component for when user is not logged in
const NotLoggedIn = () => {
  return (
    <div className="not-logged-in">
      <h1>You are not logged in</h1>
      <p>Please <Link to="/login">login</Link> or <Link to="/register">register</Link>.</p>
    </div>
  );
};

export default App;
