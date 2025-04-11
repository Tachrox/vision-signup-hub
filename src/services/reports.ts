
import { toast } from "@/hooks/use-toast";
import { getUserId } from "./auth";
import { API_BASE_URL } from "./config";
import { Download, FileText } from "lucide-react";

// Define response interface
export interface ReportResponse {
  report_url: string;
}

/**
 * Function to generate a medical report for a specific disease
 * @param disease - The disease name to generate a report for
 * @returns Promise with the report URL
 */
export const generateReport = async (disease: string): Promise<ReportResponse> => {
  try {
    const uuid = getUserId();
    if (!uuid) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate a report",
        variant: "destructive"
      });
      throw new Error("User is not logged in");
    }
    
    // Show generating toast
    toast({
      title: "Generating Report",
      description: "Please wait while we generate your medical report...",
    });
    
    const response = await fetch(`${API_BASE_URL}/report?uuid=${uuid}&disease=${encodeURIComponent(disease)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Report generation error:", errorText);
      
      throw new Error(
        response.status === 401 ? "Authentication failed" : 
        response.status === 404 ? "Report service not available" : 
        `Failed to generate report (${response.status})`
      );
    }
    
    const data = await response.json();
    
    if (!data.report_url) {
      throw new Error("Invalid response format from report service");
    }
    
    return data;
  } catch (error) {
    console.error("Report generation error:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to generate report. Please try again.",
      variant: "destructive"
    });
    throw error;
  }
};

// Gets icon based on file type
export const getReportIcon = (reportUrl: string | null) => {
  if (!reportUrl) return FileText;
  
  const extension = reportUrl.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return FileText;
    default:
      return Download;
  }
};
