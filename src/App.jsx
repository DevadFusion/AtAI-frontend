import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import {onAuthStateChanged, signInWithEmailAndPassword, sendPasswordResetEmail, createUserWithEmailAndPassword } from "firebase/auth";
import {auth, db} from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ThemeProvider } from "./components/ThemeContext";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Campaigns from "./components/Campaigns";
import Analytics from "./components/Analytics";
import Settings from "./components/Settings/Settings";
import Login from "./components/Login";
import SignupForm from "./components/SignupForm";
import Profile from "./components/Profile";

const App = () => {
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [errorSignup, setError] = useState('');
  const [successSignup, setSuccess] = useState('');
//  const auth = getAuth(firebaseApp);

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
      throw error;
    }
  };

  const handleResetPassword = async (e) => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      return { success: true, message: "Password reset email sent!" };
    } catch (err) {
      let message = "Failed to send reset email.";
    if (err.code === "auth/user-not-found") {
      message = "No account found with this email.";
    }else{
      message = err.code;
    }
    return { success: false, message };
    }
  };

  const handleSignup = async (email, password, name) => {
    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Get the authenticated user

      // Store user data in Firestore
      const userRef = doc(db, "users", user.uid); // Reference to the user's document in Firestore

      // Save user data in Firestore
      await setDoc(userRef, {
        email: email, // Store email
        displayName: name,
        notifications: {
          roasDrop: true, // Default value
          spendThreshold: true, // Default value
        },
        spendThreshold: true, // Default value
        threshold: 1700, // Default spend threshold
        createdAt: new Date(), // Timestamp for when the account was created
      });
      console.log("User successfully created!");
    } catch (error) {
      console.error("Signup error: ",error.message);
      throw(error);
    }
  };

  return (
    <ThemeProvider>
      <Router>
      {successSignup && <p>{successSignup}</p>}
      {errorSignup && <p>{errorSignup}</p>}
      {!user ?(
        <Routes>
          <Route path="/signup" element={<SignupForm onSignup={handleSignup} />}/>
          <Route path="*" element={<Login handleLogin={handleLogin} handleResetPassword={handleResetPassword} />}/>
        </Routes>
      ):(
        <div className="app-container">
        <Sidebar />
        <div className="app-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard campaigns={campaigns} />} />
            <Route path="/campaigns" element={<Campaigns campaigns={campaigns} />} />
            <Route path="/analytics" element={<Analytics campaigns={campaigns} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings user={user} />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>
      )}
    </Router>
    </ThemeProvider>
  );
};

export default App;