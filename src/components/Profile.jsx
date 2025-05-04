import { useState, useEffect } from "react";
import { auth, db } from '../firebase';
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [notifications, setNotifications] = useState({
    roasDrop: false,
    spendThreshold: false,
  });
  const [threshold, setThreshold] = useState(0);

  // Ensure email is updated with current user's email when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (!user) {
        setError('No user logged in');
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserData(userData);
          setNotifications(userData.notifications);
          setThreshold(userData.notifications.threshold || 0); // Ensure fallback if threshold is not set
        } else {
          setError('No user data found');
        }
      } catch (err) {
        setError('Error loading user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle form submission
  const handleUpdate = async (e) => {
    e.preventDefault();  // Prevent form from reloading the page
    const user = auth.currentUser;
    if (!user) {
      setError('No user logged in');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        notifications,
        threshold,
      });
      setError('');  // Clear any previous errors
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000); // Clear success message after 3 seconds
    } catch (err) {
      setError('Error updating user profile');
      setSuccess(''); // Clear success message on error
    }
  };

    // Handle logout
    const handleLogout = async () => {
        try {
        await auth.signOut();
        navigate('/login'); // Redirect to login page after logout
        } catch (err) {
        setError('Error logging out');
        }
    };
  
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>} {/* Display success message */}
      
      {userData && (
        <form onSubmit={handleUpdate} className="profile-form">
          <div>
            <label>Threshold</label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="profile-input"
            />
          </div>

          <div>
            <label>
              ROAS Drop:
              <input
                type="checkbox"
                checked={notifications.roasDrop}
                onChange={(e) => setNotifications({ ...notifications, roasDrop: e.target.checked })}
                className="profile-checkbox"
              />
            </label>
          </div>

          <div>
            <label>
              Spend Threshold:
              <input
                type="checkbox"
                checked={notifications.spendThreshold}
                onChange={(e) => setNotifications({ ...notifications, spendThreshold: e.target.checked })}
                className="profile-checkbox"
              />
            </label>
          </div>

          <button type="submit" className="profile-button">Update Profile</button>
        </form>
      )}

    {/* Logout button */}
    <button onClick={handleLogout} className="logout-button">Logout</button>

    </div>
  );
};

export default Profile;
