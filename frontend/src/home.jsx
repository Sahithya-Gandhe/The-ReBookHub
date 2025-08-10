import React from 'react';
import './App.css'; // Assuming App.css contains general styling
import logo from './assets/main.png'; // Main logo
import drafter from './assets/images/drafter.png';
import laptop from './assets/images/laptop.png';
import notebooks from './assets/images/notebooks.png';
import mainlogo from './assets/images/logot1.png';
// import React from 'react';
import { useNavigate } from 'react-router-dom';


function HomePage() {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/About'); // Navigate to the About page
  };
  return (
    <div className="home-page">
      <header className="navbar">
        <div className="logo-container">
          <img src={logo} alt="The Re-Book Hub Logo" className="logo" />
        </div>
        <nav className="nav-links">
          {/* <button className="aboutus-btn"><Link to='/About'> About us</Link> */}
            {/* </button> */}
            <button className="aboutus-btn" onClick={handleButtonClick}>About Us</button>


        </nav>
      </header>

      <main className="main-content">
        <h1 className="welcome-title">Welcome to The Re-Book Hub</h1>
        <p className="welcome-subtitle">Your one-stop online store for reusing the previous purchases</p>

        <div className="center-logo">
          <img src={mainlogo} alt="The Re-Book Hub Center Logo" className="center-logo-img" />
        </div>

        <div className="image-gallery">
          <img src={laptop} alt="Girl with Laptop" className="image-left" />
          <img src={drafter} alt="Drafter" className="image-center-left" />
          <img src={notebooks} alt="Notebooks" className="image-right" />
        </div>
      </main>
    </div>
  );
}

export default HomePage;