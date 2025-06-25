import {
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexMarkers,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis
} from 'ng-apexcharts';

export type IChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  fill: ApexFill;
  markers: ApexMarkers;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
}

export interface ChartDataType1 { // x = date string, y = cv quantity, z = data?
  x: string; y: number
}
export interface ChartDataType2 { // x = date string, y = cv quantity, z = data?
  x: string; y: string[]
}
