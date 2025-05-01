import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import firebase from 'firebase/app';
import 'firebase/firestore';

const Settings = ({ user, metrics }) => {
  const [settings, setSettings] = useState({
    theme: 'light',
    currency: 'USD',
    notifications: { spendThreshold: false, roasDrop: false, threshold: 1000 },
    campaignFilters: { platform: 'All', dateRange: '30d' },
    autoRefresh: '15m',
    googleAdsApiKey: '',
    useMockData: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setSettings({
        ...settings,
        notifications: { ...settings.notifications, [name]: checked },
      });
    } else {
      setSettings({ ...settings, [name]: value });
    }
  };

  const handleSave = async () => {
    // Save settings to Firestore
    try {
      await firebase.firestore().collection('users').doc(user.uid).set(settings, { merge: true });
      alert('Settings saved!');
    } catch (error) {
      alert('Error saving settings: ' + error.message);
    }
  };

  const generateReport = async () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('AtAI Campaign Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`Total Spend: $${metrics.spend.toFixed(2)}`, 20, 40);
    doc.text(`Total Clicks: ${metrics.clicks}`, 20, 50);
    doc.text(`Average ROAS: ${metrics.roas.toFixed(2)}`, 20, 60);

    // Capture charts
    const charts = document.querySelectorAll('.chart-container');
    let y=70;
    for (let i = 0; i < charts.length; i++) {
      const canvas = await html2canvas(charts[i]);
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 20, y, 160, 50);
      y+= 60;
    }

    doc.save('AtAI_Report.pdf');
  };

  return (
    <div className="settings-container">
      <h2 className="settings-title">Settings</h2>
      <div className="settings-card">
        <div className="settings-section">
          <h3 className="settings-section-title">User Preferences</h3>
          <label className="block mb-2">
            Theme:
            <select
              name="theme"
              value={settings.theme}
              onChange={handleChange}
              className="settings-select"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <label className="block mb-2">
            Currency:
            <select
              name="currency"
              value={settings.currency}
              onChange={handleChange}
              className="settings-select"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </label>
        </div>
        <div className="settings-section">
          <h3 className="settings-section-title">Notifications</h3>
          <label className="block mb-2">
            <input
              type="checkbox"
              name="spendThreshold"
              checked={settings.notifications.spendThreshold}
              onChange={handleChange}
              className="settings-checkbox"
            />
            Alert on Spend Threshold ($)
          </label>
          {settings.notifications.spendThreshold && (
            <input
              type="number"
              name="threshold"
              value={settings.notifications.threshold}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, threshold: e.target.value },
                })
              }
              className="settings-input"
              placeholder="Enter threshold"
            />
          )}
          <label className="block mb-2">
            <input
              type="checkbox"
              name="roasDrop"
              checked={settings.notifications.roasDrop}
              onChange={handleChange}
              className="settings-checkbox"
            />
            Alert on ROAS Drop
          </label>
        </div>
        <div className="settings-section">
          <h3 className="settings-section-title">Campaign Settings</h3>
          <label className="block mb-2">
            Default Platform Filter:
            <select
              name="platform"
              value={settings.campaignFilters.platform}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  campaignFilters: { ...settings.campaignFilters, platform: e.target.value },
                })
              }
              className="settings-select"
            >
              <option value="All">All</option>
              <option value="Google">Google</option>
              <option value="Meta">Meta</option>
            </select>
          </label>
          <label className="block mb-2">
            Default Date Range:
            <select
              name="dateRange"
              value={settings.campaignFilters.dateRange}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  campaignFilters: { ...settings.campaignFilters, dateRange: e.target.value },
                })
              }
              className="settings-select"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </label>
          <label className="block mb-2">
            Auto-Refresh Interval:
            <select
              name="autoRefresh"
              value={settings.autoRefresh}
              onChange={handleChange}
              className="settings-select"
            >
              <option value="5m">5 Minutes</option>
              <option value="15m">15 Minutes</option>
              <option value="30m">30 Minutes</option>
            </select>
          </label>
        </div>
        <div className="settings-section">
          <h3 className="settings-section-title">Integrations</h3>
          <label className="block mb-2">
            Google Ads API Key:
            <input
              type="text"
              name="googleAdsApiKey"
              value={settings.googleAdsApiKey}
              onChange={handleChange}
              className="settings-input"
              placeholder="Enter API key"
            />
          </label>
          <label className="block mb-2">
            <input
              type="checkbox"
              name="useMockData"
              checked={settings.useMockData}
              onChange={handleChange}
              className="settings-checkbox"
            />
            Use Mock Data (Testing)
          </label>
        </div>
        <div className="settings-section">
          <h3 className="settings-section-title">Reports</h3>
          <button onClick={generateReport} className="settings-button">
            Generate PDF Report
          </button>
        </div>
        <button onClick={handleSave} className="settings-button">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;