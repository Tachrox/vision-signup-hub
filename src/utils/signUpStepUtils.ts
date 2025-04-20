
import { SignUpStep } from "@/types/auth";

export const getStepTitle = (step: SignUpStep) => {
  switch (step) {
    case SignUpStep.CREDENTIALS:
      return "Create your account";
    case SignUpStep.OTP_VERIFICATION:
      return "Verify your email";
    case SignUpStep.REGISTRATION:
      return "Complete your profile";
  }
};

export const getStepSubtitle = (step: SignUpStep) => {
  switch (step) {
    case SignUpStep.CREDENTIALS:
      return "Sign up to access health predictions and personalized care";
    case SignUpStep.OTP_VERIFICATION:
      return "Enter the OTP sent to your email";
    case SignUpStep.REGISTRATION:
      return "Please provide your details to complete registration";
  }
};
