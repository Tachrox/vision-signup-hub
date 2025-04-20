
import { toast } from "@/hooks/use-toast";
import { API_BASE_URL } from "./config";
import { getUserId, storeUserId } from "./storage";

export interface RegisterResponse {
  message: string;
  uuid?: string;
}

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
