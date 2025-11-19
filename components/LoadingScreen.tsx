import React, { useEffect, useState } from 'react';
import { Loader2, Database, BarChart2, FileSpreadsheet } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const [step, setStep] = useState(0);
  
  const steps = [
    { icon: FileSpreadsheet, text: "Reading CSV Data..." },
    { icon: Database, text: "Cleaning & Preprocessing with Pandas..." },
    { icon: BarChart2, text: "Generating Power BI Visualizations..." },
    { icon: Loader2, text: "Finalizing Dashboard..." }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex flex-col items-center justify-center h-96 w-full space-y-8 animate-in fade-in duration-500">
      <div className="relative">
        <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin relative z-10" />
      </div>
      
      <div className="space-y-4 w-full max-w-md">
        {steps.map((s, index) => (
          <div 
            key={index} 
            className={`flex items-center space-x-3 transition-all duration-500 ${
              index === step 
                ? 'opacity-100 scale-105 text-blue-700 font-medium' 
                : index < step 
                  ? 'opacity-50 text-gray-500' 
                  : 'opacity-20 text-gray-400'
            }`}
          >
            <s.icon className={`w-5 h-5 ${index === step ? 'animate-bounce' : ''}`} />
            <span>{s.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
