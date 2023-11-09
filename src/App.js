import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
  //const [showMenu, setShowMenu] = useState(false);
  const [cart, setCart] = useState({});
  const routerRef = useRef();
  const [user, setUser] = useState(null);

  //for loading last user session from the local storage to the state if it exists
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    setUser(parsedUser);
  }, []);

  //(for product view)to fetch the user and products data from the server when the component mounts
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

  //(for cart management) to fetch data from the API and update the component state with the retrieved data,runs only once when the component is mounted
  useEffect(() => {
    const fetchData = async () => {
      let user = localStorage.getItem("user");
      let cart = localStorage.getItem("cart");
  
      const products = await axios.get('http://localhost:3000/products');
      user = user ? JSON.parse(user) : null;
      cart = cart ? JSON.parse(cart) : {};
  
      setUser(user);
      setProducts(products.data);
      setCart(cart);
    };
  
    fetchData();
  }, []);

  const addToCart = (cartItem) => {
    const updatedCart = { ...cart };
    if (updatedCart[cartItem.id]) {
      updatedCart[cartItem.id].amount += cartItem.amount;
    } else {
      updatedCart[cartItem.id] = cartItem;
    }
    if (updatedCart[cartItem.id].amount > updatedCart[cartItem.id].product.stock) {
      updatedCart[cartItem.id].amount = updatedCart[cartItem.id].product.stock;
    }
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };  

  const removeFromCart = (cartItemId) => {
    const updatedCart = { ...cart };
    delete updatedCart[cartItemId];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };
  
  const clearCart = () => {
    const updatedCart = {};
    localStorage.removeItem("cart");
    setCart(updatedCart);
  };
  
  const addProduct = (product, callback) => {
    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    if (callback) {
      callback();
    }
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
  
  // const logout = (e) => {
  //   e.preventDefault();
  //   setUser(null);
  //   localStorage.removeItem("user");
  // };


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
