
import { toast } from "@/hooks/use-toast";
import { API_BASE_URL } from "./config";

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

export interface SignUpResponse {
  otp_sent: boolean;
  message: string;
  error?: string;
}

export interface VerifyOtpResponse {
  authenticated: boolean;
  message: string;
  error?: string;
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
    // Updated to use user-login endpoint as specified
    const response = await fetch(`${API_BASE_URL}/user-login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Login response:", data);
    
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

// User signup function
export const userSignUp = async (email: string, password: string): Promise<SignUpResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user-signup?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Sign up error:", error);
    toast({
      title: "Error",
      description: "An error occurred during sign up. Please try again.",
      variant: "destructive"
    });
    throw error;
  }
};

// Verify OTP function
export const verifyOtp = async (email: string, password: string, otp: string): Promise<VerifyOtpResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password, otp })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("OTP verification error:", error);
    toast({
      title: "Error",
      description: "An error occurred during OTP verification. Please try again.",
      variant: "destructive"
    });
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
