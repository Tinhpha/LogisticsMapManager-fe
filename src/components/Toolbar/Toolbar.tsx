import React from 'react';
import { FaPlus, FaEye, FaSignOutAlt } from 'react-icons/fa';
import './Toolbar.css';

interface ToolbarProps {
  onShowAll: () => void;
  onAddLocation: () => void;
  onLogout: () => void;
  userName: string;
  isLoading?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onShowAll,
  onAddLocation,
  onLogout,
  userName,
  isLoading
}) => {
  return (
    <div className="toolbar">
      <div className="toolbar-buttons">
        <button
          className="toolbar-button"
          onClick={onShowAll}
          title="Show all locations"
        >
          <FaEye />
          <span>Show All</span>
        </button>
        <button
          className="toolbar-button"
          onClick={onAddLocation}
          title="Add new location"
        >
          <FaPlus />
          <span>Add Location</span>
        </button>
      </div>

      <div className="user-section">
        <span className="user-name">Welcome, {userName}</span>
        <button
          className="toolbar-button logout-button"
          onClick={onLogout}
          title="Logout"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
