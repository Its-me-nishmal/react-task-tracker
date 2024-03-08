import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container } from '@mui/material';
import { toast } from 'react-toastify';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Define useNavigate hook here

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const validateForm = () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!email.trim()) {
      toast.error('Please enter your email');
      return false;
    }
    if (!password.trim()) {
      toast.error('Please enter your password');
      return false;
    }
    return true;
  };

  const handleRegister = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    
    // Validate form inputs
    if (!validateForm()) {
      return;
    }

    // Perform fetch POST request to register user
    try {
      const response = await fetch('https://flutter-self-stack-api.vercel.app/api/users?apiKey=flutterbyafaf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      if (response.ok) {
        toast.success('Registration successful!');
        // Redirect to login page
        setTimeout(() => {
          navigate('/login');
        }, 1000); 
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      toast.error('Registration failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Register</Typography>
      <form onSubmit={handleRegister}>
        <TextField label="Name" fullWidth margin="normal" value={name} onChange={handleNameChange} />
        <TextField label="Email" fullWidth margin="normal" value={email} onChange={handleEmailChange} />
        <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={handlePasswordChange} />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register
        </Button>
      </form>
      <Typography variant="body1">
        Already have an account? <Link to="/login">Login</Link>
      </Typography>
    </Container>
  );
};

export default Register;
