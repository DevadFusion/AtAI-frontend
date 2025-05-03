const SettingsSection = ({ title, children }) => (
    <div className="settings-section">
      <h3 className="settings-section-title">{title}</h3>
      {children}
    </div>
  );
  
  export default SettingsSection;  