import { ChartConfiguration } from 'chart.js';

export type IChartOptions = ChartConfiguration;

export interface ChartDataType1 { // x = date string, y = cv quantity, z = data?
  x: string; y: number
}
export interface ChartDataType2 { // x = date string, y = cv quantity, z = data?
  x: string; y: string[]
}
export interface TimelineChartData {
  labels: string[];
  buckets: Record<string, number[]>;
}

export interface ByStatusTooltipState {
  bucket: string;
  count: string;
  entries: ByStatusTooltipEntry[];
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

interface ByStatusTooltipEntry {
  name: string;
  status: string;
}
