import { ParamsOrder, ParamsOrderBy } from "./enum/params.enum";

export interface CityReqParams {
  limit?: number,
  order: ParamsOrder,
  orderBy: ParamsOrderBy,
  country: string
}
