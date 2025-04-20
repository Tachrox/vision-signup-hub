
import { User } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface SignUpLayoutProps {
  children: React.ReactNode;
  title: string;
  showHeaderContent?: boolean;
  showFooter?: boolean;
  subtitle?: string;
}

const SignUpLayout = ({ 
  children, 
  title,
  showHeaderContent = true,
  showFooter = false,
  subtitle
}: SignUpLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 text-blue-500" />
          {showHeaderContent && (
            <>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                {title}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {subtitle}
              </p>
            </>
          )}
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
          {showFooter && (
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

export default SignUpLayout;
