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
  FS = "Fullstack",
  FSS = "Fullstack (Senior)",
  FE = "Frontend",
  FES = "Frontend (Senior)",
  AD = "Angular",
  SWD = "SW",
  SWE = "SE",
  TL = "Team Lead",
  WD = "Web",
}

export enum PositionStackEnum {
  ANGULAR = "Angular",
  NODE = "Node.js",
  DOTNET = ".NET Core",
  STATE_MANAGEMENT = "REDUX/NGRX",
  UNKNOWN = "N/A",
  REACT = "React.js",
  REACT_TS = "React.js/TypeScript",
  AN_RE_VU = "Angular/React.js/Vue.js",
}

export enum PlatformEnum {
  LINKEDIN = "LinkedIn",
  GLASSDOOR = "GlassDoor",
  DRUSHIM = "Drushim",
  JOBINFO = "JobInfo",
  ALLJOBS = "AllJobs",
  DIALOG = "Dialog",
  REFERRAL = "Referral",
  HR_REACH = "HR Reached Me",
  HR_SELF = "HR Self Reach",
  SQLINK = "SQLink",
  ETHOSIA = "Ethosia",
  GOTFRIENDS = "GotFriends",
  CAREER = "Career Page",
  FACEBOOK = "Facebook",
  EMAIL = "Email",
  DM = "Direct Message",
}

export enum FormPlaceholdersEnum {
  status = "Status",
  companyName = "Company Name",
  companyLocation = "Company Location",
  positionType = "Position Type",
  positionStack = "Position Stack",
  applicationPlatform = "On which platform did you apply?",
  applicationDate = "When did you apply?",
  hunch = "What's your hunch about the application?",
  notes = "Anything to add?"
}
