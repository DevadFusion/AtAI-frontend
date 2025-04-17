import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-primary text-white p-4">
      <div className="flex items-center mb-6">
        <img src="/logo.png" alt="AtAI Logo" className="h-8" />
        <h1 className="text-xl font-bold ml-2">AtAI</h1>
      </div>
      <nav>
        <Link to="/dashboard" className="block py-2 px-4 hover:bg-secondary rounded">Dashboard</Link>
        <Link to="/campaigns" className="block py-2 px-4 hover:bg-secondary rounded">Campaigns</Link>
        <Link to="/analytics" className="block py-2 px-4 hover:bg-secondary rounded">Analytics</Link>
        <Link to="/settings" className="block py-2 px-4 hover:bg-secondary rounded">Settings</Link>
      </nav>
    </div>
  );
};

export default Sidebar;