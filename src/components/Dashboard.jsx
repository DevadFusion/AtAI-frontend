import { useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import * as tf from '@tensorflow/tfjs';

const Dashboard = ({ campaigns }) => {
  const [metrics, setMetrics] = useState({ 
    spend: 0, 
    clicks: 0, 
    roas: 0, 
    impressions: 0, 
    conversionRate: 0 
  });
  
  const [recommendation, setRecommendation] = useState('');

  useEffect(() => {
    if (!campaigns.length) return;
    
    const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
    const totalRoas = campaigns.length ? campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length : 0;
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
    const totalConversionRate = campaigns.length ? campaigns.reduce((sum, c) => sum + c.conversionRate, 0) / campaigns.length : 0;
    
    setMetrics({ 
      spend: totalSpend, 
      clicks: totalClicks, 
      roas: totalRoas, 
      impressions: totalImpressions, 
      conversionRate: totalConversionRate 
    });

    const recommendCampaign = async () => {
      const roasTensor = tf.tensor2d(campaigns.map(c => [c.roas]));
      const maxRoas = tf.max(roasTensor).dataSync()[0];
      const bestCampaign = campaigns.find(c => c.roas === maxRoas);
      setRecommendation(`Increase budget for ${bestCampaign.name} (ROAS: ${bestCampaign.roas})`);
    };
    
    recommendCampaign();
  }, [campaigns]);

  // Dummy chart data (replace with real data)
  const performanceData = {
    labels: campaigns.map(c => c.name),
    datasets: [{
      label: 'Spend',
      data: campaigns.map(c => c.spend),
      borderColor: '#0E3530',
      backgroundColor: 'rgba(14, 53, 48, 0.2)',
    }]
  };

  const audienceData = {
    labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
    datasets: [{
      data: [25, 40, 20, 10, 5],
      backgroundColor: ['#0E3530', '#33584e', '#A7BBAA', '#688B79', '#E3EDE6'],
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };

  if (!campaigns.length) return <div className="dashboard-container">Loading...</div>;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>
      
      {/* Horizontal scrollable metrics row */}
      <div id="metrics-row">
        <div className="dashboard-card">
          <span className="dashboard-card-title">Spend</span>
          <span className="dashboard-card-value">${metrics.spend.toFixed(2)}</span>
        </div>
        <div className="dashboard-card">
          <span className="dashboard-card-title">Clicks</span>
          <span className="dashboard-card-value">{metrics.clicks.toLocaleString()}</span>
        </div>
        <div className="dashboard-card">
          <span className="dashboard-card-title">ROAS</span>
          <span className="dashboard-card-value">{metrics.roas.toFixed(2)}</span>
        </div>
        <div className="dashboard-card">
          <span className="dashboard-card-title">Impressions</span>
          <span className="dashboard-card-value">{metrics.impressions.toLocaleString()}</span>
        </div>
        <div className="dashboard-card">
          <span className="dashboard-card-title">Conv. Rate</span>
          <span className="dashboard-card-value">{metrics.conversionRate.toFixed(2)}%</span>
        </div>
      </div>
  
      {recommendation && (
        <div className="dashboard-card mb-6">
          <h3 className="dashboard-card-title">AI Recommendation</h3>
          <p className="dashboard-card-value">{recommendation}</p>
        </div>
      )}
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="dashboard-card dashboard-chart">
          <h3 className="dashboard-card-title mb-2">Campaign Performance</h3>
          <div className="chart-container">
            <Line data={performanceData} options={chartOptions} />
          </div>
        </div>
        <div className="dashboard-card dashboard-chart">
          <h3 className="dashboard-card-title mb-2">Audience Breakdown</h3>
          <div className="chart-container">
            <Pie data={audienceData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );  
};

export default Dashboard;
