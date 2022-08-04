import React from 'react';
import {Route, Routes,BrowserRouter} from 'react-router-dom'
import Shop from './Pages/Shop';
import './App.css';


function App() {
  return (
    <BrowserRouter>
      <Shop/>
    </BrowserRouter>
    
  );
}

export default App;
