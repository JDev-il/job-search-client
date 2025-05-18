
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

export interface ChartTimeLine {
  id: number,
  year: string,
  months: Month[],
}

export interface IAxis {
  x: number,
  y: number
}

export interface Month {
  numeric: string,
  alphabetic: string,
  periodic: string
}

export interface NavBarLink {
  name: string,
  route: string,
  icon: string,
  index: number
}
