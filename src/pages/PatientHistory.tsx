
import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getPatientHistory, isLoggedIn, PredictionHistoryItem } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistance } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";

const PatientHistory = () => {
  const [history, setHistory] = useState<PredictionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn()) {
      navigate("/signin");
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

  const getStatusColor = (diagnosis: string) => {
    switch (diagnosis.toLowerCase()) {
      case 'normal':
        return 'bg-green-500';
      case 'glaucoma':
        return 'bg-amber-500';
      case 'cataract':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center mb-8">
              <Eye className="h-8 w-8 mr-3 text-blue-500" />
              <h1 className="text-3xl font-bold text-gray-900">Eye Health History</h1>
            </div>
            
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
                    <CardTitle className="text-xl">Your Eye Examination History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Diagnosis</TableHead>
                            <TableHead>Confidence</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {history.map((item, index) => (
                            <TableRow key={item._id || index}>
                              <TableCell>
                                <div className="font-medium">
                                  {new Date(item.timestamp).toLocaleDateString()}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatDistance(new Date(item.timestamp), new Date(), { addSuffix: true })}
                                </div>
                              </TableCell>
                              <TableCell className="capitalize font-medium">
                                {item.predicted_class}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                    <div 
                                      className={`${getStatusColor(item.predicted_class)} h-2 rounded-full`} 
                                      style={{ width: `${(item.confidence || 0.8) * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-sm">
                                    {((item.confidence || 0.8) * 100).toFixed(0)}%
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  item.predicted_class.toLowerCase() === 'normal' 
                                    ? 'bg-green-100 text-green-800' 
                                    : item.predicted_class.toLowerCase() === 'glaucoma'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {item.predicted_class.toLowerCase() === 'normal' 
                                    ? 'Healthy' 
                                    : 'Needs Attention'}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-blue-600 mb-1">Total Examinations</p>
                        <p className="text-2xl font-bold">{history.length}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm text-green-600 mb-1">Healthy Results</p>
                        <p className="text-2xl font-bold">
                          {history.filter(item => item.predicted_class.toLowerCase() === 'normal').length}
                        </p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-4">
                        <p className="text-sm text-red-600 mb-1">Conditions Detected</p>
                        <p className="text-2xl font-bold">
                          {history.filter(item => item.predicted_class.toLowerCase() !== 'normal').length}
                        </p>
                      </div>
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
