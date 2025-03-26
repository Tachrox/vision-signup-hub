
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { predictDisease, isLoggedIn } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DiseasePrediction = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<{ disease: string; confidence: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  if (!isLoggedIn()) {
    navigate("/login");
    toast({
      title: "Authentication Required",
      description: "Please log in to access this feature",
      variant: "destructive"
    });
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // Reset prediction when new image is selected
      setPrediction(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // Reset prediction when new image is selected
      setPrediction(null);
    }
  };

  const handlePredict = async () => {
    if (!selectedImage) {
      toast({
        title: "No Image Selected",
        description: "Please upload a retinal scan to proceed",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Eye Disease Prediction</h1>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Upload Retinal Scan</h2>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    {previewUrl ? (
                      <img 
                        src={previewUrl} 
                        alt="Selected scan" 
                        className="max-w-full h-auto mx-auto rounded-lg mb-4"
                      />
                    ) : (
                      <p className="text-gray-600">Drag and drop your retinal scan image here</p>
                    )}
                    <Input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  
                  <div className="mt-4">
                    <Button 
                      onClick={handlePredict} 
                      className="w-full" 
                      disabled={!selectedImage || isLoading}
                    >
                      {isLoading ? "Analyzing..." : "Predict Disease"}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80"
                    alt="Professional Eye Scan"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-lg font-semibold mb-2">AI-Powered Analysis</h3>
                  <p className="text-gray-600">
                    Our advanced AI technology analyzes retinal scans to detect potential eye conditions with high accuracy.
                  </p>
                </div>
                
                {prediction && (
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl">Prediction Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-500">Detected Condition:</h4>
                          <p className="text-2xl font-bold text-gray-900 capitalize">{prediction.disease}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-500">Confidence Level:</h4>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${prediction.confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {(prediction.confidence * 100).toFixed(2)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <p className="text-sm text-gray-600">
                            Note: This prediction is provided for informational purposes only. 
                            Please consult with a healthcare professional for proper diagnosis.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
