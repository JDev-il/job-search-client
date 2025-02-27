import { Injectable } from '@angular/core';
import { StatusEnum } from '../../core/models/enum/table-data.enum';
import { ITableDataRow } from '../../core/models/table.interface';

@Injectable({ providedIn: 'root' })
export class UIService {

  constructor() { }

  public colorSwitch(row: ITableDataRow): string {
    switch (row.status) {
      case StatusEnum.AWAITING_RESPONSE:
        return "awaiting-response";
      case StatusEnum.HR_REACHED_BACK:
        return "hr-reached-back";
      case StatusEnum.AWAITING_DECISION:
        return "awaiting-decision";
      case StatusEnum.DECIDED_TO_PASS:
        return "decided-to-pass";
      case StatusEnum.LOW_SALARY:
        return "below-salary-expectation";
      case StatusEnum.DID_NOT_PASS_HR:
        return "did-not-pass-hr";
      case StatusEnum.AWAITING_INTERVIEW:
        return "awaiting-interview";
      case StatusEnum.INTERVIEW_SCHEDULED:
        return "interview-scheduled";
      case StatusEnum.AWAITING_RESULTS:
        return "awaiting-results";
      case StatusEnum.REJECTED:
        return "rejected";
      case StatusEnum.PASSED:
        return "passed";
      case StatusEnum.PROBABLY_NOT:
        return "probably-not";
      case StatusEnum.REAPPLIED:
        return "reapplied";
      case StatusEnum.ARCHIVED:
        return "archived";
      case StatusEnum.RECEIVED_CONTRACT:
        return "received-contract";
      default:
        return '';
    }
  }
}
