import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container } from '@mui/material';
import { ToastContainer, toast, Flip } from 'react-toastify';

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
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return false;
    }
    if (name.length < 3 || name.length > 15) {
      toast.error('Name must be between 3 and 15 characters');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      toast.error('Password must contain at least one lowercase letter, one uppercase letter, and one number');
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
       <ToastContainer transition={Flip} />
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
