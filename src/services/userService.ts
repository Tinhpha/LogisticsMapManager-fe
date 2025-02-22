import { API_BASE_URL } from './apiConfig';
import axios from 'axios';

export interface UserInfo {
  created_at: string;
  email: string;
  full_name: string;
  id: number;
  is_active: boolean;
  is_admin: boolean;
  is_vip: boolean;
  roles: string[];
  updated_at: string;
  username: string;
}

class UserService {
  private static readonly USER_URL = `${API_BASE_URL}/users`;

  static async getCurrentUser(): Promise<UserInfo> {
    console.log('🔍 Fetching current user info');
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${this.USER_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Access-Control-Allow-Origin': '*'
        }
      });

      const userInfo = response.data;
      console.log('✅ User info fetched:', {
        username: userInfo.username,
        roles: userInfo.roles
      });

      // Store username and roles
      localStorage.setItem('username', userInfo.username);
      localStorage.setItem('user_roles', JSON.stringify(userInfo.roles));

      return userInfo;
    } catch (error) {
      console.error('❌ Failed to fetch user info:', error);
      throw error;
    }
  }

  static getStoredUsername(): string | null {
    return localStorage.getItem('username');
  }

  static getStoredRoles(): string[] {
    const roles = localStorage.getItem('user_roles');
    return roles ? JSON.parse(roles) : [];
  }

  static async deleteUser(userId: number): Promise<any> {
    console.log(`[API Request] DELETE ${this.USER_URL}/${userId}`);
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.delete(`${this.USER_URL}/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Access-Control-Allow-Origin': '*'
        }
      });
      console.log(`[API Response] Status: ${response.status}`, response.data);
      return response;
    } catch (error: any) {
      console.error(`[API Error] DELETE ${this.USER_URL}/${userId}:`, error.response || error);
      throw error;
    }
  }
}

export default UserService;
