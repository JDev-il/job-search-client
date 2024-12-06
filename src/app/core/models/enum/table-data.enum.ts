export enum TableColsEnum {
  'status', 'company', 'position', 'application', 'note', 'hunch'
}
export enum StatusEnum {
  AWAITING_RESPONSE = "Awaiting response..",
  AWAITING_INTERVIEW = "Awaiting interview..",
  AWAITING_HR_DECISION = "Awaiting HR/Tech lead decision..",
  AWAITING_EXAM = "Awaiting Exam..",
  AWAITING_RESULTS = "Awaiting results",
  ARCHIVED = "Archived",
  DECIDED_TO_PASS = "Decided to pass",
  INTERVIEW_SCHEDULED = "Interview scheduled",
  LOW_SALARY = "Below salary expectations",
  REAPPLIED = "Reapplied & waiting response",
  PASSED = "Passed",
  REJECTED = "Rejected",
  PROBABLY_NOT = "Probably not..",
  STILL_WAITING = "Still waiting for reply..",
}

export enum PositionTypeEnum {
  FS = "Fullstack Developer",
  FSS = "Fullstack Developer (Senior)",
  FE = "Frontend Developer",
  FES = "Frontend Developer (Senior)",
  AD = "Angular Developer",
  SWD = "Software Developer",
  SWE = "Software Engineer",
  TL = "Team Lead",
  WD = "Web Developer",
}

export enum PositionStackEnum {
  ANGULAR = "Angular",
  ANGULAR_NODE = "Angular / Node.js",
  ANGULAR_DOTNET = "Angular / .NET / C#",
  ANGULAR_NGRX = "Angular / NGRX",
  GENERIC = "Genric / Unknown",
  REACT = "React.js",
  REACT_NODE = "React.js / Node.js",
  REACT_TS = "React.js / ts",
  AN_RE_VU = "Angular / React / Vue.js",
  ANGULAR_UNK = "Angular / Unknown",
}

export enum PlatformEnum {
  HR_REACH = "HR Reached Me",
  HR_SELF = "HR Self Reach",
  LINKEDIN = "LinkedIn",
  GLASSDOOR = "GlassDoor",
  ALLJOBS = "AllJobs",
  DRUSHIM = "Drushim",
  JOBINFO = "JobInfo",
  DIALOG = "Dialog",
  SQLINK = "SQLink",
  ETHOSIA = "Ethosia",
  GOTFRIENDS = "GotFriends",
  FACEBOOK = "Facebook",
  DE = "Direct Email",
  DM = "Direct Message",
  CAREER = "Career Page",
}

