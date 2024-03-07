import React from 'react';
import { Typography, Container, Button } from '@mui/material';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Function to handle logout
  const handleLogout = () => {
    // Remove the userId cookie
    Cookies.remove('userId');
  };

  // Check if the userId cookie exists
  const userId = Cookies.get('userId');

  if (!userId) {
    // If the userId cookie does not exist, redirect to the login page
    return (
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>Please log in to access the dashboard</Typography>
        <Link to="/login">
          <Button variant="contained" color="primary">
            Login
          </Button>
        </Link>
      </Container>
    );
  }

  // If the userId cookie exists, render the dashboard content
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Welcome to Dashboard</Typography>
      <Button variant="contained" color="primary" onClick={handleLogout}>
        Logout
      </Button>
    </Container>
  );
};

export default Dashboard;
