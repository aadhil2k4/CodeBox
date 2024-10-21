import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createTheme, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

const theme = createTheme({
  typography:{
    fontFamily: 'Roboto, sans-serif',
  }
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
     <BrowserRouter> 
    <App />
    </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

