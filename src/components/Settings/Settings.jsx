import SettingsForm from './SettingsForm';

const Settings = ({ user, metrics }) => (
  <div className="settings-container">
    <h2 className="settings-title">Settings</h2>
    <SettingsForm user={user} metrics={metrics} />
  </div>
);

export default Settings;