
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, ExternalLink } from "lucide-react";
import { getReportIcon } from "@/services/reports";
import { useEffect, useState } from "react";

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
  const [copied, setCopied] = useState(false);
  const ReportIcon = getReportIcon(reportUrl);
  
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  if (!prediction) return null;

  const handleCopyLink = () => {
    if (reportUrl) {
      navigator.clipboard.writeText(reportUrl)
        .then(() => setCopied(true))
        .catch(err => console.error("Failed to copy:", err));
    }
  };

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
                  className={`h-2.5 rounded-full ${prediction.confidence > 0.7 ? 'bg-green-600' : prediction.confidence > 0.4 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${prediction.confidence * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900">
                {(prediction.confidence * 100).toFixed(2)}%
              </span>
            </div>
          </div>
          
          <div className="pt-4 flex flex-col gap-4">
            {!reportUrl && (
              <Button 
                onClick={onGenerateReport}
                disabled={isGeneratingReport}
                className="w-full flex items-center justify-center gap-2"
              >
                <FileText className="h-4 w-4" />
                {isGeneratingReport ? "Generating Report..." : "Generate Medical Report"}
              </Button>
            )}
            
            {reportUrl && (
              <div className="space-y-3">
                <a 
                  href={reportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                >
                  <ReportIcon className="h-4 w-4" />
                  View Medical Report
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
                
                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={handleCopyLink}
                  >
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={onGenerateReport}
                    disabled={isGeneratingReport}
                  >
                    {isGeneratingReport ? "Generating..." : "Regenerate Report"}
                  </Button>
                </div>
              </div>
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
