
import React from "react";

export const InfoCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <img
        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80"
        alt="Professional Eye Scan"
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-lg font-semibold mb-2">AI-Powered Analysis</h3>
      <p className="text-gray-600">
        Our advanced AI technology analyzes retinal scans to detect potential eye conditions with high accuracy.
      </p>
    </div>
  );
};
