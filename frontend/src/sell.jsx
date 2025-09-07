import React from 'react';
import './sell.css';
import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useEffect, useState } from "react";
import { supabase } from '../supabaseClient';
import { useUser } from "./contextprovider";

function SellPage() {
  const Email = useUser();
  // to create products and add the feilds in it 
  const [newProducts, setNewProducts] = useState({productName:"",Institution:"",condition:"",price:""});
  // keeping track of listed products through a state 
  const [products, setProducts] = useState([]);
//state to keep track of the images 
const[productImage,setProductImage] = useState(null);
const [user, setUser] = useState(null);


useEffect(() => {
  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
    
    if (!session?.user) {
      alert("You must be logged in to upload products");
    }
  };
  
  checkUser();
}, []);

// upload url function 
const uploadImage = async (file) => {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error("User not authenticated");
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`; // Simplified path

    console.log("Uploading file:", file.name, "Path:", filePath);

    // First, let's check if the bucket exists and we can access it
    const { data: listData, error: listError } = await supabase.storage
      .from('product-images')
      .list('', { limit: 1 });
      
    if (listError) {
      console.error('Bucket access error:', listError);
      throw listError;
    }

    const { data, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    console.log("Upload successful:", data);

    // Get public URL - new API in Supabase v2
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    console.log("Public URL:", urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    alert(`Upload failed: ${error.message || 'Unknown error'}`);
    return null;
  }
};

// to insert the data into the Supabase database
  const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        alert("You must be logged in to upload products");
        return;
      }

//image urls part 
    let imageUrl = null;
    if(productImage){
      imageUrl = await uploadImage(productImage);
      if (!imageUrl) {
        // Don't proceed if image upload failed
        return;
      }
    }
      const {error} = await supabase.from("products").insert({...newProducts, image_url: imageUrl,email: Email});
      if(error){
        console.error("Database insert error:", error);
        alert("Error: " + error.message);
      }
      else{
        alert("Product Listed Successfully");
        // setNewProducts({productName:"",Institution:"",condition:"",price:""});
        setNewProducts({productName:"",Institution:"",condition:"",price:""});
        setProductImage(null); // Reset image state
      }
  }
// to fetch the data from the supabase database
 const fetchProducts = async () => {
  const { error,data } = await supabase
  .from("products")
  .select("*")
  .order("id",{ascending:true});

  if(error){
    console.log("Error reading tasks",error.message);
    return;
  }
  else{
    setProducts(data);
  }
 };

// simply using the useEffect to fetch the data when ever the page id refreshed  
useEffect(()=>{
  fetchProducts();
},[]);
console.log(products);

// images part adding them in the storage bucket
const handleFileChange = (e) => {
  if(e.target.files && e.target.files.length > 0){
    setProductImage(e.target.files[0]);
    console.log("Selected file:", e.target.files[0]);
  }
};


//to navigate to other pages 
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/'); // Navigate to the About page
  };

  return (
    <div className="sell-container">
      <h1>Sell Your Product on Re-Book Hub</h1>
      <button className="aboutus-btn" onClick={handleButtonClick}>Go to Shop</button>
      <form onSubmit={handleSubmit} className="sell-form">
        <label htmlFor="productName">Product Name:</label>
        <input type="text" id="productName" name="productName" placeholder="Enter product name" required 
        onChange={(e)=>{
          // setNewProducts({...newProducts,productName:e.target.value}) // might has to be changed not acc to video
          setNewProducts((prev) => ({...prev,productName:e.target.value}))
        }}
        />

        <label htmlFor="institution">Institution:</label>
        <input type="text" id="institution" name="institution" placeholder="Enter your institution name" required
        onChange={(e)=>{
          // setNewProducts({...newProducts,institution:e.target.value}) // might has to be changed not acc to video 
          setNewProducts((prev) => ({...prev,Institution:e.target.value}))
        }}
        />

        <label htmlFor="condition">Product Condition:</label>
        <input type="text" id="condition" name="condition" placeholder="Discribe Product Condition" required 
          onChange={(e)=>{
            // setNewProducts({...newProducts,condition:e.target.value}) // might has to be changed not acc to video
            setNewProducts((prev) => ({...prev,condition:e.target.value}))
          }}
        />

        <label htmlFor="price">Price (in INR):</label>
        <input type="number" id="price" name="price" placeholder="Enter price" required 
          onChange={(e)=>{
            // setNewProducts({...newProducts,price:e.target.value}) // might has to be changed not acc to video
            setNewProducts((prev) => ({...prev,price:e.target.value}))
          }}
          />


        <label htmlFor="productImage">Product Image:</label>
        <input type="file" id="productImage" name="productImage" accept="image/*" required
        // onChange={(e)=>{
        //   handleFileChange(e);
        // }}
        onChange={handleFileChange}
        />

        <button type="submit">Submit Listing</button>
      </form>

{/* <p>{products}</p> */}

    </div>

  );
}

export default SellPage;