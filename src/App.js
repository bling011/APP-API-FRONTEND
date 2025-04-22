import './App.css';
import React, { useEffect, useState } from 'react';
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodo
} from './api';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const res = await fetchTodos();
      setTodos(res.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleAddTodo = async () => {
    if (newTodo.trim() === '') return;

    try {
      await createTodo({ title: newTodo });
      setNewTodo('');
      loadTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      loadTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      await updateTodo(todo.id, {
        ...todo,
        completed: !todo.completed,
      });
      loadTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleEdit = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.title);
  };

  const handleSaveEdit = async (id) => {
    if (editingText.trim() === '') return;

    try {
      await updateTodo(id, { title: editingText });
      setEditingId(null);
      setEditingText('');
      loadTodos();
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'pending') return !todo.completed;
    return true;
  });

  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
      </button>

      <h1>TODO LIST</h1>

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
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo)}
            />
            {editingId === todo.id ? (
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                style={{ marginLeft: 10, flexGrow: 1 }}
              />
            ) : (
              <span
                style={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                }}
              >
                {todo.title}
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