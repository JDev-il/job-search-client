export enum TableColsEnum {
  'status', 'company', 'position', 'application', 'note', 'hunch'
}
export enum StatusEnum {
  AWAITING_RESPONSE = "Awaiting response",
  HR_REACHED_BACK = "HR reached me back",
  AWAITING_DECISION = "Awaiting decision",
  DECIDED_TO_PASS = "Decided to pass",
  LOW_SALARY = "Below salary expectations",
  DID_NOT_PASS_HR = "Didn't pass HR",
  AWAITING_INTERVIEW = "Awaiting interview",
  INTERVIEW_SCHEDULED = "Interview scheduled",
  AWAITING_RESULTS = "Awaiting interview results",
  REJECTED = "Rejected",
  PASSED = "Passed",
  PROBABLY_NOT = "Probably didn't pass",
  REAPPLIED = "Reapplied & awaiting response",
  ARCHIVED = "Archived",
  RECIVED_CONTRACT = "Received a contract"
}

export enum PositionTypeEnum {
  FS = "Fullstack Developer",
  FSS = "Fullstack Developer (Senior)",
  FE = "Frontend Developer",
  FES = "Frontend Developer (Senior)",
  AD = "Angular Developer",
  SWD = "Software Developer",
  TL = "Team Lead",
  WD = "Web Developer",
}

export enum PositionStackEnum {
  ANGULAR = "Angular",
  NODE = "Node.js",
  DOTNET = ".NET Core",
  NGRX = "NgRx",
  NGXS = "NGXS",
  REDUX = "Redux",
  UNKNOWN = "N/A",
  REACT = "React.js",
  REACT_TS = "React / TypeScript",
  VUE = "Vue.js",
  NG_RC_VUE = "Angular, React.js, Vue.js",
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
