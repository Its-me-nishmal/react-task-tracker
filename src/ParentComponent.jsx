// ParentComponent.jsx
import React, { useState } from 'react';
import Login from './Login'; // Assuming Login component is in the same directory

const ParentComponent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Define the function to redirect to the home page
  const redirectToHome = () => {
    // Perform redirection logic here, e.g., using react-router-dom
    // For example, if you are using useHistory hook:
    history.push('/');
  };

  return (
    <div>
      {/* Pass the setIsLoggedIn and redirectToHome functions as props */}
      <Login setIsLoggedIn={setIsLoggedIn} redirectToHome={redirectToHome} />
    </div>
  );
};

export default ParentComponent;
