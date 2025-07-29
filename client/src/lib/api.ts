import { apiRequest } from "./queryClient";

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

// Authentication API functions
export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiRequest("POST", "/api/auth/login", credentials);
    const data = await response.json();
    
    // Store token if login successful
    if (data.success && data.token) {
      localStorage.setItem("authToken", data.token);
    }
    
    return data;
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiRequest("POST", "/api/auth/register", userData);
    const data = await response.json();
    
    // Store token if registration successful
    if (data.success && data.token) {
      localStorage.setItem("authToken", data.token);
    }
    
    return data;
  },

  async logout(): Promise<void> {
    try {
      await apiRequest("POST", "/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always remove token from localStorage
      localStorage.removeItem("authToken");
    }
  },

  async verifyToken(): Promise<{ valid: boolean; user?: User }> {
    try {
      const response = await apiRequest("GET", "/api/auth/verify");
      const data = await response.json();
      return { valid: true, user: data.user };
    } catch (error) {
      localStorage.removeItem("authToken");
      return { valid: false };
    }
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiRequest("POST", "/api/auth/refresh");
    const data = await response.json();
    
    if (data.success && data.token) {
      localStorage.setItem("authToken", data.token);
    }
    
    return data;
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const response = await apiRequest("POST", "/api/auth/forgot-password", { email });
    return await response.json();
  },

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const response = await apiRequest("POST", "/api/auth/reset-password", { 
      token, 
      newPassword 
    });
    return await response.json();
  }
};

// User API functions
export const userApi = {
  async getProfile(): Promise<User> {
    const response = await apiRequest("GET", "/api/users/profile");
    const data = await response.json();
    return data.user;
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await apiRequest("PUT", "/api/users/profile", userData);
    const data = await response.json();
    return data.user;
  }
};

// Destinations API functions
export const destinationsApi = {
  async getDestinations(): Promise<any[]> {
    const response = await apiRequest("GET", "/api/destinations");
    const data = await response.json();
    return data.destinations;
  },

  async createDestination(destination: any): Promise<any> {
    const response = await apiRequest("POST", "/api/destinations", destination);
    const data = await response.json();
    return data.destination;
  },

  async updateDestination(id: string, destination: any): Promise<any> {
    const response = await apiRequest("PUT", `/api/destinations/${id}`, destination);
    const data = await response.json();
    return data.destination;
  },

  async deleteDestination(id: string): Promise<void> {
    await apiRequest("DELETE", `/api/destinations/${id}`);
  }
};

// Alerts API functions
export const alertsApi = {
  async getAlerts(): Promise<any[]> {
    const response = await apiRequest("GET", "/api/alerts");
    const data = await response.json();
    return data.alerts;
  },

  async createAlert(alert: any): Promise<any> {
    const response = await apiRequest("POST", "/api/alerts", alert);
    const data = await response.json();
    return data.alert;
  },

  async updateAlert(id: string, alert: any): Promise<any> {
    const response = await apiRequest("PUT", `/api/alerts/${id}`, alert);
    const data = await response.json();
    return data.alert;
  },

  async deleteAlert(id: string): Promise<void> {
    await apiRequest("DELETE", `/api/alerts/${id}`);
  }
};
