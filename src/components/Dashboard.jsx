import { useMemo } from "react";
import { useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const Dashboard = ({ campaigns }) => {
  const [metrics, setMetrics] = useState({ spend: 0, clicks: 0, roas: 0, impressions: 0, conversionRate: 0 });

 /* const Dashboard = ({ campaigns }) => {
  const totalSpend = useMemo(
    () => campaigns.reduce((sum, campaign) => sum + campaign.spend, 0),
    [campaigns]
  );*/
  
  
    useEffect(() => {
      const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
      const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
      const totalRoas = campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length || 0;
      const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
      const totalConversionRate = campaigns.reduce((sum, c) => sum + c.conversionRate, 0) / campaigns.length || 0;
      setMetrics({ spend: totalSpend, clicks: totalClicks, roas: totalRoas, impressions: totalImpressions, conversionRate: totalConversionRate });
    }, [campaigns]);

    const performanceData = {
      labels: campaigns.map(c => c.name),
      datasets: [{
        label: 'ROAS',
        data: campaigns.map(c => c.roas),
        borderColor: '#27AE60',
        backgroundColor: 'rgba(39, 174, 96, 0.2)',
      }]
    };
    const audienceData = {
      labels: ['18-24', '25-34', '35-44'],
      datasets: [{
        data: campaigns.map(c => c.audience.age === '18-24' ? 1 : c.audience.age === '25-34' ? 2 : 1),
        backgroundColor: ['#2ECC71', '#27AE60', '#219653'],
      }]
    };
    
    return (
      <div>
        <h2 className="text-2xl font-bold text-primary mb-6">Dashboard</h2>
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow hover:border-primary border">
            <h3 className="text-gray-600">Total Spend</h3>
            <p className="text-xl font-bold">${metrics.spend.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow hover:border-primary border">
            <h3 className="text-gray-600">Clicks</h3>
            <p className="text-xl font-bold">{metrics.clicks}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow hover:border-primary border">
            <h3 className="text-gray-600">ROAS</h3>
            <p className="text-xl font-bold">{metrics.roas.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow hover:border-primary border">
            <h3 className="text-gray-600">Impressions</h3>
            <p className="text-xl font-bold">{metrics.impressions}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow hover:border-primary border">
          <h3 className="text-gray-600">Conversion Rate</h3>
          <p className="text-xl font-bold">{metrics.conversionRate.toFixed(2)}%</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-600 mb-2">Campaign Performance</h3>
          <Line data={performanceData} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-600 mb-2">Audience Breakdown</h3>
          <Pie data={audienceData} />
        </div>
      </div>
    </div>
  );
};


export default Dashboard;