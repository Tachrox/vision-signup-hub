
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface UploadSectionProps {
  onImageSelect: (file: File) => void;
  onPredict: () => void;
  selectedImage: File | null;
  previewUrl: string | null;
  isLoading: boolean;
}

export const UploadSection = ({
  onImageSelect,
  onPredict,
  selectedImage,
  previewUrl,
  isLoading
}: UploadSectionProps) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  const handlePredict = () => {
    if (!selectedImage) {
      toast({
        title: "No Image Selected",
        description: "Please upload a retinal scan to proceed",
        variant: "destructive"
      });
      return;
    }
    onPredict();
  };

  return (
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
  );
};
