
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 p-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
        AI Eye Disease Prediction
      </h1>
      <p className="text-xl text-gray-600 mb-8 text-center max-w-2xl">
        Advanced AI-powered platform for early detection and prediction of eye diseases
      </p>
      <div className="space-x-4">
        <Button asChild className="bg-blue-500 hover:bg-blue-600">
          <Link to="/signup">Get Started</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/signin">Sign In</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
