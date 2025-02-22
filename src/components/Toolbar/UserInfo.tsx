import React from 'react';
import './Toolbar.css';

interface UserInfoProps {
  username: string;
  roles: string[];
}

const getRoleBadgeClass = (role: string): string => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'role-badge role-admin';
    case 'vip':
      return 'role-badge role-vip';
    case 'basic':
      return 'role-badge role-basic';
    default:
      return 'role-badge';
  }
};

const UserInfo: React.FC<UserInfoProps> = ({ username, roles }) => {
  const primaryRole = roles[0] || 'basic'; // Default to 'basic' if no role

  return (
    <div className="user-info">
      <span className="user-name">Welcome, {username}</span>
      <span className={getRoleBadgeClass(primaryRole)}>
        {primaryRole.toUpperCase()}
      </span>
    </div>
  );
};

export default UserInfo;
