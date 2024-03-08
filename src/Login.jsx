import React, { useState } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import { Button, TextField, Typography, Container } from '@mui/material';
import {Router} from 'react-router'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import Sound from 'react-sound';
import warningSound from './assets/negative_beeps-6008.mp3';
import successSound from './assets/success-1-6297.mp3'

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [playWarningSound, setPlayWarningSound] = useState(false);
  const [playsuccesssound, setSuccesSound] = useState(false)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Make API request to login endpoint
      const response = await fetch('https://flutter-self-stack-api.vercel.app/api/users/signin?apiKey=flutterbyafaf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // If login successful, set isLoggedIn state to true
        setIsLoggedIn(true);
        // Show success toast
        toast.success('Login successful!');
        setTimeout(() => {
          navigate('/');
        }, 2000); 
        setSuccesSound(true)
        setLoginSuccess(true);

        // Set a cookie with the user ID
        const data = await response.json();
        const userId = data.userId; // Assuming the user ID is returned in the response
        Cookies.set('userId', userId, { expires: 7 }); // Set the cookie to expire in 7 days
      } else {
        setPlayWarningSound(true); 
        toast.error("Invalid Email or Password");
      }
    } catch (error) {
      setPlayWarningSound(true); 
      console.error('Error logging in:', error);
      toast.error('An error occurred. Please try again later.');
    }
  };

  return (
    <Container className='clogin' maxWidth="sm">
      <Typography variant="h4" className='hh' gutterBottom>Login</Typography>
      <Sound
        url={warningSound}
        playStatus={playWarningSound ? Sound.status.PLAYING : Sound.status.STOPPED}
        onFinishedPlaying={() => setPlayWarningSound(false)}
      />
      <Sound
        url={successSound}
        playStatus={playsuccesssound ? Sound.status.PLAYING : Sound.status.STOPPED}
        onFinishedPlaying={() => setSuccesSound(false)}
      />
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
      <Typography variant="body1">
        Don't have an account? <Link to="/register">Register</Link>
      </Typography>
      {loginSuccess && (
        <Typography variant="body1">
          <Link to="/">Continue to dashboard</Link>
        </Typography>
      )}
      <ToastContainer />
    </Container>
  );
};

export default Login;
