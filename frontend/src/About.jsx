import React from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/'); // Navigate to the About page
  };
  return (
    <div className="about-page">
      <header className="about-header">
        <h1>About Us - The Re-Book Hub</h1>
        <button className="aboutus-btn" onClick={handleButtonClick}>Home</button>
      </header>
      <main className="about-content">
        <section className="about-section">
          <h2>Who We Are</h2>
          <p>
            Welcome to <strong>The Re-Book Hub</strong>, your one-stop destination for buying and selling pre-owned essential Stationary at
            unbeatable prices. We believe in sustainability and affordability, ensuring that every product finds a new home.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            Our mission is to provide a seamless platform where individuals and Students can resell their products effortlessly while
            promoting a circular economy.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Vision</h2>
          <p>
            We envision a future where reselling is the preferred choice for sustainable living, reducing waste and maximizing value for
            everyone.
          </p>
        </section>
      </main>
      <footer className="about-footer">
        <p>© 2025 The Re-Book Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default About;