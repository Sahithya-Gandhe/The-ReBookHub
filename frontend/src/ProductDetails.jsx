// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { supabase } from '../supabaseClient';
// import './productdetails.css';
// import logo from './assets/main.png';
// import { useUser } from "./contextprovider";
// import { useNavigate } from 'react-router-dom'
// export let owneremail = '';
// export const getOwnerEmail = () => owneremail;



// function ProductDetails() {
//   const { id } = useParams(); // get product ID from URL
//   const [product, setProduct] = useState(null);
//   const email = useUser(); // logged-in user

//   const fetchProduct = async () => {
//     const { data, error } = await supabase
//       .from("products")
//       .select("*")
//       .eq("id", id)
//       .single();

//     if (error) {
//       console.error("Error fetching product:", error.message);
//     } else {
//       setProduct(data);
//       owneremail = data.email; // Assign owneremail here
//     }
//   };

//   const navigate = useNavigate();

//   const handleButtonClick1 = () => {
//     navigate('/'); // Navigate to the About page
//   };

//   const handleButtonClick = () => {
//     navigate('/chatbox'); // Navigate to the About page
//   };

//   useEffect(() => {
//     fetchProduct();
//   }, [id]);

//   if (!product) return <p>Loading product details...</p>;

//   return (

//     // <div className="Products">
      


//       <div className="product-details-container">

// <header className="navbar">
//         <div className="logo-container">
//           <img src={logo} alt="The Re-Book Hub Logo" className="logo" />
//           <button className="shop-button" onClick={handleButtonClick1}>Shop More</button>
//         </div>
//         <nav className="nav-links">
//         {/* <button className="sell-button" onClick={handleButtonClick}>Sell</button> */}
//         </nav>
//       </header>

//       <h1>{product.productName}</h1>
//       <p className='name'><strong>Institution:</strong> {product.Institution}</p>
//       <p className='condition'><strong >Condition:</strong> {product.condition}</p>
//       <p className='price'><strong >Price:</strong> ₹{product.price}</p>
//       <p className='id'><strong >Product ID:</strong> {product.id}</p>
//       <p className='id'><strong>Owner :</strong>{product.email}</p>
//       <button className="chat-button" onClick={handleButtonClick}>Chat with Seller</button>
//     </div>
//     // </div>
//   );
// }

// export default ProductDetails;








import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './productdetails.css';
import logo from './assets/main.png';
import { useUser } from "./contextprovider";
import { useNavigate } from 'react-router-dom';

function ProductDetails() {
  const { id } = useParams(); // get product ID from URL
  const [product, setProduct] = useState(null);
  const email = useUser(); // logged-in user

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching product:", error.message);
    } else {
      setProduct(data);
    }
  };

  const navigate = useNavigate();

  const handleButtonClick1 = () => {
    navigate('/'); // Navigate to the About page
  };

  // ✅ PASS receiverEmail HERE
  const handleButtonClick = () => {
    navigate('/chatbox', { state: { receiverEmail: product.email } }); 
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading product details...</p>;

  return (
    <div className="product-details-container">
      <header className="navbar">
        <div className="logo-container">
          <img src={logo} alt="The Re-Book Hub Logo" className="logo" />
          <button className="shop-button" onClick={handleButtonClick1}>Shop More</button>
        </div>
        <nav className="nav-links"></nav>
      </header>

      <h1>{product.productName}</h1>
      <p className='name'><strong>Institution:</strong> {product.Institution}</p>
      <p className='condition'><strong>Condition:</strong> {product.condition}</p>
      <p className='price'><strong>Price:</strong> ₹{product.price}</p>
      <p className='id'><strong>Product ID:</strong> {product.id}</p>
      <p className='id'><strong>Owner :</strong>{product.email}</p>
      <button className="chat-button" onClick={handleButtonClick}>Chat with Seller</button>
    </div>
  );
}

export default ProductDetails;
