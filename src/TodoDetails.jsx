import React, { useState, useEffect } from 'react';
import { Container, Button, TextField, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import './App.css';

const TodoDetails = () => {
  const { id } = useParams();
  const [todoData, setTodoData] = useState(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoSubtitle, setNewTodoSubtitle] = useState('');
  const [newTodoStatus, setNewTodoStatus] = useState('');
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error('Error updating todo:', error);
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
        <p>Todo Details</p>
        <div className="todo-details">
          <TextField
            label="Title"
            variant="outlined"
            defaultValue={todoData.title}
            onChange={(e) => setNewTodoTitle(e.target.value)}
          />
          <TextField
            label="Subtitle"
            variant="outlined"
            defaultValue={todoData.subtitle}
            onChange={(e) => setNewTodoSubtitle(e.target.value)}
          />
          <TextField
            label="Status"
            variant="outlined"
            defaultValue={todoData.status}
            onChange={(e) => setNewTodoStatus(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleUpdateTodo}>
            Update Todo
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default TodoDetails;
