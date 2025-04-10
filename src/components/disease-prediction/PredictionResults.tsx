
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface PredictionResultsProps {
  prediction: { disease: string; confidence: number } | null;
  onGenerateReport: () => void;
  isGeneratingReport: boolean;
  reportUrl: string | null;
}

export const PredictionResults = ({
  prediction,
  onGenerateReport,
  isGeneratingReport,
  reportUrl
}: PredictionResultsProps) => {
  if (!prediction) return null;

  return (
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
          
          <div className="pt-4 flex flex-col gap-4">
            <Button 
              onClick={onGenerateReport}
              disabled={isGeneratingReport}
              className="w-full flex items-center justify-center gap-2"
            >
              <FileText className="h-4 w-4" />
              {isGeneratingReport ? "Generating Report..." : "Generate Medical Report"}
            </Button>
            
            {reportUrl && (
              <a 
                href={reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-center underline"
              >
                View/Download Medical Report
              </a>
            )}
            
            <p className="text-sm text-gray-600">
              Note: This prediction is provided for informational purposes only. 
              Please consult with a healthcare professional for proper diagnosis.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
