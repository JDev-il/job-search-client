export interface Country {
  name: {
    common: string,
    official: string,
    nativeName: {
      [key in string]: {
        official: string,
        common: string
      }
    }
  },
  maps: {
    googleMaps: string,
    openStreetMaps?: string
  },
}

export interface City {
  error: boolean,
  msg: string,
  data: string[]
}

export interface CityData {
  city: string,
  country: string,
  populationCounts: {}[]
}
