
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    // Redirect to palmerpartners.com
    window.location.href = "https://palmerpartners.com";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Redirecting...</h1>
        <p className="text-gray-600">You are being redirected to Palmer Partners.</p>
      </div>
    </div>
  );
};

export default Index;
