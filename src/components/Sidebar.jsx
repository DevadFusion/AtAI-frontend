import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <div className="sidebar-logo-container">
        <img src="/logo.png" alt="AtAI Logo" className="sidebar-logo" />
        <h1 className="sidebar-title"></h1>
      </div>
      <ul className="sidebar-nav-list">
        <li className="sidebar-nav-item">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `sidebar-nav-link ${isActive ? "active" : ""}`
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li className="sidebar-nav-item">
          <NavLink
            to="/campaigns"
            className={({ isActive }) =>
              `sidebar-nav-link ${isActive ? "active" : ""}`
            }
          >
            Campaigns
          </NavLink>
        </li>
        <li className="sidebar-nav-item">
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `sidebar-nav-link ${isActive ? "active" : ""}`
            }
          >
            Analytics
          </NavLink>
        </li>
        <li className="sidebar-nav-item">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `sidebar-nav-link ${isActive ? "active" : ""}`
            }
          >
            Settings
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;