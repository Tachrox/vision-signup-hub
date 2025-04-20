
import { toast } from "@/hooks/use-toast";
import { API_BASE_URL } from "./config";
import { storeUserId } from "./storage";

export interface VerifyOtpResponse {
  authenticated: boolean;
  message: string;
  uuid?: string;
  error?: string;
}

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
