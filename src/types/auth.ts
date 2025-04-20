
export enum SignUpStep {
  CREDENTIALS = 'credentials',
  OTP_VERIFICATION = 'otp_verification',
  REGISTRATION = 'registration'
}

export interface PatientFormData {
  name: string;
  age: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
}
