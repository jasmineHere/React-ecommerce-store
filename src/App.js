import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import HomeScreen from './pages/homeScreen.js';
import CartScreen from './pages/cartScreen.js';
import ProductDetails from './pages/productScreen.js';


function App() {
  return (
    <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' exact element={<HomeScreen/>} />
          <Route path='/home' element={<HomeScreen/>} />
          <Route path='/product-details' element={<ProductDetails/>} />
          <Route path='/cart' element={<CartScreen/>} />
        </Routes>
    </BrowserRouter>
    
  );
}

export default App;
