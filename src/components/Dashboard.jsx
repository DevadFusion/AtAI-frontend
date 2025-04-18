import { useMemo } from "react";

const Dashboard = ({ campaigns }) => {
  const totalSpend = useMemo(
    () => campaigns.reduce((sum, campaign) => sum + campaign.spend, 0),
    [campaigns]
  );

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2 className="dashboard-card-title">Total Spend</h2>
          <p className="dashboard-card-value">${totalSpend.toLocaleString()}</p>
        </div>
        <div className="dashboard-card">
          <h2 className="dashboard-card-title">Campaigns</h2>
          <p className="dashboard-card-value">{campaigns.length}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;