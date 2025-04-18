import { PlatformEnum, PositionStackEnum, PositionTypeEnum, StatusEnum } from './enum/table-data.enum';

export interface ITableCol {
  status: string,
  comapny: string,
  position: string,
  application: string,
  notes: string,
  hunch: string
}

export interface ITableDataRow {
  userId?: number,
  jobId?: number,
  status: StatusEnum;
  companyLocation: string;
  companyCity: string;
  companyName: string;
  positionStack: PositionStackEnum[];
  positionType: PositionTypeEnum;
  applicationDate: Date | string | null;
  applicationPlatform: PlatformEnum | null;
  hunch: string;
  notes: string;
}

export interface ITableDataResponse {
  jobId: number;
  tableData: ITableDataRow
}

export interface ITableSaveRequest {
  userId: number,
  tableData: ITableDataRow
}
