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
  id?: number;
  _id?: string;
  uuid: string;
  predicted_class: string;
  confidence?: number;
  timestamp: string;
}

export interface Doctor {
  name: string;
  specialization: string;
  hospital_name: string;
  address: string;
  lat: number;
  lng: number;
  experience: number;
  contact: string;
  email: string;
  distance_km: number;
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

// Mock function to simulate fetching patient history from API
export const getPatientHistory = async (): Promise<PredictionHistoryItem[]> => {
  try {
    // In a real implementation, this would fetch from your API
    // const uuid = getUserId();
    // if (!uuid) {
    //   throw new Error("User is not logged in");
    // }
    // 
    // const response = await fetch(`${API_BASE_URL}/prediction-history?uuid=${uuid}`, {
    //   method: 'GET'
    // });
    
    // Simulating API response with provided mock data
    const mockData: PredictionHistoryItem[] = [
      {"_id": "67c9f4b5ec43a83acdf79a4d", "uuid": "8c5480a1-6584-4118-8c39-c8b5163e2bf7", "predicted_class": "normal", "timestamp": "2025-03-07 00:47:09"},
      {"_id": "67c9f4beec43a83acdf79a4e", "uuid": "8c5480a1-6584-4118-8c39-c8b5163e2bf7", "predicted_class": "normal", "timestamp": "2025-03-07 00:47:18"},
      {"_id": "67c9f4f7ec43a83acdf79a4f", "uuid": "8c5480a1-6584-4118-8c39-c8b5163e2bf7", "predicted_class": "glaucoma", "timestamp": "2025-03-07 00:48:15"},
      {"_id": "67c9f515ec43a83acdf79a50", "uuid": "8c5480a1-6584-4118-8c39-c8b5163e2bf7", "predicted_class": "cataract", "timestamp": "2025-03-07 00:48:45"},
      {"_id": "67c9f51aec43a83acdf79a51", "uuid": "8c5480a1-6584-4118-8c39-c8b5163e2bf7", "predicted_class": "cataract", "timestamp": "2025-03-07 00:48:50"},
      {"_id": "67c9f52cec43a83acdf79a52", "uuid": "8c5480a1-6584-4118-8c39-c8b5163e2bf7", "predicted_class": "cataract", "timestamp": "2025-03-07 00:49:08"},
      {"_id": "67e047febc90491df659c2f3", "uuid": "8c5480a1-6584-4118-8c39-c8b5163e2bf7", "predicted_class": "cataract", "timestamp": "2025-03-23 23:12:22"}
    ].map(item => ({
      ...item,
      confidence: Math.random() * 0.4 + 0.6 // Adding mock confidence between 0.6 and 1.0
    }));
    
    return mockData;
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

// Mock function to simulate fetching doctors near me from API
export const getDoctorsNearMe = async (): Promise<Doctor[]> => {
  try {
    // In a real implementation, this would fetch from your API
    // const response = await fetch(`${API_BASE_URL}/doctors-near-me`, {
    //   method: 'GET'
    // });
    
    // Simulating API response with provided mock data
    const mockData: Doctor[] = [
      {"name": "Dr. Ravi Shetty", "specialization": "Ophthalmologist", "hospital_name": "Manipal Hospital Mysore", "address": "Abba Road, Mysore", "lat": 12.305, "lng": 76.6602, "experience": 18, "contact": "+91 9123456780", "email": "ravi.shetty@manipalhospital.com", "distance_km": 125.47},
      {"name": "Dr. Anand Kumar", "specialization": "Ophthalmologist", "hospital_name": "Vasan Eye Care", "address": "Devaraj Urs Road, Mysore", "lat": 12.3106, "lng": 76.6521, "experience": 12, "contact": "+91 9876543210", "email": "anand.kumar@vasaneyecare.com", "distance_km": 125.82},
      {"name": "Dr. Meena Rao", "specialization": "Ophthalmologist", "hospital_name": "Nethradhama Super Speciality Eye Hospital", "address": "VV Mohalla, Mysore", "lat": 12.3254, "lng": 76.6402, "experience": 15, "contact": "+91 8765432109", "email": "meena.rao@nethradhama.com", "distance_km": 125.94},
      {"name": "Dr. Shilpa Narayan", "specialization": "Ophthalmologist", "hospital_name": "JSS Hospital", "address": "MG Road, Mysore", "lat": 12.3083, "lng": 76.6455, "experience": 10, "contact": "+91 9988776655", "email": "shilpa.narayan@jsshospital.com", "distance_km": 126.55},
      {"name": "Dr. Ramesh Gowda", "specialization": "Ophthalmologist", "hospital_name": "Columbia Asia Hospital", "address": "Mysore-Hunsur Road, Mysore", "lat": 12.3351, "lng": 76.6256, "experience": 20, "contact": "+91 9876567890", "email": "ramesh.gowda@columbiaasia.com", "distance_km": 126.64}
    ];
    
    return mockData;
  } catch (error) {
    console.error("Doctors fetch error:", error);
    toast({
      title: "Error",
      description: "Failed to fetch doctors near you. Please try again.",
      variant: "destructive"
    });
    throw error;
  }
};
