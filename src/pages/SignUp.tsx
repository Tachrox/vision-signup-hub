
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { userSignUp, verifyOtp, registerPatient } from "@/services";
import { toast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

enum SignUpStep {
  CREDENTIALS = 'credentials',
  OTP_VERIFICATION = 'otp_verification',
  REGISTRATION = 'registration'
}

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<SignUpStep>(SignUpStep.CREDENTIALS);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    email: "",
    phone: "",
    address: "",
  });
  
  const navigate = useNavigate();

  const handleCredentialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handlePatientFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitCredentials = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("Submitting credentials:", credentials);
      const response = await userSignUp(credentials.email, credentials.password);
      console.log("SignUp response:", response);
      
      if (response.otp_sent) {
        toast({
          title: "Success",
          description: response.message || "OTP sent successfully. Please verify.",
        });
        // Move to OTP verification step
        setCurrentStep(SignUpStep.OTP_VERIFICATION);
        // Pre-fill the email in the registration form
        setFormData(prev => ({ ...prev, email: credentials.email }));
      } else if (response.error) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Warning",
          description: response.message || "Failed to send OTP. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message || "An error occurred during sign up.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("Verifying OTP:", { email: credentials.email, password: credentials.password, otp });
      const response = await verifyOtp(credentials.email, credentials.password, otp);
      console.log("OTP verification response:", response);
      
      if (response.authenticated) {
        toast({
          title: "Success",
          description: response.message || "OTP verified successfully.",
        });
        // Move to registration step
        setCurrentStep(SignUpStep.REGISTRATION);
      } else {
        toast({
          title: "Error",
          description: response.message || "Invalid or expired OTP.",
          variant: "destructive"
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message || "An error occurred during OTP verification.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("Submitting registration form:", formData);
      const response = await registerPatient(
        credentials.email, // Using email as uuid
        formData.name,
        parseInt(formData.age),
        formData.gender,
        formData.email,
        formData.phone,
        formData.address
      );
      console.log("Registration response:", response);
      
      if (response.message === "Patient registered successfully") {
        toast({
          title: "Success",
          description: "Patient registered successfully. Redirecting to sign in.",
        });
        navigate("/signin");
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to register patient",
          variant: "destructive"
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message || "An error occurred during registration.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Render different steps based on current step
  const renderStep = () => {
    switch (currentStep) {
      case SignUpStep.CREDENTIALS:
        return (
          <form onSubmit={handleSubmitCredentials} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  className="border-slate-200 pl-10"
                  value={credentials.email}
                  onChange={handleCredentialsChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="border-slate-200 pl-10"
                  value={credentials.password}
                  onChange={handleCredentialsChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Continue"}
            </Button>
          </form>
        );
        
      case SignUpStep.OTP_VERIFICATION:
        return (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-4">
              <Label htmlFor="otp">Enter the OTP sent to your email</Label>
              <div className="flex justify-center py-2">
                <InputOTP 
                  maxLength={6} 
                  value={otp} 
                  onChange={(value) => setOtp(value)}
                  render={({ slots }) => (
                    <InputOTPGroup>
                      {slots.map((slot, index) => (
                        <InputOTPSlot key={index} {...slot} index={index} />
                      ))}
                    </InputOTPGroup>
                  )}
                />
              </div>
              <p className="text-sm text-center text-gray-500">
                Check your email for a 6-digit code and enter it above
              </p>
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 mt-4"
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
            <div className="text-center mt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(SignUpStep.CREDENTIALS)}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                Back to Sign Up
              </button>
            </div>
          </form>
        );
        
      case SignUpStep.REGISTRATION:
        return (
          <form onSubmit={handleSubmitRegistration} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                required
                className="border-slate-200"
                value={formData.name}
                onChange={handlePatientFormChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="25"
                  required
                  className="border-slate-200"
                  value={formData.age}
                  onChange={handlePatientFormChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  name="gender"
                  required
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={formData.gender}
                  onChange={handlePatientFormChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                className="border-slate-200"
                value={formData.email}
                onChange={handlePatientFormChange}
                readOnly
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="1234567890"
                required
                className="border-slate-200"
                value={formData.phone}
                onChange={handlePatientFormChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="123 Main St, City"
                required
                className="border-slate-200"
                value={formData.address}
                onChange={handlePatientFormChange}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Registering..." : "Complete Registration"}
            </Button>
          </form>
        );
    }
  };

  // Determine title based on current step
  const getStepTitle = () => {
    switch (currentStep) {
      case SignUpStep.CREDENTIALS:
        return "Sign Up";
      case SignUpStep.OTP_VERIFICATION:
        return "Verify OTP";
      case SignUpStep.REGISTRATION:
        return "Patient Registration";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 text-blue-500" />
          {currentStep === SignUpStep.CREDENTIALS && (
            <>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Sign up to access health predictions and personalized care
              </p>
            </>
          )}
          {currentStep === SignUpStep.OTP_VERIFICATION && (
            <>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                Verify your email
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Enter the OTP sent to your email
              </p>
            </>
          )}
          {currentStep === SignUpStep.REGISTRATION && (
            <>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                Complete your profile
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Please provide your details to complete registration
              </p>
            </>
          )}
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">{getStepTitle()}</CardTitle>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
          {currentStep === SignUpStep.CREDENTIALS && (
            <CardFooter className="justify-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/signin" className="text-blue-500 hover:text-blue-700">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
