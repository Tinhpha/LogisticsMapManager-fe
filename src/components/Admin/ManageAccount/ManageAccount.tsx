import React, { useEffect, useState } from 'react';
import AdminService, { UserListItem } from '../../../services/adminService';
import logo from '../../../assets/logo.svg';
import './ManageAccount.css';
import { useNavigate } from 'react-router-dom';

const ManageAccount: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({
    status: '',
    role: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const users = await AdminService.getAllUsers();
        setUsers(users);
      } catch (error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Failed to fetch users';
        setError(errorMessage);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user: UserListItem) => {
    setEditingId(user.id);
    setEditData({
      status: user.is_active ? 'active' : 'inactive',
      role: user.roles[0] || 'BASIC'
    });
  };

  const handleSave = async () => {
    if (!editingId) return;

    const editingUser = users.find(user => user.id === editingId);
    if (!editingUser) return;

    try {
      const updatedData = {
        id: editingUser.id,
        username: editingUser.username,
        email: editingUser.email,
        full_name: editingUser.full_name,
        is_active: editData.status === 'active',
        roles: [editData.role]
      };

      const response = await AdminService.updateUser(editingId, updatedData);
      
      if (response.status === 200) {
        console.log('[Update User] Successfully updated user:', editingId);
        alert('Cập nhật thông tin thành công');
        
        // Update local state
        setUsers(prevUsers => prevUsers.map(user => 
          user.id === editingId 
            ? { ...user, is_active: updatedData.is_active, roles: updatedData.roles }
            : user
        ));
        
        setEditingId(null);
        setEditData({ status: '', role: '' });
      }
    } catch (error: any) {
      console.error('[Update User] Error:', error.response || error);
      if (error.response?.status === 403) {
        alert('Bạn không có quyền thực hiện thao tác này');
      } else {
        alert('Có lỗi xảy ra khi cập nhật thông tin');
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({
      status: '',
      role: ''
    });
  };

  const handleDelete = async () => {
    if (!editingId) return;
    
    console.log('[Delete User] Starting delete operation for user:', editingId);
    try {
      const response = await AdminService.deleteUser(editingId);
      
      if (response.status === 204) {
        console.log('[Delete User] Successfully deleted user:', editingId);
        alert('Xoá người dùng thành công');
        setUsers(prevUsers => prevUsers.filter(user => user.id !== editingId));
        setEditingId(null);
      }
    } catch (error: any) {
      console.error('[Delete User] Error:', error.response || error);
      if (error.response?.status === 403) {
        alert('Bạn không có quyền thực hiện thao tác này');
      } else {
        alert('Có lỗi xảy ra khi xoá người dùng');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const renderTableRow = (user: UserListItem) => {
    const isEditing = user.id === editingId;

    return (
      <tr key={user.id}>
        <td>{user.id}</td>
        <td>{user.username}</td>
        <td>{user.email}</td>
        <td>{user.full_name}</td>
        <td>
          {isEditing ? (
            <select 
              value={editData.status}
              onChange={(e) => setEditData({...editData, status: e.target.value})}
              className="edit-select"
            >
              <option value="active">ACTIVE</option>
              <option value="inactive">INACTIVE</option>
            </select>
          ) : (
            <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
              {user.is_active ? 'ACTIVE' : 'INACTIVE'}
            </span>
          )}
        </td>
        <td>
          {isEditing ? (
            <select 
              value={editData.role}
              onChange={(e) => setEditData({...editData, role: e.target.value})}
              className="edit-select"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="BASIC">BASIC</option>
              <option value="VIP">VIP</option>
            </select>
          ) : (
            <span className={`role-badge role-${user.roles[0]?.toLowerCase() || 'basic'}`}>
              {user.roles[0]?.toUpperCase() || 'BASIC'}
            </span>
          )}
        </td>
        <td>{formatDate(user.created_at)}</td>
        <td>
          <div className="actions">
            {isEditing ? (
              <>
                <button onClick={handleDelete} className="delete-btn">
                  DELETE
                </button>
                <button onClick={handleCancel} className="cancel-btn">
                  CANCEL
                </button>
                <button onClick={handleSave} className="save-btn">
                  ✓
                </button>
              </>
            ) : (
              <button onClick={() => handleEdit(user)} className="edit-btn">
                EDIT
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  };

  if (isLoading) return (
    <div className="loading">
      <img src={logo} alt="Logo" style={{ width: 40, marginBottom: 16 }} />
      <p>Loading users...</p>
    </div>
  );

  if (error) return (
    <div className="error">
      <p>Error: {error}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  return (
    <div className="manage-account">
      <div className="manage-header">
        <div className="title-section">
          <img src={logo} alt="Logo" className="logo" />
          <h2>User Management</h2>
          <span className="user-count">{users.length} users</span>
        </div>
        <div className="back-button" onClick={() => navigate('/')}>
          Back
        </div>
      </div>

      {users.length === 0 ? (
        <div className="no-users">
          <img src={logo} alt="Logo" style={{ width: 40, marginBottom: 16, opacity: 0.5 }} />
          <div>No users found</div>
        </div>
      ) : (
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Full Name</th>
                <th>Status</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(renderTableRow)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageAccount;
