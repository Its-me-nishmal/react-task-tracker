import React, { useState, useEffect } from 'react';
import { Container, Button, Table, CircularProgress, Tabs, Modal, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import AddIcon from '@mui/icons-material/Add';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import annyang from 'annyang';

const Dashboard = ({ handleLogout }) => {
  const [userData, setUserData] = useState(null);
  const [privateTodoData, setPrivateTodoData] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoSubtitle, setNewTodoSubtitle] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    // Initialize annyang if available
    if (annyang) {
      // Define commands and their callback functions
      var commands = {
        'add task': handleModalOpen, // Opens the modal to add a new task
        'submit': handleAddTodo, // Submits the new task
        'title *title': (title) => { 
          console.log("Title voice input:", title);
          setNewTodoTitle((prevTitle) => prevTitle ? prevTitle + ' ' + title : title); 
        }, // Captures the title from voice input
        'subtitle *subtitle': (subtitle) => { 
          console.log("Subtitle voice input:", subtitle);
          setNewTodoSubtitle((prevSubtitle) => prevSubtitle ? prevSubtitle + ' ' + subtitle : subtitle); 
        }, // Captures the subtitle from voice input
        'open *index': (index) => {
          console.log("Open task:", index);
          const elements = document.getElementsByClassName("okk");
  if (elements.length > index) {
    elements[index].click();
  } else {
    console.error("Index out of bounds:", index);
  }
        } // Navigates to the task with the specified index
      };
  
      // Add commands to annyang
      annyang.addCommands(commands);
  
      // Start listening
      annyang.start();
  
      console.log("Annyang started");
    } else {
      console.log("Annyang not available");
    }
    
    // Cleanup function to stop annyang when component unmounts
    return () => {
      if (annyang) {
        annyang.abort();
        console.log("Annyang aborted");
      }
    };
  }, [privateTodoData, navigate]);
  
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
      const title = document.getElementById('newTodoTitle').value;
      const subtitle = document.getElementById('newTodoSubtitle').value;

      if (title.length < 3 || subtitle.length < 3) {
        return toast.error('Title and subtitle must contain at least 3 characters');
      }

      const userId = Cookies.get('userId');
      const response = await fetch(`https://flutter-self-stack-api.vercel.app/api/todo?apiKey=flutterbyafaf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          subtitle: subtitle,
          createdBy: userId,
          isPublic: false
        }),
      });
      if (!response.ok) {
        toast.error('Error when adding Task');
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
        <ToastContainer />
        <h4>Welcome {userData.user.name} to Dashboard</h4>
        <div className="button-container">
          <Button className="add-button" variant="contained" color="primary" onClick={handleModalOpen}>
            <AddIcon />
            Add Task
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
                <th>Sub Title</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {privateTodoData &&
                privateTodoData.map((todo, index) => (
                  <tr key={index} className="todo-row">
                    <td>{index + 1}</td>
                    <td>
                      <Link className="ll okk" to={`/todo/${todo._id}`}>
                        {todo.title.length > 20 ? todo.title.substring(0, 20) + '...' : todo.title}
                      </Link>
                    </td>
                    <td>
                      <Link className="ll" to={`/todo/${todo._id}`}>
                        {todo.subtitle.length > 30 ? todo.subtitle.substring(0, 30) + '...' : todo.subtitle}
                      </Link>
                    </td>
                    <td>
                      <Link className="ll" to={`/todo/${todo._id}`}>
                        {todo.status}
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Tabs>
        <Modal open={openModal} onClose={handleModalClose}>
          <div className="modal">
            <div className="modal-content">
              <h2>Add New Task</h2>
              <TextField
                className='mm'
                id='newTodoTitle'
                label="Title"
                variant="outlined"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
              />
              <br />
              <br />
              <TextField
                className='mm'
                id='newTodoSubtitle'
                label="Subtitle"
                variant="outlined"
                value={newTodoSubtitle}
                onChange={(e) => setNewTodoSubtitle(e.target.value)}
              />
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
