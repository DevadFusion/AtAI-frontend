const Analytics = ({ campaigns }) => {
    return (
      <div className="flex">
        <div className="w-2/3">
          <h2 className="text-2xl font-bold text-primary mb-6">Analytics</h2>
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
        <div className="w-1/3 pl-4">
          <h3 className="text-xl font-bold text-primary mb-4">AI Chatbot</h3>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-600">Ask about your campaigns...</p>
            <input type="text" placeholder="e.g., What's my top campaign?" className="w-full p-2 mb-2 border rounded" />
            <button className="bg-primary text-white p-2 rounded hover:bg-secondary">Send</button>
            <p className="mt-2 text-gray-600">Chatbot coming soon...</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Analytics;