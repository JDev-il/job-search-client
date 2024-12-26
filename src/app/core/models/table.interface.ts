import { PlatformEnum, PositionStackEnum, PositionTypeEnum, StatusEnum } from './enum/table-data.enum';

export interface ITableCol {
  status: string,
  comapny: string,
  position: string,
  application: string,
  notes: string,
  hunch: string
}

export interface ITableRow {
  userId?: number,
  status: StatusEnum;
  companyLocation: string;
  companyName: string;
  positionStack: PositionStackEnum;
  positionType: PositionTypeEnum;
  applicationDate: Date;
  applicationPlatform: PlatformEnum | null;
  hunch: string;
  notes: string;
}

export interface ITableDataResponse {
  jobId: number;
  tableData: ITableRow
}

export interface ITableSaveRequest {
  userId: number,
  tableData: ITableRow
}
