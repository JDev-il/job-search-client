export interface Country {
  name: {
    common: string,
    nativeName: {
      lng: {
        official: string,
        common: string
      }
    },
    official: string
  }
}
