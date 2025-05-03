import { useState } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SettingsSection from './SettingsSection';
import emailjs from '@emailjs/browser';
import { useEffect } from 'react';

const SettingsForm = ({ user, metrics }) => {
  const [settings, setSettings] = useState({
    theme: 'light',
    currency: 'USD',
    notifications: { spendThreshold: false, roasDrop: false, threshold: 1000 },
    campaignFilters: { platform: 'All', dateRange: '30d' },
    autoRefresh: '15m',
    googleAdsApiKey: '',
    useMockData: true,
  });

  const [errors, setErrors] = useState({});

  const handleSimpleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setSettings((prev) => ({ ...prev, [name]: val }));
  };

  const handleNestedChange = (section, name, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [name]: value },
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (settings.notifications.spendThreshold && (!settings.notifications.threshold || settings.notifications.threshold <= 0)) {
      newErrors.threshold = 'Threshold must be a positive number.';
    }
    if (!settings.useMockData && settings.googleAdsApiKey.trim() === '') {
      newErrors.apiKey = 'API key is required when mock data is off.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      await firebase.firestore().collection('users').doc(user.uid).set(settings, { merge: true });
      alert('Settings saved!');
    } catch (error) {
      alert('Error saving settings: ' + error.message);
    }
  };

  const generateReport = async () => {
    const doc = new jsPDF();
    doc.text('AtAI Campaign Report', 20, 20);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    doc.text(`Total Spend: $${metrics.spend.toFixed(2)}`, 20, 40);
    doc.text(`Total Clicks: ${metrics.clicks}`, 20, 50);
    doc.text(`Average ROAS: ${metrics.roas.toFixed(2)}`, 20, 60);

    const charts = document.querySelectorAll('.chart-container');
    let y = 70;
    for (let i = 0; i < charts.length; i++) {
      const canvas = await html2canvas(charts[i]);
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 20, y, 160, 50);
      y += 60;
    }

    doc.save('AtAI_Report.pdf');
  };

  const sendEmailAlert = async (userEmail, campaignName, spend, threshold) => {
    try {
      await emailjs.send(
        'service_ay166vj',
        'template_ruluy5i',
        {
          user_email: userEmail,
          campaign_name: campaignName,
          current_spend: spend,
          threshold: threshold,
        },
        'LhrF1O4ykIrSmnHnI'      // public key
      );
      console.log('Email sent');
    } catch (error) {
      console.error('Email error:', error);
    }
  };
  
  useEffect(() => {
    if (
      settings.notifications.spendThreshold &&
      metrics.spend > settings.notifications.threshold
    ) {
      sendEmailAlert(
        user.email,
        'Campaign Spend Alert',
        metrics.spend,
        settings.notifications.threshold
      );
    }
  }, [metrics.spend, settings.notifications, user.email]);
  

  return (
    <div className="settings-card">
      <SettingsSection title="User Preferences">
        <label>
          Theme:
          <select name="theme" value={settings.theme} onChange={handleSimpleChange} className="settings-select">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <label>
          Currency:
          <select name="currency" value={settings.currency} onChange={handleSimpleChange} className="settings-select">
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </label>
      </SettingsSection>

      <SettingsSection title="Notifications">
        <label>
          <input
            type="checkbox"
            name="spendThreshold"
            checked={settings.notifications.spendThreshold}
            onChange={(e) => handleNestedChange('notifications', 'spendThreshold', e.target.checked)}
          />
          Alert on Spend Threshold ($)
        </label>
        {settings.notifications.spendThreshold && (
          <>
            <input
              type="number"
              value={settings.notifications.threshold}
              onChange={(e) => handleNestedChange('notifications', 'threshold', Number(e.target.value))}
              className="settings-input"
              placeholder="Enter threshold"
            />
            {errors.threshold && <p className="text-red-500">{errors.threshold}</p>}
          </>
        )}
        <label>
          <input
            type="checkbox"
            name="roasDrop"
            checked={settings.notifications.roasDrop}
            onChange={(e) => handleNestedChange('notifications', 'roasDrop', e.target.checked)}
          />
          Alert on ROAS Drop
        </label>
      </SettingsSection>

      <SettingsSection title="Campaign Settings">
        <label>
          Default Platform Filter:
          <select
            value={settings.campaignFilters.platform}
            onChange={(e) => handleNestedChange('campaignFilters', 'platform', e.target.value)}
            className="settings-select"
          >
            <option value="All">All</option>
            <option value="Google">Google</option>
            <option value="Meta">Meta</option>
          </select>
        </label>
        <label>
          Default Date Range:
          <select
            value={settings.campaignFilters.dateRange}
            onChange={(e) => handleNestedChange('campaignFilters', 'dateRange', e.target.value)}
            className="settings-select"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </label>
        <label>
          Auto-Refresh Interval:
          <select name="autoRefresh" value={settings.autoRefresh} onChange={handleSimpleChange} className="settings-select">
            <option value="5m">5 Minutes</option>
            <option value="15m">15 Minutes</option>
            <option value="30m">30 Minutes</option>
          </select>
        </label>
      </SettingsSection>

      <SettingsSection title="Integrations">
        <label>
          Google Ads API Key:
          <input
            type="text"
            name="googleAdsApiKey"
            value={settings.googleAdsApiKey}
            onChange={handleSimpleChange}
            className="settings-input"
            placeholder="Enter API key"
          />
        </label>
        {errors.apiKey && <p className="text-red-500">{errors.apiKey}</p>}
        <label>
          <input
            type="checkbox"
            name="useMockData"
            checked={settings.useMockData}
            onChange={handleSimpleChange}
          />
          Use Mock Data (Testing)
        </label>
      </SettingsSection>

      <SettingsSection title="Reports">
        <button onClick={generateReport} className="settings-button">
          Generate PDF Report
        </button>
      </SettingsSection>

      <button onClick={handleSave} className="settings-button">
        Save Settings
      </button>
    </div>
  );
};

export default SettingsForm;
