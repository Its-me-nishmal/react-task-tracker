import React from 'react';
import { Link } from 'react-router-dom';
import { Button, TextField, Typography, Container } from '@mui/material';

const Register = () => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Register</Typography>
      <form>
        <TextField label="Username" fullWidth margin="normal" />
        <TextField label="Password" type="password" fullWidth margin="normal" />
        <Button variant="contained" color="primary" fullWidth>
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
