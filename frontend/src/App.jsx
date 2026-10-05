import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import InsightsSection from "./components/InsightsSection";
import PredictionSection from "./components/PredictionSection";
import Footer from "./components/Footer";


// Read backend URL from .env file
const API_URL = import.meta.env.VITE_API_URL;


function App() {
  // Store backend/model availability
  const [backendOnline, setBackendOnline] = useState(false);


  // Check backend when the application starts
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await axios.get(
          `${API_URL}/health`
        );

        setBackendOnline(true);

      } catch (error) {
        console.error(
          "Backend health check failed:",
          error
        );

        setBackendOnline(false);
      }
    };


    checkBackend();

  }, []);


  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Fixed navigation bar */}
      <Navbar
        backendOnline={backendOnline}
      />


      {/* Landing page */}
      <HeroSection />


      {/* Business-value section */}
      <FeatureSection />


      {/* Model analytics and insights */}
      <InsightsSection />


      {/* Live traffic prediction system */}
      <PredictionSection
        backendOnline={backendOnline}
        setBackendOnline={setBackendOnline}
      />


      {/* Project information */}
      <Footer />

    </div>
  );
}


export default App;