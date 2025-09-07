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
