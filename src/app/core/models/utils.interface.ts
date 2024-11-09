export interface IpRequest {
  ip1: string,
  ip2: IpType
}

interface IpType {
  ip: string,
  country: string,
  cc: string
}
