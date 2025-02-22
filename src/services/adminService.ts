import { API_BASE_URL } from './apiConfig';
import axios from 'axios';

export interface UserListItem {
  id: number;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
  is_vip: boolean;
  roles: string[];
  created_at: string;
  updated_at: string;
}

export interface UsersResponse {
  current_page: number;
  pages: number;
  total: number;
  users: UserListItem[];
}

class AdminService {
  private static readonly ADMIN_URL = `${API_BASE_URL}/admin`;
  private static readonly USERS_URL = `${API_BASE_URL}/users`;

  static async getAllUsers(): Promise<UserListItem[]> {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get<UsersResponse>(this.USERS_URL, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Access-Control-Allow-Origin': '*'
        }
      });

      return response.data.users;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('❌ API Error:', {
          status: error.response?.status,
          data: error.response?.data
        });
      }
      throw error;
    }
  }

  static async deleteUser(userId: number): Promise<any> {
    console.log(`[API Request] DELETE ${this.USERS_URL}/${userId}`);
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.delete(`${this.USERS_URL}/${userId}`, {
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
      console.error(`[API Error] DELETE ${this.USERS_URL}/${userId}:`, error.response || error);
      throw error;
    }
  }

  static async updateUser(userId: number, userData: {
    username: string;
    email: string;
    full_name: string;
    is_active: boolean;
    roles: string[];
  }): Promise<any> {
    console.log(`[API Request] PUT ${this.USERS_URL}/${userId}`, userData);
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.put(`${this.USERS_URL}/${userId}`, userData, {
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
      console.error(`[API Error] PUT ${this.USERS_URL}/${userId}:`, error.response || error);
      throw error;
    }
  }
}

export default AdminService;
