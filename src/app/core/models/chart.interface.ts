import { ChartConfiguration } from 'chart.js';

export type IChartOptions = ChartConfiguration;

export interface ChartDataType1 { // x = date string, y = cv quantity, z = data?
  x: string; y: number
}
export interface ChartDataType2 { // x = date string, y = cv quantity, z = data?
  x: string; y: string[]
}
export interface MarketChartData {
  labels: string[];
  buckets: Record<string, number[]>;
}
