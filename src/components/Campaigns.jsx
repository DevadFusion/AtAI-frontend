const Campaigns = ({ campaigns }) => {
  return (
    <div className="campaigns-container">
      <h1 className="campaigns-title">Campaigns</h1>
      <table className="campaigns-table">
        <thead className="campaigns-table-header">
          <tr>
            <th className="campaigns-table-header-cell">Name</th>
            <th className="campaigns-table-header-cell">Spend</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign, index) => (
            <tr key={index} className="campaigns-table-row">
              <td className="campaigns-table-cell">{campaign.name}</td>
              <td className="campaigns-table-cell">${campaign.spend.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Campaigns;