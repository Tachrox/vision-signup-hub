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
  uuid?: string;
}

export interface SignUpResponse {
  otp_sent: boolean;
  message: string;
  error?: string;
}

export interface VerifyOtpResponse {
  authenticated: boolean;
  message: string;
  uuid?: string;
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
    console.log(`Attempting login with endpoint: ${API_BASE_URL}/user-login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
    
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
    console.log(`Attempting signup with endpoint: ${API_BASE_URL}/user-signup?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
    
    const response = await fetch(`${API_BASE_URL}/user-signup?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Signup error response:", errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Signup response:", data);
    return data;
  } catch (error) {
    console.error("Sign up error:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "An error occurred during sign up. Please try again.",
      variant: "destructive"
    });
    throw error;
  }
};

// Verify OTP function
export const verifyOtp = async (email: string, password: string, otp: string): Promise<VerifyOtpResponse> => {
  try {
    console.log(`Verifying OTP for email: ${email} with OTP: ${otp}`);
    
    const response = await fetch(`${API_BASE_URL}/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password, otp })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("OTP verification error response:", errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("OTP verification response:", data);
    
    // Store UUID if provided in the response
    if (data.uuid) {
      storeUserId(data.uuid);
    }
    
    return data;
  } catch (error) {
    console.error("OTP verification error:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "An error occurred during OTP verification. Please try again.",
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
    console.log(`Registering patient with email: ${email} and uuid: ${uuid}`);
    
    const formData = new URLSearchParams();
    formData.append('uuid', uuid);
    formData.append('name', name);
    formData.append('age', age.toString());
    formData.append('gender', gender);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('address', address);
    
    console.log("Register patient form data:", formData.toString());
    
    const response = await fetch(`${API_BASE_URL}/register-patient`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: formData.toString()
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Register patient error response:", errorData);
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Register patient response:", data);
    
    // Store UUID if provided in the response and not already stored
    if (data.uuid && !getUserId()) {
      storeUserId(data.uuid);
    }
    
    return data;
  } catch (error) {
    console.error("Register error:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "An error occurred during registration. Please try again.",
      variant: "destructive"
    });
    throw error;
  }
};
