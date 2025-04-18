import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import firebaseApp from "./firebase";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Campaigns from "./components/Campaigns";
import Analytics from "./components/Analytics";
import Settings from "./components/Settings";
import Login from "./components/Login";

const App = () => {
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const auth = getAuth(firebaseApp);

  //Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  //fetch campaigns from API
  useEffect(() => {
    if (user) {
      const fetchCampaigns = async () => {
        try {
          const response = await fetch(
            "https://us-central1-atai-14440.cloudfunctions.net/api/campaigns"
          );
          const data = await response.json();
          setCampaigns(data);
        } catch (error) {
          console.error("Error fetching campaigns:", error);
        }
      };
      fetchCampaigns();
    }
  }, [user]);

  const handleLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  if (!user) {
    return <Login handleLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="app-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard campaigns={campaigns} />} />
            <Route path="/campaigns" element={<Campaigns campaigns={campaigns} />} />
            <Route path="/analytics" element={<Analytics campaigns={campaigns} />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;