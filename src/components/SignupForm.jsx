import { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const auth = getAuth();
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        // Save additional user data to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          createdAt: new Date(),
          notifications: {
            spendThreshold: 0,
          }
        });
  
        setSuccess('Account created !');
      } catch (err) {
        setError(err.message);
      }
    };

    return (
        <div className="p-4 max-w-md mx-auto bg-white shadow rounded">
          <h2 className="text-xl font-semibold mb-4">Create Account</h2>
          <form onSubmit={handleSignup}>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 mb-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 mb-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full bg-green-700 text-white py-2 rounded" type="submit">
              Sign Up
            </button>
            {success && <p className="text-green-600 mt-2">{success}</p>}
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </form>
        </div>
      );
    };

export default SignupForm;