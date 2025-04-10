
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import { predictDisease, generateReport } from "@/services";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { UploadSection } from "@/components/disease-prediction/UploadSection";
import { InfoCard } from "@/components/disease-prediction/InfoCard";
import { PredictionResults } from "@/components/disease-prediction/PredictionResults";

const DiseasePrediction = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<{ disease: string; confidence: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  // Authentication check temporarily disabled
  // if (!isLoggedIn()) {
  //   navigate("/login");
  //   toast({
  //     title: "Authentication Required",
  //     description: "Please log in to access this feature",
  //     variant: "destructive"
  //   });
  // }

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    // Reset prediction when new image is selected
    setPrediction(null);
    setReportUrl(null);
  };

  const handlePredict = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setReportUrl(null); // Reset report URL when making a new prediction
    
    try {
      const result = await predictDisease(selectedImage);
      setPrediction({
        disease: result.predicted_class,
        confidence: result.confidence
      });
      
      toast({
        title: "Prediction Complete",
        description: `Detected: ${result.predicted_class} with ${(result.confidence * 100).toFixed(2)}% confidence`,
      });
    } catch (error) {
      console.error("Prediction error:", error);
      toast({
        title: "Error",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!prediction) {
      toast({
        title: "No Prediction Available",
        description: "Please analyze an image first to generate a report",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingReport(true);
    try {
      const result = await generateReport(prediction.disease);
      setReportUrl(result.report_url);
      
      toast({
        title: "Report Generated",
        description: "Medical report has been generated successfully",
      });
    } catch (error) {
      console.error("Report generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate the medical report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Eye Disease Prediction</h1>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <UploadSection 
                  onImageSelect={handleImageSelect}
                  onPredict={handlePredict}
                  selectedImage={selectedImage}
                  previewUrl={previewUrl}
                  isLoading={isLoading}
                />
              </div>
              
              <div className="space-y-6">
                <InfoCard />
                
                {prediction && (
                  <PredictionResults 
                    prediction={prediction}
                    onGenerateReport={handleGenerateReport}
                    isGeneratingReport={isGeneratingReport}
                    reportUrl={reportUrl}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DiseasePrediction;
