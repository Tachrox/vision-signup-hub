
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { userSignUp, verifyOtp, registerPatient, getUserId } from "@/services";
import { toast } from "@/hooks/use-toast";
import SignUpCredentials from "@/components/signup/SignUpCredentials";
import OTPVerification from "@/components/signup/OTPVerification";
import PatientRegistration from "@/components/signup/PatientRegistration";

enum SignUpStep {
  CREDENTIALS = 'credentials',
  OTP_VERIFICATION = 'otp_verification',
  REGISTRATION = 'registration'
}

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<SignUpStep>(SignUpStep.CREDENTIALS);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [uuid, setUuid] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      navigate("/home");
    }
  }, [navigate]);

  const handleCredentialsSubmit = async (email: string, password: string) => {
    setLoading(true);
    try {
      setCredentials({ email, password });
      const response = await userSignUp(email, password);
      if (response.otp_sent) {
        toast({
          title: "Success",
          description: response.message || "OTP sent successfully. Please verify.",
        });
        setCurrentStep(SignUpStep.OTP_VERIFICATION);
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to send OTP",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (otp: string) => {
    setLoading(true);
    try {
      const response = await verifyOtp(credentials.email, credentials.password, otp);
      if (response.authenticated) {
        toast({
          title: "Success",
          description: response.message || "OTP verified successfully.",
        });
        if (response.uuid) {
          setUuid(response.uuid);
        }
        setCurrentStep(SignUpStep.REGISTRATION);
      } else {
        toast({
          title: "Error",
          description: response.message || "Invalid OTP",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("OTP verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientRegistration = async (formData: any) => {
    setLoading(true);
    try {
      const response = await registerPatient(
        uuid || "new-user",
        formData.name,
        parseInt(formData.age),
        formData.gender,
        formData.email,
        formData.phone,
        formData.address
      );

      if (response.message === "Patient registered successfully" || response.message.includes("success")) {
        toast({
          title: "Success",
          description: "Registration successful. Redirecting to prediction page.",
        });
        setTimeout(() => {
          navigate("/prediction");
        }, 1500);
      } else {
        toast({
          title: "Error",
          description: response.message || "Registration failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const renderStep = () => {
    switch (currentStep) {
      case SignUpStep.CREDENTIALS:
        return (
          <SignUpCredentials
            onSubmit={handleCredentialsSubmit}
            loading={loading}
          />
        );
      case SignUpStep.OTP_VERIFICATION:
        return (
          <OTPVerification
            onVerify={handleOTPVerify}
            onBack={() => setCurrentStep(SignUpStep.CREDENTIALS)}
            loading={loading}
          />
        );
      case SignUpStep.REGISTRATION:
        return (
          <PatientRegistration
            onSubmit={handlePatientRegistration}
            initialEmail={credentials.email}
            loading={loading}
          />
        );
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
