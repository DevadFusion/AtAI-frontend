import { useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const Dashboard = ({ campaigns }) => {
  const [metrics, setMetrics] = useState({ spend: 0, clicks: 0, roas: 0, impressions: 0, conversionRate: 0 });

  useEffect(() => {
    const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
    const totalRoas = campaigns.length ? campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length : 0;
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
    const totalConversionRate = campaigns.length ? campaigns.reduce((sum, c) => sum + c.conversionRate, 0) / campaigns.length : 0;
    setMetrics({ spend: totalSpend, clicks: totalClicks, roas: totalRoas, impressions: totalImpressions, conversionRate: totalConversionRate });
  }, [campaigns]);

  const performanceData = {
    labels: campaigns.map(c => c.name),
    datasets: [{
      label: 'ROAS',
      data: campaigns.map(c => c.roas),
      borderColor: '#27AE60',
      backgroundColor: 'rgba(39, 174, 96, 0.2)',
    }],
  };

  const audienceData = {
    labels: ['18-24', '25-34', '35-44'],
    datasets: [{
      data: campaigns.map(c => c.audience.age === '18-24' ? 1 : c.audience.age === '25-34' ? 2 : 1),
      backgroundColor: ['#2ECC71', '#27AE60', '#219653'],
    }],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { font: { size: 10 } },
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { font: { size: 8 } } },
      x: { ticks: { font: { size: 8 } } },
    },
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>
      <div className="flex flex-wrap md:flex-nowrap gap-2 mb-4">
        <div className="dashboard-card flex-1 min-w-[80px]">
          <h3 className="dashboard-card-title">Spend</h3>
          <p className="dashboard-card-value">${metrics.spend.toFixed(2)}</p>
        </div>
        <div className="dashboard-card flex-1 min-w-[80px]">
          <h3 className="dashboard-card-title">Clicks</h3>
          <p className="dashboard-card-value">{metrics.clicks}</p>
        </div>
        <div className="dashboard-card flex-1 min-w-[80px]">
          <h3 className="dashboard-card-title">ROAS</h3>
          <p className="dashboard-card-value">{metrics.roas.toFixed(2)}</p>
        </div>
        <div className="dashboard-card flex-1 min-w-[80px]">
          <h3 className="dashboard-card-title">Impressions</h3>
          <p className="dashboard-card-value">{metrics.impressions}</p>
        </div>
        <div className="dashboard-card flex-1 min-w-[80px]">
          <h3 className="dashboard-card-title">Conv. Rate</h3>
          <p className="dashboard-card-value">{metrics.conversionRate.toFixed(2)}%</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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