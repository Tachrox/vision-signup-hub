
import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getDoctorsNearMe, isLoggedIn, Doctor } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Star, User, Building, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";

const DoctorNearMe = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Authentication check temporarily disabled
    // if (!isLoggedIn()) {
    //   navigate("/signin");
    //   toast({
    //     title: "Authentication Required",
    //     description: "Please log in to access this feature",
    //     variant: "destructive"
    //   });
    //   return;
    // }
    
    const fetchDoctors = async () => {
      try {
        const data = await getDoctorsNearMe();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctors();
  }, [navigate]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center mb-8">
              <MapPin className="h-8 w-8 mr-3 text-blue-500" />
              <h1 className="text-3xl font-bold text-gray-900">Eye Specialists Near You</h1>
            </div>
            
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
                <p className="mt-4">Finding specialists in your area...</p>
              </div>
            ) : doctors.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6 text-center py-10">
                  <p className="text-gray-600">No specialists found in your area.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {doctors.map((doctor, index) => (
                    <Card key={index} className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <div className="border-l-4 border-blue-500">
                        <CardHeader className="pb-2">
                          <CardTitle className="flex justify-between items-center">
                            <div className="font-bold text-xl">{doctor.name}</div>
                            <div className="flex items-center text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              <MapPinned className="h-4 w-4 mr-1" />
                              {doctor.distance_km.toFixed(1)} km
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <User className="h-4 w-4 mr-2 text-blue-500" />
                              <span className="font-medium">{doctor.specialization}</span>
                              <span className="mx-2">•</span>
                              <span>{doctor.experience} years exp.</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <Building className="h-4 w-4 mr-2 text-blue-500" />
                              {doctor.hospital_name}
                            </div>
                            <div className="flex items-start text-sm text-gray-600 mb-3">
                              <MapPin className="h-4 w-4 mr-2 mt-1 text-blue-500 flex-shrink-0" />
                              <span>{doctor.address}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 pt-2 border-t border-gray-100">
                            <Button variant="outline" size="sm" className="flex items-center">
                              <Phone className="h-4 w-4 mr-2" />
                              {doctor.contact}
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center">
                              <Mail className="h-4 w-4 mr-2" />
                              Email
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <Card className="border-0 shadow-lg bg-blue-50 border-none mt-8">
                  <CardContent className="pt-6">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-3 rounded-full mr-4">
                        <Star className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-blue-800 mb-1">Need a consultation?</h3>
                        <p className="text-blue-700">
                          Based on your eye health history, we recommend consulting with an ophthalmologist for a comprehensive check-up.
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

export default DoctorNearMe;
