
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface OTPVerificationProps {
  onVerify: (otp: string) => Promise<void>;
  onBack: () => void;
  loading: boolean;
}

const OTPVerification = ({ onVerify, onBack, loading }: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onVerify(otp);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </Button>
      <div className="text-center mt-2">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          Back to Sign Up
        </button>
      </div>
    </form>
  );
};

export default OTPVerification;
