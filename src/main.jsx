import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './App.css'
import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './App.jsx'
import { AuthProvider } from './AuthContext/AuthContext.jsx'
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <App />
    </AuthProvider>
  </React.StrictMode>
);
