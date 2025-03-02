
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#3b82f6] to-[#93c5fd] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-blob" />
        </div>

        <div className="mx-auto max-w-6xl py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left animate-fade-in">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
                AI-Powered Eye Disease Detection
              </h1>
              <p className="text-lg leading-8 text-gray-600 mb-8">
                Early detection is crucial for preventing vision loss. Our advanced AI technology helps healthcare professionals identify potential eye conditions with exceptional accuracy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl">
                  <Link to="/signup">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="transform hover:scale-105 transition-all shadow-md hover:shadow-lg">
                  <Link to="/signin">Sign In</Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative transform hover:scale-[1.02] transition-all duration-500">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80"
                alt="Eye Analysis"
                className="rounded-lg shadow-2xl w-full object-cover animate-fade-in"
                style={{ height: '500px' }}
              />
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Early Detection",
                description: "Identify potential eye conditions in their earliest stages for better treatment outcomes."
              },
              {
                title: "High Accuracy",
                description: "Our AI algorithms provide precise and reliable disease prediction you can trust."
              },
              {
                title: "Instant Results",
                description: "Get quick analysis and detailed reports for immediate decision making."
              }
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
