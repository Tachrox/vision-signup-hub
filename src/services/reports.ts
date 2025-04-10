
import { toast } from "@/hooks/use-toast";
import { getUserId } from "./auth";

// Base URL for the API
const API_BASE_URL = "http://localhost:5000";

export interface ReportResponse {
  report_url: string;
}

// Function to generate a report for a specific disease
export const generateReport = async (disease: string): Promise<ReportResponse> => {
  try {
    const uuid = getUserId();
    if (!uuid) {
      throw new Error("User is not logged in");
    }
    
    const response = await fetch(`${API_BASE_URL}/report?uuid=${uuid}&disease=${encodeURIComponent(disease)}`, {
      method: 'GET'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Report generation error:", error);
    toast({
      title: "Error",
      description: "Failed to generate report. Please try again.",
      variant: "destructive"
    });
    throw error;
  }
};
