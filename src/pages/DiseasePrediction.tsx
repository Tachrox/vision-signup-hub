
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const DiseasePrediction = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
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
                </div>
              </div>
              
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
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DiseasePrediction;
