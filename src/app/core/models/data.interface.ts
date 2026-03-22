import { StatusEnum } from "./enum/table-data.enum"

export interface Country {
  name: {
    common: string,
    official: string,
    nativeName: {
      [key in string]: {
        official: string,
        common: string
      }
    }
  },
  maps: {
    googleMaps: string,
    openStreetMaps?: string
  },
}

export interface City {
  error: boolean,
  msg: string,
  data: string[]
}

export interface CityData {
  city: string,
  country: string,
  populationCounts: {}[]
}

export interface ChartTimeLine {
  id: number,
  year: string,
  months: Month[],
}

export interface IAxis {
  x: number,
  y: number
}

export interface Month {
  numeric: string,
  alphabetic: string,
  periodic: string
}

export interface NavBarLink {
  name: string,
  route: string,
  icon: string,
  index: number
}

export interface IResponseRatesData {
  interviewsRate: number,
  successRate: number,
  rejsectionRate: number,
}

export interface IStatusMetaData {
  bucket: 'active' | 'passed' | 'rejected';
  stage: 'submitted' | 'engaged' | 'in-progress' | 'closed';
  actionRequired: boolean;
  sentiment: 'positive' | 'neutral' | 'negative';
  followUpAfterDays: number;       // 0 = no follow-up needed
  calendarRelevant: boolean;       // true = triggers calendar event (Option B)
  allowedTransitions: StatusEnum[]; // valid next statuses (agent guardrail)
}

export type TStatusMetaData = Record<StatusEnum, IStatusMetaData>;
