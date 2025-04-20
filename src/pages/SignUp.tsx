
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userSignUp, verifyOtp, registerPatient, getUserId } from "@/services";
import { toast } from "@/hooks/use-toast";
import { SignUpStep } from "@/types/auth";
import SignUpSteps from "@/components/signup/SignUpSteps";
import SignUpLayout from "@/components/signup/SignUpLayout";

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
        return "Create your account";
      case SignUpStep.OTP_VERIFICATION:
        return "Verify your email";
      case SignUpStep.REGISTRATION:
        return "Complete your profile";
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case SignUpStep.CREDENTIALS:
        return "Sign up to access health predictions and personalized care";
      case SignUpStep.OTP_VERIFICATION:
        return "Enter the OTP sent to your email";
      case SignUpStep.REGISTRATION:
        return "Please provide your details to complete registration";
    }
  };

  return (
    <SignUpLayout
      title={getStepTitle()}
      subtitle={getStepSubtitle()}
      showFooter={currentStep === SignUpStep.CREDENTIALS}
    >
      <SignUpSteps
        currentStep={currentStep}
        loading={loading}
        credentials={credentials}
        onCredentialsSubmit={handleCredentialsSubmit}
        onOTPVerify={handleOTPVerify}
        onPatientRegistration={handlePatientRegistration}
        onBack={() => setCurrentStep(SignUpStep.CREDENTIALS)}
      />
    </SignUpLayout>
  );
};

export default SignUp;
