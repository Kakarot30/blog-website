import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './components/Layout';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
}

export default App;