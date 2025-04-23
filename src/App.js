import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://app-api-backend.onrender.com';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [dark, setDark] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTasks(data);
  };

  const addTask = async () => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ title, completed: false })
    });
    const newTask = await res.json();
    setTasks([...tasks, newTask]);
    setTitle('');
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleComplete = async (task) => {
    const res = await fetch(`${API_URL}/${task.id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ ...task, completed: !task.completed })
    });
    const updated = await res.json();
    setTasks(tasks.map(t => (t.id === updated.id ? updated : t)));
  };

  const filtered = tasks.filter(t =>
    filter === 'completed' ? t.completed :
    filter === 'pending' ? !t.completed : true
  );

  return (
    <div className={dark ? 'App dark' : 'App'}>
      <h1>To-Do List</h1>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New task..." />
      <button onClick={addTask}>Add</button>
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('completed')}>✔️</button>
        <button onClick={() => setFilter('pending')}>⏳</button>
        <button onClick={() => setDark(!dark)}>🌓</button>
      </div>
      <ul>
        {filtered.map(task => (
          <li key={task.id}>
            <span style={{ textDecoration: task.completed ? 'line-through' : '' }} onClick={() => toggleComplete(task)}>
              {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
