import { ParamsBy, ParamsOrder } from "./enum/params.enum";

export interface CityReqParams {
  limit?: number,
  order: ParamsOrder,
  orderBy: ParamsBy,
  country: string
}
