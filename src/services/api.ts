import { toast } from "@/hooks/use-toast";

// Base URL for the API
const API_BASE_URL = "http://localhost:5000";

// Types for API responses
export interface SignInResponse {
  [0]: {
    uuid?: string;
    user_can_login: boolean;
    is_user_valid: boolean;
    is_valid_password: boolean;
  };
}

export interface LoginResponse {
  uuid?: string;
  user_can_login: boolean;
  is_user_valid: boolean;
  is_valid_password: boolean;
}

export interface RegisterResponse {
  message: string;
}

export interface PredictionResponse {
  predicted_class: string;
  confidence: number;
}

export interface PredictionHistoryItem {
  id: number;
  uuid: string;
  predicted_class: string;
  confidence: number;
  timestamp: string;
}

// Store the user's UUID in localStorage
export const storeUserId = (uuid: string) => {
  localStorage.setItem('userId', uuid);
};

// Get the user's UUID from localStorage
export const getUserId = (): string | null => {
  return localStorage.getItem('userId');
};

// Clear the stored UUID (for logout)
export const clearUserId = () => {
  localStorage.removeItem('userId');
};

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  return !!getUserId();
};

// API call functions
export const signIn = async (email: string, password: string): Promise<SignInResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user-signin?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Store UUID if authentication is successful
    if (data[0]?.uuid && data[0]?.is_valid_password) {
      storeUserId(data[0].uuid);
    }
    
    return data;
  } catch (error) {
    console.error("Sign in error:", error);
    toast({
      title: "Error",
      description: "An error occurred during sign in. Please try again.",
      variant: "destructive"
    });
    throw error;
  }
};

// Keeping login for backward compatibility, but it now just calls signIn
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await signIn(email, password);
    return response[0];
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const registerPatient = async (
  uuid: string,
  name: string,
  age: number,
  gender: string,
  email: string,
  phone: string,
  address: string
): Promise<RegisterResponse> => {
  try {
    const formData = new URLSearchParams();
    if (uuid !== "new-user") {
      formData.append('uuid', uuid);
    }
    formData.append('name', name);
    formData.append('age', age.toString());
    formData.append('gender', gender);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('address', address);
    
    const response = await fetch(`${API_BASE_URL}/register-patient`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Register error:", error);
    toast({
      title: "Error",
      description: "An error occurred during registration. Please try again.",
      variant: "destructive"
    });
    throw error;
  }
};

export const predictDisease = async (file: File): Promise<PredictionResponse> => {
  try {
    const uuid = getUserId();
    if (!uuid) {
      throw new Error("User is not logged in");
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uuid', uuid);
    
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Prediction error:", error);
    toast({
      title: "Error",
      description: "An error occurred during prediction. Please try again.",
      variant: "destructive"
    });
    throw error;
  }
};

export const getPatientHistory = async (): Promise<PredictionHistoryItem[]> => {
  try {
    const uuid = getUserId();
    if (!uuid) {
      throw new Error("User is not logged in");
    }
    
    const response = await fetch(`${API_BASE_URL}/prediction-history?uuid=${uuid}`, {
      method: 'GET'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("History fetch error:", error);
    toast({
      title: "Error",
      description: "Failed to fetch patient history. Please try again.",
      variant: "destructive"
    });
    throw error;
  }
};
