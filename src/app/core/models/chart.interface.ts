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

export interface ProgressTooltipState {
  bucket: string;
  count: string;
  entries: ProgressTooltipEntry[];
  x: number;
  y: number;
}

export interface StatusTooltipState {
  status: string;
  count: string;
  color: string;
  companies: string[];
  x: number;
  y: number;
}

interface ProgressTooltipEntry {
  name: string;
  status: string;
}
