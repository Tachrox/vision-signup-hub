
import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getPatientHistory, isLoggedIn, PredictionHistoryItem } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistance } from "date-fns";

const PatientHistory = () => {
  const [history, setHistory] = useState<PredictionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn()) {
      navigate("/login");
      toast({
        title: "Authentication Required",
        description: "Please log in to access this feature",
        variant: "destructive"
      });
      return;
    }
    
    const fetchHistory = async () => {
      try {
        const data = await getPatientHistory();
        setHistory(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, [navigate]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Patient History</h1>
            
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                <p className="mt-4">Loading your prediction history...</p>
              </div>
            ) : history.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6 text-center py-10">
                  <p className="text-gray-600">You don't have any prediction history yet.</p>
                  <button 
                    onClick={() => navigate("/prediction")} 
                    className="mt-4 text-blue-500 font-medium hover:text-blue-700"
                  >
                    Get your first prediction
                  </button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">Your Prediction History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left pb-3 pl-4 font-medium text-gray-600">#</th>
                            <th className="text-left pb-3 font-medium text-gray-600">Date</th>
                            <th className="text-left pb-3 font-medium text-gray-600">Diagnosis</th>
                            <th className="text-left pb-3 pr-4 font-medium text-gray-600">Confidence</th>
                          </tr>
                        </thead>
                        <tbody>
                          {history.map((item, index) => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                              <td className="py-4 pl-4">{index + 1}</td>
                              <td className="py-4">
                                {new Date(item.timestamp).toLocaleDateString()}
                                <span className="block text-xs text-gray-500">
                                  {formatDistance(new Date(item.timestamp), new Date(), { addSuffix: true })}
                                </span>
                              </td>
                              <td className="py-4 capitalize font-medium">{item.predicted_class}</td>
                              <td className="py-4 pr-4">
                                <div className="flex items-center">
                                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full" 
                                      style={{ width: `${item.confidence * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-sm">
                                    {(item.confidence * 100).toFixed(2)}%
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PatientHistory;
