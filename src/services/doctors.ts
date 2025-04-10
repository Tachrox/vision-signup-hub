
import { toast } from "@/hooks/use-toast";

// Base URL for the API
const API_BASE_URL = "http://localhost:5000";

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

// Function to fetch doctors near a location from API
export const getDoctorsNearMe = async (lat?: number, lng?: number): Promise<Doctor[]> => {
  try {
    // Use current location or default to Bangalore coordinates
    const latitude = lat || 12.9716;
    const longitude = lng || 77.5946;
    
    const response = await fetch(`${API_BASE_URL}/nearest_eye_specialists?lat=${latitude}&lng=${longitude}`, {
      method: 'GET'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
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
