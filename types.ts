export interface KPI {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface AnalysisResult {
  summary: string;
  kpis: KPI[];
  regionalPerformance: ChartDataPoint[];
  monthlyTrend: ChartDataPoint[];
  topProducts: ChartDataPoint[];
  insights: string[];
}

export enum AppState {
  INPUT = 'INPUT',
  ANALYZING = 'ANALYZING',
  DASHBOARD = 'DASHBOARD',
  ERROR = 'ERROR'
}
