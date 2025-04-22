import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import ToDoList from './ToDoList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tasks" element={<ToDoList />} />
      </Routes>
    </Router>
  );
}

export default App;
