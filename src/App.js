// App.js
import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define the functions directly in App.js
const API_URL = 'https://app-api-backend.onrender.com';

export const fetchTodos = () => axios.get(`${API_URL}/items/`);
export const createTodo = (todo) => axios.post(`${API_URL}/items/`, todo);
export const updateTodo = (id, todo) => axios.put(`${API_URL}/items/${id}`, todo);
export const deleteTodo = (id) => axios.delete(`${API_URL}/items/${id}`);

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const res = await fetchTodos();
      setTodos(res.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Failed to load todos. Please try again later.');
    }
  };

  const handleAddTodo = async () => {
    if (newTodo.trim() === '') return;
    try {
      await createTodo({ name: newTodo, description: '', done: false });
      setNewTodo('');
      loadTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Failed to add todo. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      loadTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Failed to delete todo. Please try again.');
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      await updateTodo(todo.id, {
        ...todo,
        done: !todo.done,
      });
      loadTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Failed to update todo. Please try again.');
    }
  };

  const handleEdit = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.name);
  };

  const handleSaveEdit = async (id) => {
    if (editingText.trim() === '') return;

    try {
      const original = todos.find((t) => t.id === id);
      await updateTodo(id, {
        name: editingText,
        description: original.description,
        done: original.done,
      });
      setEditingId(null);
      setEditingText('');
      loadTodos();
    } catch (error) {
      console.error('Error saving todo:', error);
      setError('Failed to save changes. Please try again.');
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'completed') return todo.done;
    if (filter === 'pending') return !todo.done;
    return true;
  });

  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
      </button>

      <h1>TODO LIST</h1>

      {error && <p className="error">{error}</p>}

      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a todo..."
      />
      <button onClick={handleAddTodo}>Add</button>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setFilter('all')} className="filter-btn">All</button>
        <button onClick={() => setFilter('completed')} className="filter-btn">Completed</button>
        <button onClick={() => setFilter('pending')} className="filter-btn">Pending</button>
      </div>

      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => handleToggleComplete(todo)}
            />
            {editingId === todo.id ? (
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
              />
            ) : (
              <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
                {todo.name}
              </span>
            )}
            <div className="btn-group">
              {editingId === todo.id ? (
                <button className="edit-btn" onClick={() => handleSaveEdit(todo.id)}>Save</button>
              ) : (
                <button className="edit-btn" onClick={() => handleEdit(todo)}>Edit</button>
              )}
              <button className="delete-btn" onClick={() => handleDelete(todo.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
