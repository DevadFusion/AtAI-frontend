const Campaigns = ({ campaigns }) => {
    return (
      <div>
        <h2 className="text-2xl font-bold text-primary mb-6">Campaigns</h2>
        <table className="w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-green-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Platform</th>
              <th className="p-2 text-left">Spend</th>
              <th className="p-2 text-left">Clicks</th>
              <th className="p-2 text-left">ROAS</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(campaign => (
              <tr key={campaign.id}>
                <td className="p-2">{campaign.name}</td>
                <td className="p-2">{campaign.platform}</td>
                <td className="p-2">${campaign.spend.toFixed(2)}</td>
                <td className="p-2">{campaign.clicks}</td>
                <td className="p-2">{campaign.roas.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default Campaigns;