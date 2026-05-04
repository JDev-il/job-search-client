import { IBucketGroup, TBUCKET_NAMES, TStatusMetaData } from "../../core/models/data.interface";
import { ColorBuckets } from "../../core/models/enum/charts.enum";
import { StatusEnum } from "../../core/models/enum/table-data.enum";


export const BUCKET_STRUCTURE: IBucketGroup[] = [
  { name: 'Pending', statuses: [StatusEnum.AWAITING_RESPONSE, StatusEnum.REAPPLIED, StatusEnum.PROBABLY_NOT] },
  { name: 'Active', statuses: [StatusEnum.HR_REACHED_BACK, StatusEnum.AWAITING_INTERVIEW, StatusEnum.INTERVIEW_SCHEDULED, StatusEnum.AWAITING_RESULTS, StatusEnum.AWAITING_DECISION] },
  { name: 'Passed', statuses: [StatusEnum.PASSED, StatusEnum.RECEIVED_CONTRACT, StatusEnum.CONTRACT_ACCEPTED] },
  { name: 'Rejected', statuses: [StatusEnum.REJECTED, StatusEnum.DID_NOT_PASS_HR] },
  { name: 'Uncertain', statuses: [StatusEnum.DECIDED_TO_PASS, StatusEnum.LOW_SALARY, StatusEnum.ARCHIVED, StatusEnum.CONTRACT_DECLINED] },
];

const bucketSet = (name: string): Set<StatusEnum> =>
  new Set(BUCKET_STRUCTURE.find(b => b.name === name)?.statuses ?? []);

