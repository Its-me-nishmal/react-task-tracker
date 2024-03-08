import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Button, TextField, CircularProgress, MenuItem } from '@mui/material';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteIcon from '@mui/icons-material/Delete';
import Sound from 'react-sound';
import successSound from './assets/success-1-6297.mp3';
import warningSound from './assets/negative_beeps-6008.mp3';
import deleteSound from './assets/Voicy_Roblox Delete.mp3';
import './App.css';

const TodoDetails = () => {
  const { id } = useParams();
  const [todoData, setTodoData] = useState(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoSubtitle, setNewTodoSubtitle] = useState('');
  const [newTodoStatus, setNewTodoStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [playWarningSound, setPlayWarningSound] = useState(false);
  const [playSuccessSound, setPlaySuccessSound] = useState(false);
  const [playDeleteSound, setPlayDeleteSound] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodoData(id);
  }, [id]);

  const fetchTodoData = async (todoId) => {
    try {
      const response = await fetch(`https://flutter-self-stack-api.vercel.app/api/todo/${todoId}?apiKey=flutterbyafaf`);
      if (!response.ok) {
        throw new Error('Failed to fetch todo data');
      }
      const todoData = await response.json();
      setTodoData(todoData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching todo data:', error);
    }
  };

  const handleUpdateTodo = async () => {
    try {
      const response = await fetch(`https://flutter-self-stack-api.vercel.app/api/todo/${id}?apiKey=flutterbyafaf`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTodoTitle || todoData.title,
          subtitle: newTodoSubtitle || todoData.subtitle,
          status: newTodoStatus || todoData.status,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      fetchTodoData(id);
      toast.success('Todo updated successfully');
      setPlaySuccessSound(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error updating todo:', error);
      toast.error('Error updating todo');
      setPlayWarningSound(true);
    }
  };

  const handleDeleteTodo = async () => {
    try {
      const response = await fetch(`https://flutter-self-stack-api.vercel.app/api/todo/${id}?apiKey=flutterbyafaf`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      toast.success('Todo deleted successfully');
      setPlayDeleteSound(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error('Error deleting todo');
      setPlayWarningSound(true);
    }
  };

  if (loading || !todoData) {
    return (
      <div className="loading-container">
        <CircularProgress color="secondary" />
      </div>
    );
  }

  return (
    <div className="root">
      <Container>
        <ToastContainer />
        <p className='pp'>Todo Details</p>
        <div className="todo-details">
          <TextField
            className='txt'
            label="Title"
            variant="outlined"
            defaultValue={todoData.title}
            onChange={(e) => setNewTodoTitle(e.target.value)}
          />
          <TextField
            className='txt'
            label="Subtitle"
            variant="outlined"
            defaultValue={todoData.subtitle}
            onChange={(e) => setNewTodoSubtitle(e.target.value)}
          />
          <TextField
            className='txt'
            select
            label="Status"
            value={newTodoStatus || todoData.status}
            onChange={(e) => setNewTodoStatus(e.target.value)}
          >
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </TextField>
          <Button variant="contained" color="primary" onClick={handleUpdateTodo}>
            Update Todo
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteTodo}>
            <DeleteIcon /> Delete Todo
          </Button>
        </div>
        {/* Sound components */}
        <Sound
          url={warningSound}
          playStatus={playWarningSound ? Sound.status.PLAYING : Sound.status.STOPPED}
          onFinishedPlaying={() => setPlayWarningSound(false)}
        />
        <Sound
          url={successSound}
          playStatus={playSuccessSound ? Sound.status.PLAYING : Sound.status.STOPPED}
          onFinishedPlaying={() => setPlaySuccessSound(false)}
        />
       <Sound
  url={deleteSound}
  playStatus={playDeleteSound ? Sound.status.PLAYING : Sound.status.STOPPED}
  onFinishedPlaying={() => {
    setPlayDeleteSound(false); // Stop the delete sound after it finishes playing
    setTimeout(() => setPlayDeleteSound(false), 1000); // Set a timeout to stop the sound after 1 second
  }}
/>
      </Container>
    </div>
  );
};

export default TodoDetails;
