import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Switch, Routes, Route, BrowserRouter } from 'react-router-dom';
import HomeScreen from './pages/homeScreen';
import CartScreen from './pages/cartScreen';
import ProductDetails from './pages/productScreen';
import AddProductScreen from './pages/addProductScreen';
import LoginScreen from './pages/login';
import Context from "./Context";
import axios from 'axios';
import jwt_decode from 'jwt-decode';


function App() {
  const [products, setProducts] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [cart, setCart] = useState({});
  const routerRef = useRef();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    setUser(parsedUser);
  }, []);

  //to fetch the user and products data from the server when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      let user = localStorage.getItem("user");
      const productsResponse = await axios.get("http://localhost:3001/products");
      user = user ? JSON.parse(user) : null;
      setUser(user);
      setProducts(productsResponse.data);
    };

    fetchData();
  }, []);

  const removeFromCart = (productId) => {
    const updatedCart = { ...cart };
    delete updatedCart[productId];
    setCart(updatedCart);
  };

  const addToCart = (product) => {
    const updatedCart = { ...cart };
    updatedCart[product.id] = product;
    setCart(updatedCart);
  };

  // const addProduct = (product) => {
  //   setProducts([...products, product]);
  // };
  const addProduct = (product, callback) => {
    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    if (callback) {
      callback();
    }
  };

  const clearCart = () => {
    setCart({});
  };

  const checkout = () => {
    // Perform checkout logic
  };

  const login = async (email, password) => {
    const res = await axios.post(
      'http://localhost:3001/login',
      { email, password },
    ).catch((res) => {
      return { status: 401, message: 'Unauthorized' }
    })
  
    if (res.status === 200) {
      const { email } = jwt_decode(res.data.accessToken)
      const user = {
        email,
        token: res.data.accessToken,
        accessLevel: email === 'admin@example.com' ? 0 : 1
      }
  
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    } else {
      return false;
    }
  };
  
  const logout = (e) => {
    e.preventDefault();
    setUser(null);
    localStorage.removeItem("user");
  };


  return (
    <Context.Provider
      value={{
        user,
        cart,
        products,
        removeFromCart,
        addToCart,
        login,
        addProduct,
        clearCart,
        checkout
      }}
    >
      <Router ref={routerRef}>
          <Navbar user={user} setUser={setUser}></Navbar>
          <Routes>
            <Route exact path="/" element={<HomeScreen/>} />
            <Route path="/login" element={<LoginScreen/>} />
            <Route path="/cart" element={<CartScreen/>} />
            <Route path="/add-product" element={<AddProductScreen/>} />
            <Route path="/home" element={<HomeScreen/>} /> {/* Similar to product list*/}
            <Route path='/product-details' element={<ProductDetails/>} /> {/* have to work on this screen - for the product details */}
          </Routes>       
      </Router>
    </Context.Provider>
  );  
}

export default App;
