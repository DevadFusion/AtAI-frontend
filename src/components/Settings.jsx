import { useState } from "react";

const Settings = () => {
  const [username, setUsername] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    // Placeholder for saving settings
    alert(`Settings saved: ${username}`);
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>
      <div className="settings-card">
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="settings-input"
          />
          <button onClick={handleSave} className="settings-button">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;