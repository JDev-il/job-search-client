import { TStatusMetaData } from "../../core/models/data.interface";
import { StatusEnum } from "../../core/models/enum/table-data.enum";

export const PIPELINE_PENDING = new Set<StatusEnum>([StatusEnum.AWAITING_RESPONSE, StatusEnum.REAPPLIED]);
export const PIPELINE_ACTIVE = new Set<StatusEnum>([StatusEnum.HR_REACHED_BACK, StatusEnum.AWAITING_INTERVIEW, StatusEnum.INTERVIEW_SCHEDULED, StatusEnum.AWAITING_RESULTS, StatusEnum.AWAITING_DECISION]);
export const PIPELINE_PASSED = new Set<StatusEnum>([StatusEnum.PASSED, StatusEnum.RECEIVED_CONTRACT]);
export const PIPELINE_REJECTED = new Set<StatusEnum>([StatusEnum.REJECTED, StatusEnum.DID_NOT_PASS_HR, StatusEnum.PROBABLY_NOT]);
export const PIPELINE_CLOSED = new Set<StatusEnum>([StatusEnum.DECIDED_TO_PASS, StatusEnum.LOW_SALARY, StatusEnum.ARCHIVED]);
export const STATUS_METADATA: TStatusMetaData = {
  [StatusEnum.AWAITING_RESPONSE]: { bucket: 'active', stage: 'submitted', actionRequired: false, sentiment: 'neutral', followUpAfterDays: 7, calendarRelevant: false, allowedTransitions: [StatusEnum.HR_REACHED_BACK, StatusEnum.REJECTED, StatusEnum.REAPPLIED, StatusEnum.DECIDED_TO_PASS, StatusEnum.ARCHIVED] },
  [StatusEnum.REAPPLIED]: { bucket: 'active', stage: 'submitted', actionRequired: false, sentiment: 'neutral', followUpAfterDays: 7, calendarRelevant: false, allowedTransitions: [StatusEnum.AWAITING_RESPONSE, StatusEnum.HR_REACHED_BACK, StatusEnum.REJECTED, StatusEnum.ARCHIVED] },
  [StatusEnum.HR_REACHED_BACK]: { bucket: 'active', stage: 'engaged', actionRequired: true, sentiment: 'positive', followUpAfterDays: 3, calendarRelevant: false, allowedTransitions: [StatusEnum.AWAITING_INTERVIEW, StatusEnum.REJECTED, StatusEnum.DID_NOT_PASS_HR, StatusEnum.DECIDED_TO_PASS] },
  [StatusEnum.AWAITING_INTERVIEW]: { bucket: 'active', stage: 'engaged', actionRequired: true, sentiment: 'positive', followUpAfterDays: 3, calendarRelevant: false, allowedTransitions: [StatusEnum.INTERVIEW_SCHEDULED, StatusEnum.REJECTED, StatusEnum.DECIDED_TO_PASS] },
  [StatusEnum.INTERVIEW_SCHEDULED]: { bucket: 'active', stage: 'in-progress', actionRequired: true, sentiment: 'positive', followUpAfterDays: 0, calendarRelevant: true, allowedTransitions: [StatusEnum.AWAITING_RESULTS, StatusEnum.PASSED, StatusEnum.REJECTED, StatusEnum.DID_NOT_PASS_HR] },
  [StatusEnum.AWAITING_RESULTS]: { bucket: 'active', stage: 'in-progress', actionRequired: false, sentiment: 'positive', followUpAfterDays: 5, calendarRelevant: false, allowedTransitions: [StatusEnum.AWAITING_DECISION, StatusEnum.PASSED, StatusEnum.REJECTED, StatusEnum.PROBABLY_NOT] },
  [StatusEnum.AWAITING_DECISION]: { bucket: 'active', stage: 'in-progress', actionRequired: false, sentiment: 'positive', followUpAfterDays: 5, calendarRelevant: false, allowedTransitions: [StatusEnum.PASSED, StatusEnum.REJECTED, StatusEnum.PROBABLY_NOT, StatusEnum.RECEIVED_CONTRACT] },
  [StatusEnum.PASSED]: { bucket: 'passed', stage: 'closed', actionRequired: false, sentiment: 'positive', followUpAfterDays: 0, calendarRelevant: false, allowedTransitions: [StatusEnum.RECEIVED_CONTRACT, StatusEnum.DECIDED_TO_PASS] },
  [StatusEnum.RECEIVED_CONTRACT]: { bucket: 'passed', stage: 'closed', actionRequired: true, sentiment: 'positive', followUpAfterDays: 0, calendarRelevant: true, allowedTransitions: [StatusEnum.DECIDED_TO_PASS, StatusEnum.ARCHIVED] },
  [StatusEnum.REJECTED]: { bucket: 'rejected', stage: 'closed', actionRequired: false, sentiment: 'negative', followUpAfterDays: 0, calendarRelevant: false, allowedTransitions: [StatusEnum.REAPPLIED, StatusEnum.ARCHIVED] },
  [StatusEnum.DID_NOT_PASS_HR]: { bucket: 'rejected', stage: 'closed', actionRequired: false, sentiment: 'negative', followUpAfterDays: 0, calendarRelevant: false, allowedTransitions: [StatusEnum.REAPPLIED, StatusEnum.ARCHIVED] },
  [StatusEnum.PROBABLY_NOT]: { bucket: 'rejected', stage: 'closed', actionRequired: false, sentiment: 'negative', followUpAfterDays: 0, calendarRelevant: false, allowedTransitions: [StatusEnum.REAPPLIED, StatusEnum.ARCHIVED] },
  [StatusEnum.DECIDED_TO_PASS]: { bucket: 'rejected', stage: 'closed', actionRequired: false, sentiment: 'negative', followUpAfterDays: 0, calendarRelevant: false, allowedTransitions: [StatusEnum.ARCHIVED] },
  [StatusEnum.LOW_SALARY]: { bucket: 'rejected', stage: 'closed', actionRequired: false, sentiment: 'negative', followUpAfterDays: 0, calendarRelevant: false, allowedTransitions: [StatusEnum.DECIDED_TO_PASS, StatusEnum.ARCHIVED] },
  [StatusEnum.ARCHIVED]: { bucket: 'rejected', stage: 'closed', actionRequired: false, sentiment: 'negative', followUpAfterDays: 0, calendarRelevant: false, allowedTransitions: [] },
};
export const STATUS_BUCKET_COLORS: Record<string, string> = {
  [StatusEnum.AWAITING_RESPONSE]: '#a4c2f4',
  [StatusEnum.REAPPLIED]: '#20124d',
  [StatusEnum.HR_REACHED_BACK]: '#ff9375',
  [StatusEnum.AWAITING_INTERVIEW]: '#a2c4c9',
  [StatusEnum.INTERVIEW_SCHEDULED]: '#3d78d8',
  [StatusEnum.AWAITING_RESULTS]: '#ffcb31',
  [StatusEnum.AWAITING_DECISION]: '#2193de',
  [StatusEnum.PASSED]: '#91f3cc',
  [StatusEnum.RECEIVED_CONTRACT]: '#93c47d',
  [StatusEnum.REJECTED]: '#e06666',
  [StatusEnum.DID_NOT_PASS_HR]: '#ff0100',
  [StatusEnum.PROBABLY_NOT]: '#f6b26b',
  [StatusEnum.DECIDED_TO_PASS]: '#dd7e6b',
  [StatusEnum.LOW_SALARY]: '#a64d79',
  [StatusEnum.ARCHIVED]: '#434343',
};
export const BUCKET_COLORS: Record<string, string> = {
  'Pending': STATUS_BUCKET_COLORS[StatusEnum.AWAITING_RESPONSE],
  'Active': STATUS_BUCKET_COLORS[StatusEnum.HR_REACHED_BACK],
  'Passed': STATUS_BUCKET_COLORS[StatusEnum.PASSED],
  'Rejected': STATUS_BUCKET_COLORS[StatusEnum.REJECTED],
  'Decided to pass': STATUS_BUCKET_COLORS[StatusEnum.DECIDED_TO_PASS],
};
export const BUCKET_NAMES = ['Pending', 'Active', 'Passed', 'Rejected', 'Decided to pass'];
