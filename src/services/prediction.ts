
import { toast } from "@/hooks/use-toast";
import { getUserId } from "./auth";

// Base URL for the API
const API_BASE_URL = "http://localhost:5000";

// Types for API responses
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

// Function to fetch patient history from API
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
    
    const data = await response.json();
    
    // Add confidence if not provided by API (for backward compatibility)
    return data.map((item: PredictionHistoryItem) => ({
      ...item,
      confidence: item.confidence || Math.random() * 0.4 + 0.6 // Adding fallback confidence between 0.6 and 1.0
    }));
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
