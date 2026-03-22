export interface JobSearchCriteria {
  location: string;
  roles: string[];
  minYearsExperience: number;
  maxYearsExperience: number;
  technologies: string[];
  remoteOnly?: boolean;
  salaryExpectation?: number;
  otherPreferences?: string;
}

export interface JobSearchFollowUpCircles {
  submitted: number,
  followup: number,
  overdue: number,
}

export interface FollowUpEntry {
  companyName: string;
  status: string;
  daysElapsed: number;
  urgency: 'submitted' | 'followup' | 'overdue';
}
