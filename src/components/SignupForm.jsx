import { useState } from 'react';

const SignupForm = ({onSignup}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    let valid = true;

  if (!validateEmail(email)) {
    setEmailError('Please enter a valid email.');
    valid = false;
  } else {
    setEmailError('');
  }

  if (password.length < 6) {
    setPasswordError('Password must be at least 6 characters long.');
    valid = false;
  } else {
    setPasswordError('');
  }

  if(valid){
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await onSignup(email, password, displayName); // Pass name
      setSuccess("Signup successful!")
    } catch (err) {
      setError("Error signing up.")
    }finally{
      setIsLoading(false);
    }
  }

};

    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo-container">
            <img src="/logo.png" alt="Logo" className="login-logo" />
          </div>
          <p className="login-title">Create an account using a valid email address and a minimum 6 characters long password.</p>
          <form onSubmit={handleSignup}>
            <input
              type="email"
              placeholder="Email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className="error">{emailError}</p>}
            <input
              type="password"
              placeholder="Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <p className="error">{passwordError}</p>}
            <input
              type="text"
              placeholder="Full Name"
              className="login-input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <button className="login-button" type="submit" disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Sign up'}
            </button>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
          </form>
        </div>
      </div>
    );
    };

export default SignupForm;