import { useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import * as tf from '@tensorflow/tfjs';

const Dashboard = ({ campaigns }) => {
  const [metrics, setMetrics] = useState({ 
    spend: 0, clicks: 0, roas: 0, impressions: 0, conversionRate: 0 
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
      spend: totalSpend, clicks: totalClicks, roas: totalRoas, 
      impressions: totalImpressions, conversionRate: totalConversionRate 
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

  if (!campaigns.length) return <div className="p-4 text-gray-600">Loading...</div>;

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>

      {/* Metrics Row */}
      <div className="flex flex-wrap gap-4">
        {[
          { label: 'Spend', value: `$${metrics.spend.toFixed(2)}` },
          { label: 'Clicks', value: metrics.clicks.toLocaleString() },
          { label: 'ROAS', value: metrics.roas.toFixed(2) },
          { label: 'Impressions', value: metrics.impressions.toLocaleString() },
          { label: 'Conv. Rate', value: `${metrics.conversionRate.toFixed(2)}%` }
        ].map((metric, i) => (
          <div key={i} className="bg-white shadow rounded-2xl p-4 min-w-[150px] flex-1">
            <div className="text-gray-600 text-sm font-medium">{metric.label}</div>
            <div className="text-xl font-bold text-gray-900">{metric.value}</div>
          </div>
        ))}
      </div>

      {/* AI Recommendation */}
      {recommendation && (
        <div className="bg-white shadow rounded-2xl p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-1">AI Recommendation</h3>
          <p className="text-gray-700">{recommendation}</p>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-2xl p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Campaign Performance</h3>
          <div className="h-[300px]">
            <Line data={performanceData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white shadow rounded-2xl p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Audience Breakdown</h3>
          <div className="h-[300px]">
            <Pie data={audienceData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;