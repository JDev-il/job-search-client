import { ParamsOrder, ParamsOrderBy } from './enum/params.enum';


export interface CityReqParams {
  limit?: number,
  order: ParamsOrder,
  orderBy: ParamsOrderBy,
  country: string
}

export interface PendingActions {
  id: number,
  type: string,
  question: string,
  jobId: number,
  evidence: {
    gmailMessageId: string,
    senderDomain: string,
    subject: string,
    snippet: string,
    classification: { intent: string, confidence: number, source: string }
  },
  proposedChange: { kind: string, jobId: number, fromStatus: string, toStatus: string },
  resolution: string,
  createdAt: string,
  resolvedAt: Date | null
}
