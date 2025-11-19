import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSampleData = async (): Promise<string> => {
  const ai = getClient();
  // We ask Gemini to generate a CSV string directly for the user to "see" the raw data.
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Generate a realistic CSV dataset (about 20 rows) for a retail electronics store sales analysis. 
    Columns should include: Date, Region, Product, Category, SalesAmount, Quantity.
    Ensure the data shows some clear trends (e.g., seasonal spikes, specific high-performing regions).
    Output ONLY the CSV data, no markdown code blocks.`,
  });

  return response.text.trim();
};

export const analyzeSalesData = async (csvData: string): Promise<AnalysisResult> => {
  const ai = getClient();
  
  const prompt = `
    Act as a Senior Data Analyst using Python and Power BI.
    I have the following raw sales data (CSV format):
    
    ${csvData}

    Perform the following steps:
    1. "Clean" the data (conceptually) and aggregate it.
    2. Calculate key KPIs (Total Revenue, Total Units, Top Region).
    3. Analyze Regional Performance (Sales by Region).
    4. Analyze Monthly/Seasonal Trends (Sales by Month).
    5. Identify Top Performing Products.
    6. Provide a textual summary of insights as if writing a report.

    Return the result strictly as a JSON object matching this schema.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "A concise executive summary of the data." },
          kpis: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                value: { type: Type.STRING },
                change: { type: Type.STRING, description: "e.g., '+12% vs last month' (optional)" },
                trend: { type: Type.STRING, enum: ["up", "down", "neutral"] }
              },
              required: ["label", "value"]
            }
          },
          regionalPerformance: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Region Name" },
                value: { type: Type.NUMBER, description: "Total Sales" }
              },
              required: ["name", "value"]
            }
          },
          monthlyTrend: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Month (e.g., Jan)" },
                value: { type: Type.NUMBER, description: "Total Sales" }
              },
              required: ["name", "value"]
            }
          },
          topProducts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Product Name" },
                value: { type: Type.NUMBER, description: "Total Sales" }
              },
              required: ["name", "value"]
            }
          },
          insights: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of 3-4 specific bullet points about trends or anomalies found."
          }
        },
        required: ["summary", "kpis", "regionalPerformance", "monthlyTrend", "topProducts", "insights"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as AnalysisResult;
};
