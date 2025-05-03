import { useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import * as tf from '@tensorflow/tfjs';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
// Register the elements
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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
    const totalRoas = campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length;
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
    const totalConversionRate = campaigns.reduce((sum, c) => sum + c.conversionRate, 0) / campaigns.length;

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

  if (!campaigns.length) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="dashboard-container p-6 space-y-8">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      {/* Metrics row */}
      <div className="flex flex-wrap gap-4">
        {[
          { title: 'Spend', value: `$${metrics.spend.toFixed(2)}` },
          { title: 'Clicks', value: metrics.clicks.toLocaleString() },
          { title: 'ROAS', value: metrics.roas.toFixed(2) },
          { title: 'Impressions', value: metrics.impressions.toLocaleString() },
          { title: 'Conv. Rate', value: `${metrics.conversionRate.toFixed(2)}%` },
        ].map(({ title, value }) => (
          <div key={title} className="dashboard-card p-4 rounded-2xl shadow bg-white flex-1 min-w-[150px]">
            <div className="text-sm text-gray-500">{title}</div>
            <div className="text-lg font-semibold">{value}</div>
          </div>
        ))}
      </div>

      {recommendation && (
        <div className="dashboard-card p-4 rounded-2xl shadow bg-white">
          <h3 className="text-md font-semibold mb-1">AI Recommendation</h3>
          <p className="text-gray-700">{recommendation}</p>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="dashboard-card p-4 rounded-2xl shadow bg-white h-80">
          <h3 className="text-md font-semibold mb-2">Campaign Performance</h3>
          <div className="h-full">
            <Line data={performanceData} options={chartOptions} />
          </div>
        </div>
        <div className="dashboard-card p-4 rounded-2xl shadow bg-white h-80">
          <h3 className="text-md font-semibold mb-2">Audience Breakdown</h3>
          <div className="h-full">
            <Pie data={audienceData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
