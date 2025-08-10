import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "../supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
// import HomePage from "./home";
import Sell from "./sell";
import ShopPage from "./shop";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home';
import About from './About';
import ProductDetails from "./ProductDetails";
import ChatBox from "./chatbox";
import { UserContext } from "./contextprovider";

// import { ChatProvider } from './chatContext';


function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
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
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  if (!session) {
    return (
      <>
        <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        {/* <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />; */}
      </Routes>
    </Router>
    <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
      </>
    );
  } else {
    return (
      <UserContext.Provider value={email}>
        {/* <ChatProvider> */}
      <div>
        <h2 className="welcome-text">Welcome, {session?.user?.email}</h2>
          <h3 className="textdisplay">Give your used stationery a second story — and help someone start theirs.</h3>
        {/* <ShopPage /> */}
        <Router>
      <Routes>
        <Route path="/chatbox" element={<ChatBox />} />
        <Route path="/" element={<ShopPage />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/" element={<ProductDetails />} />
        
        {/* <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />; */}
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
      {/* </ChatProvider> */}
      </UserContext.Provider>
    );
  }
}

export default App;