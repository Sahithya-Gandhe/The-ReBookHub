import React from 'react';
import './shop.css';
import logo from './assets/main.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { supabase } from '../supabaseClient';
// import {email} from './App'
function ShopPage() {

  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching products:", error.message);
    } else {
      setProducts(data);
    }
  };

  useEffect(() => {
    fetchProducts(); // fetch on component mount
  }, []);

  //might delete later
  const handleBuyNow = (id) => {
    navigate(`/product/${id}`); // Navigate to details page
  };

  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/Sell'); // Navigate to the About page
  };

  return (
    <div className="shop-page">
      <header className="navbar">
        <div className="logo-container">
          <img src={logo} alt="The Re-Book Hub Logo" className="logo" />
        </div>
        <nav className="nav-links">
        <button className="sell-button" onClick={handleButtonClick}>Sell</button>
        </nav>
      </header>


      <div className="shop-container">
      <h1 className='heading'>Available Products</h1>
      <div className="product-list">
        {products.map(product => (
          <div className="product-card" key={product.id}>
            <h3>{product.productName}</h3>
            <p><strong>Institution:</strong> {product.Institution}</p>
            <p><strong>Condition:</strong> {product.condition}</p>
            <p><strong>Price:</strong> ₹{product.price}</p>
            <button className="buy-now-btn" onClick={() => handleBuyNow(product.id)}>Check Out the product</button>
          </div>
        ))}
      </div>
    </div>
    
    </div>
  );
}

export default ShopPage;