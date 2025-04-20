
import { toast } from "@/hooks/use-toast";
import { API_BASE_URL } from "./config";
import { storeUserId } from "./storage";

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

export interface SignUpResponse {
  otp_sent: boolean;
  message: string;
  error?: string;
}

export const signIn = async (email: string, password: string): Promise<SignInResponse> => {
  try {
    console.log(`Attempting login with endpoint: ${API_BASE_URL}/user-login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
    
    const response = await fetch(`${API_BASE_URL}/user-login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Login response:", data);
    
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

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await signIn(email, password);
    return response[0];
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

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
