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
  submitted: number, // Extracted day from Date
  followup: number, // equ: Date - submitted Date = days left where target is 8
  overdue: number, // date that will triggers any side-processes, like agents, heavy notifications system (toast/chips), etc.
}

export interface FollowUpEntry {
  companyName: string;
  status: string;
  daysElapsed: number;
  urgency: 'submitted' | 'followup' | 'overdue';
}
