
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,transparent)] pointer-events-none" />
      
      {/* Main content container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - Text content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in">
              AI-Powered Eye Disease Detection
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed animate-fade-in">
              Advanced artificial intelligence for early detection and accurate prediction of eye diseases. Empowering healthcare professionals with cutting-edge technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/signin">Sign In</Link>
              </Button>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="flex-1 relative animate-fade-in">
            <div className="relative w-full max-w-lg mx-auto">
              <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
              <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
              <img 
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80"
                alt="AI Eye Analysis"
                className="relative rounded-lg shadow-2xl w-full object-cover"
                style={{ minHeight: '400px' }}
              />
            </div>
          </div>
        </div>

        {/* Features section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Early Detection</h3>
            <p className="text-gray-600">Identify potential eye conditions in their earliest stages for better treatment outcomes.</p>
          </div>
          <div className="p-6 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">High Accuracy</h3>
            <p className="text-gray-600">State-of-the-art AI algorithms ensuring precise and reliable disease prediction.</p>
          </div>
          <div className="p-6 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Results</h3>
            <p className="text-gray-600">Get quick analysis and detailed reports for immediate decision making.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
