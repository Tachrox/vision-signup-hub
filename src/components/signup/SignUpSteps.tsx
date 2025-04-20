
import { SignUpStep } from "@/types/auth";
import SignUpCredentials from "./SignUpCredentials";
import OTPVerification from "./OTPVerification";
import PatientRegistration from "./PatientRegistration";

interface SignUpStepsProps {
  currentStep: SignUpStep;
  loading: boolean;
  credentials: { email: string };
  onCredentialsSubmit: (email: string, password: string) => Promise<void>;
  onOTPVerify: (otp: string) => Promise<void>;
  onPatientRegistration: (formData: any) => Promise<void>;
  onBack: () => void;
}

const SignUpSteps = ({
  currentStep,
  loading,
  credentials,
  onCredentialsSubmit,
  onOTPVerify,
  onPatientRegistration,
  onBack,
}: SignUpStepsProps) => {
  switch (currentStep) {
    case SignUpStep.CREDENTIALS:
      return (
        <SignUpCredentials
          onSubmit={onCredentialsSubmit}
          loading={loading}
        />
      );
    case SignUpStep.OTP_VERIFICATION:
      return (
        <OTPVerification
          onVerify={onOTPVerify}
          onBack={onBack}
          loading={loading}
        />
      );
    case SignUpStep.REGISTRATION:
      return (
        <PatientRegistration
          onSubmit={onPatientRegistration}
          initialEmail={credentials.email}
          loading={loading}
        />
      );
  }
};

export default SignUpSteps;
