import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, GoogleAuthProvider, signInWithPopup } from "../firebase";

const Login = ({ handleLogin, handleResetPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetError, setResetError] = useState('');
  const navigate = useNavigate();

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await handleLogin(email, password);
      setSuccess('Login successful!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid credentials.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;
      console.log("User logged in with Google:", user);
      // Redirect to dashboard after successful login
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error", error);
    }
  };

  const onSubmitReset = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');
    const result = await handleResetPassword(resetEmail);
    if (result.success) {
      setResetSuccess(result.message);
    } else {
      setResetError(result.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo-container">
          <img src="/logo.png" alt="Logo" className="login-logo" />
        </div>
        <p className="login-title">We’ll check if you have an account, and help create one if you don’t.</p>

        <form onSubmit={onSubmitLogin}>
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="login-button">
            Login
          </button>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
        </form>

        <p className="forgot-password" onClick={() => setShowReset(true)}>
          Forgot Password?
        </p>
        {showReset && (
          <form onSubmit={onSubmitReset}>
            <input
              type="email"
              placeholder="Enter your email"
              className="login-input"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <button className="login-button" type="submit">Send Reset Link</button>
            {resetSuccess && <p className="success">{resetSuccess}</p>}
            {resetError && <p className="error">{resetError}</p>}
          </form>
        )}

        <p>Don't have an account? <Link to="/signup" className="create-account-link">Sign up</Link></p>
        {/* Google Login Button */}
        <button className="google-login-btn" onClick={handleGoogleLogin}>
          <img
            src="https://developers.google.com/identity/images/btn_google_signin_dark_normal_web.png"
            alt="Google Sign-In"
            className="google-logo"
          />
        </button>
      </div>
    </div>
  );
};

export default Login;