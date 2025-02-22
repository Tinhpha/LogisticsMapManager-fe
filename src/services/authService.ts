import { API_BASE_URL } from './apiConfig';
import axios from 'axios';

interface User {
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

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name: string;
}

interface LoginResponse {
  access_token: string;
  user: User;
}

class AuthService {
  private static readonly AUTH_URL = `${API_BASE_URL}/auth`;

  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const startTime = performance.now();
    console.log('🚀 Login Request:', {
      url: `${this.AUTH_URL}/login`,
      method: 'POST',
      credentials: { ...credentials, password: '******' }
    });

    try {
      const response = await axios.post(`${this.AUTH_URL}/login`, credentials, {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Access-Control-Allow-Origin': '*'
        }
      });

      const endTime = performance.now();
      console.log(`⏱️ Login request took ${Math.round(endTime - startTime)}ms`);
      
      const { data } = response;
      console.log('✅ Login Successful:', {
        status: response.status,
        user: {
          ...data.user,
          full_name: data.user.full_name
        },
        access_token: '******'
      });

      // Store auth data
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('access_token', data.access_token);
      console.log('💾 Auth data stored in localStorage');

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('❌ Login Failed:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
        throw new Error(error.response?.data?.message || error.message || 'Login failed');
      }
      console.error('🔥 Login Error:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  static async register(data: RegisterData): Promise<void> {
    const startTime = performance.now();
    console.log('🚀 Register Request:', {
      url: `${this.AUTH_URL}/register`,
      method: 'POST',
      data: { ...data, password: '******' }
    });

    try {
      const response = await axios.post(`${this.AUTH_URL}/register`, data, {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Access-Control-Allow-Origin': '*'
        }
      });

      const endTime = performance.now();
      console.log(`⏱️ Register request took ${Math.round(endTime - startTime)}ms`);

      console.log('✅ Registration Successful:', {
        status: response.status,
        data: response.data
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('❌ Registration Failed:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
        throw new Error(error.response?.data?.message || error.message || 'Registration failed');
      }
      console.error('🔥 Registration Error:', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  static getStoredAuth(): { user: User | null; access_token: string | null } {
    console.log('🔍 Getting stored auth data');
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('✅ Retrieved stored user:', user);
        return { 
          user, 
          access_token: localStorage.getItem('access_token') 
        };
      } catch (error) {
        console.error('❌ Error parsing stored user:', error);
        return { user: null, access_token: null };
      }
    }
    console.log('ℹ️ No stored user found');
    return { user: null, access_token: null };
  }

  static clearAuth(): void {
    console.log('🗑️ Clearing stored authentication data');
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    console.log('✅ Authentication data cleared');
  }

  // Thêm các phương thức mới nhưng vẫn giữ các phương thức cũ
  static getStoredUser(): User | null {
    const { user } = this.getStoredAuth();
    return user;
  }

  static getStoredToken(): string | null {
    const { access_token } = this.getStoredAuth();
    return access_token;
  }

  static clearStoredAuth(): void {
    this.clearAuth();
  }

  static async loginWithGoogle(): Promise<LoginResponse> {
    try {
      const response = await axios.get(`${this.AUTH_URL}/google/login`, {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Access-Control-Allow-Origin': '*'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  static async loginWithFacebook(): Promise<LoginResponse> {
    try {
      const response = await axios.get(`${this.AUTH_URL}/facebook/login`, {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Access-Control-Allow-Origin': '*'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Facebook login error:', error);
      throw error;
    }
  }
}

export default AuthService;
