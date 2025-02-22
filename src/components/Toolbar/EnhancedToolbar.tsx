import React from 'react';
import { useNavigate } from 'react-router-dom';
import Toolbar from './Toolbar';
import UserInfo from './UserInfo';
import './Toolbar.css';

interface EnhancedToolbarProps {
  onShowAll: () => void;
  onAddLocation: () => void;
  onLogout: () => void;
  userName: string;
  userRoles: string[];
  isLoading?: boolean;
}

const EnhancedToolbar: React.FC<EnhancedToolbarProps> = ({
  onShowAll,
  onAddLocation,
  onLogout,
  userName,
  userRoles,
  isLoading
}) => {
  const navigate = useNavigate();
  const isAdmin = userRoles.includes('admin');

  return (
    <div className="toolbar">
      <div className="toolbar-buttons">
        <button
          className="toolbar-button"
          onClick={onShowAll}
          title="Show all locations"
        >
          <span>Show All</span>
        </button>
        <button
          className="toolbar-button"
          onClick={onAddLocation}
          title="Add new location"
        >
          <span>Add Location</span>
        </button>
        {isAdmin && (
          <button
            className="toolbar-button admin-button"
            onClick={() => navigate('/manage-account')}
            title="Manage Users"
          >
            <span>Manage Users</span>
          </button>
        )}
      </div>

      <div className="user-section">
        <UserInfo username={userName} roles={userRoles} />
        <button
          className="toolbar-button logout-button"
          onClick={onLogout}
          title="Logout"
        >
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default EnhancedToolbar;
