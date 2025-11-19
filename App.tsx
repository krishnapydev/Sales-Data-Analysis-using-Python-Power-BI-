import React, { useState, useCallback } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  LayoutDashboard, FileText, Upload, Wand2, TrendingUp, 
  MapPin, Calendar, AlertCircle, ChevronRight 
} from 'lucide-react';

import { AppState, AnalysisResult } from './types';
import * as geminiService from './services/geminiService';
import LoadingScreen from './components/LoadingScreen';
import KPICard from './components/KPICard';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [rawData, setRawData] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSample = useCallback(async () => {
    try {
      setAppState(AppState.ANALYZING); // Use analyzing state for loading mock data visually if needed, or stay input
      // Actually, let's just set a local loading state for the input box if we wanted, 
      // but here we'll just transition to input with data filled.
      const data = await geminiService.generateSampleData();
      setRawData(data);
      setAppState(AppState.INPUT);
    } catch (e) {
      setError("Failed to generate sample data. Please try again.");
      setAppState(AppState.INPUT);
    }
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!rawData.trim()) {
      setError("Please enter or generate some data first.");
      return;
    }
    setError(null);
    setAppState(AppState.ANALYZING);
    try {
      const result = await geminiService.analyzeSalesData(rawData);
      setAnalysis(result);
      setAppState(AppState.DASHBOARD);
    } catch (e) {
      console.error(e);
      setError("Analysis failed. The data might be too complex or malformed. Try generating sample data.");
      setAppState(AppState.ERROR);
    }
  }, [rawData]);

  const reset = () => {
    setAppState(AppState.INPUT);
    setAnalysis(null);
    setError(null);
  };

  // --- RENDER HELPERS ---

  const renderInputView = () => (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Sales Data Analysis <span className="text-blue-600">Dashboard</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Experience the power of Python & Power BI workflows powered by AI. 
          Clean, analyze, and visualize your sales data in seconds.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="p-1 bg-gray-50 border-b border-gray-200 flex items-center space-x-2 px-4 py-3">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
          <span className="text-xs text-gray-500 font-mono ml-2">data_loader.py</span>
        </div>
        
        <div className="p-6 md:p-8">
          <div className="mb-4 flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">Raw Sales Data (CSV)</label>
            <button 
              onClick={handleGenerateSample}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              <Wand2 className="w-4 h-4 mr-1" /> Auto-Generate Sample
            </button>
          </div>
          
          <textarea 
            value={rawData}
            onChange={(e) => setRawData(e.target.value)}
            placeholder="Paste your CSV data here... or click 'Auto-Generate Sample'"
            className="w-full h-64 p-4 font-mono text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
          />

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleAnalyze}
              disabled={!rawData}
              className={`px-8 py-3 rounded-lg text-white font-semibold shadow-lg flex items-center space-x-2 transition-all transform hover:scale-105 active:scale-95 ${
                !rawData ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Run Analysis</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => {
    if (!analysis) return null;

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Sales Insights</h1>
            </div>
            <button 
              onClick={reset}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center"
            >
              New Analysis <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          
          {/* Summary Section */}
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" /> Executive Summary
            </h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-gray-700 leading-relaxed">
              {analysis.summary}
            </div>
          </div>

          {/* KPIs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            {analysis.kpis.map((kpi, idx) => (
              <KPICard key={idx} data={kpi} />
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* Regional Performance */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-indigo-500" /> Regional Performance
                </h3>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analysis.regionalPerformance}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                      cursor={{fill: '#F3F4F6'}}
                    />
                    <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Trend */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-indigo-500" /> Seasonal Trends
                </h3>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analysis.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8B5CF6" 
                      strokeWidth={3} 
                      dot={{fill: '#8B5CF6', strokeWidth: 2, r: 4, stroke: '#fff'}} 
                      activeDot={{r: 6}}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h3 className="font-bold text-gray-900 flex items-center mb-4 md:mb-0">
                  <TrendingUp className="w-4 h-4 mr-2 text-indigo-500" /> Product Portfolio Mix
                </h3>
                <div className="flex space-x-2">
                  {analysis.insights.map((insight, i) => (
                    <span key={i} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md border border-indigo-100">
                      {insight.length > 40 ? insight.substring(0, 40) + '...' : insight}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center">
                <div className="h-72 w-full md:w-1/2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analysis.topProducts}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {analysis.topProducts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="w-full md:w-1/2 mt-6 md:mt-0 space-y-4 pl-0 md:pl-8">
                  <h4 className="font-semibold text-gray-700 mb-2">Key Product Insights</h4>
                  <ul className="space-y-3">
                    {analysis.insights.map((insight, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600">
                        <div className="mt-1.5 min-w-[6px] h-[6px] rounded-full bg-indigo-500 mr-3"></div>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    );
  };

  return (
    <div className="min-h-screen font-sans bg-[#f3f4f6]">
      {appState === AppState.INPUT && renderInputView()}
      {appState === AppState.ANALYZING && <LoadingScreen />}
      {appState === AppState.DASHBOARD && renderDashboard()}
      {appState === AppState.ERROR && (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-md text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error || "An unknown error occurred."}</p>
            <button 
              onClick={reset}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
