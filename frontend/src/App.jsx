import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "../supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import Sell from "./sell";
import ShopPage from "./shop";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home';
import About from './About';
import ProductDetails from "./ProductDetails";
import ChatBox from "./chatbox";
import { UserContext } from "./contextprovider";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Handle OAuth redirect
    const handleOAuthRedirect = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session);
      }
    };

    handleOAuthRedirect();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  console.log(session?.user?.email);
 const email = session?.user?.email;

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
  };

  const signUp = async () => {
    // Determine the redirect URL based on environment
    const redirectUrl = window.location.origin;
    
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl
      }
    });
  };

  if (!session) {
    return (
      <>
        <Router basename="/">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Router>
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
          <Auth 
            supabaseClient={supabase} 
            appearance={{ theme: ThemeSupa }} 
            providers={['google']}
            redirectTo={window.location.origin}
          />
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button onClick={signUp} style={{ padding: '10px 20px', backgroundColor: '#4285f4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Sign in with Google
            </button>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <UserContext.Provider value={email}>
        <div>
          <h2 className="welcome-text">Welcome, {session?.user?.email}</h2>
          <h3 className="textdisplay">Give your used stationery a second story — and help someone start theirs.</h3>
          <Router basename="/">
            <Routes>
              <Route path="/chatbox" element={<ChatBox />} />
              <Route path="/" element={<ShopPage />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/product/:id" element={<ProductDetails />} />
            </Routes>
          </Router>
          <div className="center-container">
            <button className="aboutus-btn" onClick={signOut}>
              Sign out
            </button>
            <footer className="shop-footer">
              <p>© 2025 The Re-Book Hub. All rights reserved.</p>
            </footer>
          </div>
        </div>
      </UserContext.Provider>
    );
  }
}

export default App;