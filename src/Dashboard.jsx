import React, { useState, useEffect } from 'react';
import { Container, Button, Table, CircularProgress, Tabs, Modal, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import AddIcon from '@mui/icons-material/Add';
import './App.css';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [privateTodoData, setPrivateTodoData] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoSubtitle, setNewTodoSubtitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = Cookies.get('userId');
    if (userId) {
      fetchUserData(userId);
      fetchPrivateTodoData(userId);
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`https://flutter-self-stack-api.vercel.app/api/users/${userId}?apiKey=flutterbyafaf`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await response.json();
      setUserData(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchPrivateTodoData = async (userId) => {
    try {
      const response = await fetch(`https://flutter-self-stack-api.vercel.app/api/todo/user/${userId}?apiKey=flutterbyafaf`);
      if (!response.ok) {
        throw new Error('Failed to fetch private todo data');
      }
      const privateTodoData = await response.json();
      setPrivateTodoData(privateTodoData);
    } catch (error) {
      console.error('Error fetching private todo data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('userId');
    window.location.reload();
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleAddTodo = async () => {
    try {
      const userId = Cookies.get('userId');
      const response = await fetch(`https://flutter-self-stack-api.vercel.app/api/todo?apiKey=flutterbyafaf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTodoTitle,
          subtitle: newTodoSubtitle,
          createdBy: userId,
          isPublic: false
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add todo');
      }
      handleModalClose();
      fetchPrivateTodoData(userId);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  if (!userData || loading) {
    return (
      <div className="loading-container">
        <CircularProgress color="secondary" />
      </div>
    );
  }

  return (
    <div className="root">
      <Container>
        <h4>Welcome {userData.user.name} to Dashboard</h4>
        <div className="button-container">
          <Button className="add-button" variant="contained" color="primary" onClick={handleModalOpen}>
            <AddIcon />
            Add Todo
          </Button>
          <Button className="logout-button" variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        <Tabs className="todo-tabs" value={tabValue} onChange={handleTabChange} aria-label="Todo Tabs">
          <Table className="todo-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Subtitle</th>
                <th>Percentage</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {privateTodoData && privateTodoData.map((todo, index) => (
                <tr key={index} className="todo-row">
                  <td>{index + 1}</td>
                  <td>
                    <Link to={`/todo/${todo._id}`}>{todo.title}</Link>
                  </td>
                  <td>{todo.subtitle}</td>
                  <td>{todo.percentage}</td>
                  <td>{todo.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tabs>
        <Modal open={openModal} onClose={handleModalClose}>
          <div className="modal">
            <div className="modal-content">
              <h2>Add New Todo</h2>
              <TextField label="Title" variant="outlined" value={newTodoTitle} onChange={(e) => setNewTodoTitle(e.target.value)} />
              <TextField label="Subtitle" variant="outlined" value={newTodoSubtitle} onChange={(e) => setNewTodoSubtitle(e.target.value)} />
              <div className="modal-buttons">
                <Button variant="contained" color="primary" onClick={handleAddTodo}>
                  Add
                </Button>
                <Button variant="contained" color="secondary" onClick={handleModalClose}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </Container>
    </div>
  );
};

export default Dashboard;