export const PIPELINE_PENDING = bucketSet('Pending');
export const PIPELINE_ACTIVE = bucketSet('Active');
export const PIPELINE_PASSED = bucketSet('Passed');
export const PIPELINE_REJECTED = bucketSet('Rejected');
export const PIPELINE_UNCERTAIN = bucketSet('Uncertain');
export const STATUS_METADATA: TStatusMetaData = {
  [StatusEnum.AWAITING_RESPONSE]: { bucket: 'active', stage: 'submitted', actionRequired: false, sentiment: 'neutral', followUpAfterDays: 7, calendarRelevant: false, allowedTransitions: [StatusEnum.HR_REACHED_BACK, StatusEnum.REJECTED, StatusEnum.REAPPLIED, StatusEnum.DECIDED_TO_PASS, StatusEnum.ARCHIVED] },
  [StatusEnum.REAPPLIED]: { bucket: 'active', stage: 'submitted', actionRequired: false, sentiment: 'neutral', followUpAfterDays: 7, calendarRelevant: false, allowedTransitions: [StatusEnum.AWAITING_RESPONSE, StatusEnum.HR_REACHED_BACK, StatusEnum.REJECTED, StatusEnum.ARCHIVED] },
  [StatusEnum.HR_REACHED_BACK]: { bucket: 'active', stage: 'engaged', actionRequired: true, sentiment: 'positive', followUpAfterDays: 3, calendarRelevant: false, allowedTransitions: [StatusEnum.AWAITING_INTERVIEW, StatusEnum.REJECTED, StatusEnum.DID_NOT_PASS_HR, StatusEnum.DECIDED_TO_PASS] },
  [StatusEnum.AWAITING_INTERVIEW]: { bucket: 'active', stage: 'engaged', actionRequired: true, sentiment: 'positive', followUpAfterDays: 3, calendarRelevant: false, allowedTransitions: [StatusEnum.INTERVIEW_SCHEDULED, StatusEnum.REJECTED, StatusEnum.DECIDED_TO_PASS] },
  [StatusEnum.INTERVIEW_SCHEDULED]: { bucket: 'active', stage: 'in-progress', actionRequired: true, sentiment: 'positive', followUpAfterDays: 0, calendarRelevant: true, allowedTransitions: [StatusEnum.AWAITING_RESULTS, StatusEnum.PASSED, StatusEnum.REJECTED, StatusEnum.DID_NOT_PASS_HR] },
  [StatusEnum.AWAITING_RESULTS]: { bucket: 'active', stage: 'in-progress', actionRequired: false, sentiment: 'positive', followUpAfterDays: 5, calendarRelevant: false, allowedTransitions: [StatusEnum.AWAITING_DECISION, StatusEnum.PASSED, StatusEnum.REJECTED, StatusEnum.PROBABLY_NOT] },
  [StatusEnum.AWAITING_DECISION]: { bucket: 'active', stage: 'in-progress', actionRequired: false, sentiment: 'positive', followUpAfterDays: 5, calendarRelevant: false, allowedTransitions: [StatusEnum.PASSED, StatusEnum.REJECTED, StatusEnum.PROBABLY_NOT, StatusEnum.RECEIVED_CONTRACT] },
  [StatusEnum.PASSED]: { bucket: 'passed', stage: 'closed', actionRequired: false, sentiment: 'positive', followUpAfterDays: 0, calendarRelevant: false, allowedTransitions: [StatusEnum.RECEIVED_CONTRACT, StatusEnum.DECIDED_TO_PASS] },
  [StatusEnum.RECEIVED_CONTRACT]: { bucket: 'passed', stage: 'closed', actionRequired: true, sentiment: 'positive', followUpAfterDays: 0, calendarRelevant: true, allowedTransitions: [StatusEnum.CONTRACT_ACCEPTED, StatusEnum.CONTRACT_DECLINED, StatusEnum.DECIDED_TO_PASS, StatusEnum.ARCHIVED] },
  [StatusEnum.REJECTED]: { bucket: 'rejected', stage: 'closed', actionRequired: false, sentiment: 'negative', followUpAfterDays: 0, calendarRelevant: false, allowedTransitions: [StatusEnum.REAPPLIED, StatusEnum.ARCHIVED] },
  [StatusEnum.DID_NOT_PASS_HR]: { bucket: 'rejected', stage: 'closed', actionRequired: false, sentiment: 'negative', followUpAfterDays: 0, calendarRelevant: false, allowedTransitions: [StatusEnum.REAPPLIED, StatusEnum.ARCHIVED] },
  [StatusEnum.PROBABLY_NOT]: { bucket: 'rejected', stage: 'closed', actionRequired: false, sentiment: 'neutral', followUpAfterDays: 0, calendarRelevant: false, allowedTransitions: [StatusEnum.REAPPLIED, StatusEnum.ARCHIVED] },
  [StatusEnum.DECIDED_TO_PASS]: { bucket: 'rejected', stage: 'closed', actionRequired: false, sentiment: 'negative', followUpAfterDays: 0, calendarRelevant: false, allowedTransitions: [StatusEnum.ARCHIVED] },
  [StatusEnum.LOW_SALARY]: { bucket: 'rejected', stage: 'closed', actionRequired: false, sentiment: 'negative', followUpAfterDays: 0, calendarRelevant: false, allowedTransitions: [StatusEnum.DECIDED_TO_PASS, StatusEnum.ARCHIVED] },
  [StatusEnum.ARCHIVED]: { bucket: 'rejected', stage: 'closed', actionRequired: false, sentiment: 'negative', followUpAfterDays: 0, calendarRelevant: false, allowedTransitions: [] },
  [StatusEnum.CONTRACT_ACCEPTED]: { bucket: 'passed', stage: 'closed', actionRequired: false, sentiment: 'positive', followUpAfterDays: 0, calendarRelevant: false, allowedTransitions: [StatusEnum.ARCHIVED] },
  [StatusEnum.CONTRACT_DECLINED]: { bucket: 'rejected', stage: 'closed', actionRequired: false, sentiment: 'neutral', followUpAfterDays: 0, calendarRelevant: false, allowedTransitions: [StatusEnum.ARCHIVED] },
};
export const STATUS_BUCKET_COLORS: Record<string, string> = {
  [StatusEnum.AWAITING_RESPONSE]: '#a4c2f4',
  [StatusEnum.INTERVIEW_SCHEDULED]: '#6c9aea',
  [StatusEnum.AWAITING_INTERVIEW]: '#4e7bc9',
  [StatusEnum.AWAITING_RESULTS]: '#345ca3',
  [StatusEnum.AWAITING_DECISION]: '#214482',
  [StatusEnum.HR_REACHED_BACK]: '#ffdd57',
  [StatusEnum.DID_NOT_PASS_HR]: '#f58787',
  [StatusEnum.DECIDED_TO_PASS]: '#d16b6b',
  [StatusEnum.CONTRACT_DECLINED]: '#c65353',
  [StatusEnum.REJECTED]: '#bc3333',
  [StatusEnum.ARCHIVED]: '#434343',
  [StatusEnum.PASSED]: '#50e5aa',
  [StatusEnum.RECEIVED_CONTRACT]: '#43cc95',
  [StatusEnum.CONTRACT_ACCEPTED]: '#28ac77',
  [StatusEnum.REAPPLIED]: '#20124d',
  [StatusEnum.PROBABLY_NOT]: '#e89e4f',
  [StatusEnum.LOW_SALARY]: '#a64d63',
};
export const BUCKET_COLORS: Record<string, string> = {
  'Pending': ColorBuckets.Pending,
  'Active': ColorBuckets.Active,
  'Passed': ColorBuckets.Passed,
  'Rejected': ColorBuckets.Rejected,
  'Uncertain': ColorBuckets.Uncertain,
};
export const BUCKET_NAMES = <TBUCKET_NAMES[]>['Pending', 'Active', 'Passed', 'Rejected', 'Uncertain'];
