export const environment = {
  production: false,
  apiUrls: {
    geo: {
      countries: {
        baseUrl_mockApi: "https://67ea3d9d34bcedd95f62aea6.mockapi.io/api/countries",
        baseUrl: "https://restcountries.com/v3.1/all",
        filter: {
          name: "?fields=name",
          maps: "?fields=maps",
          all: "?fields=name,maps"
        },
      },
      cities: {
        baseUrl: "https://countriesnow.space/api/v0.1/",
        citiesList: 'countries/cities',
        filter: "countries/population/cities/filter",
        israeli: "https://67e8e189bdcaa2b7f5b80458.mockapi.io/api/cities"
      }
    },
    remote: 'http://192.168.68.56:3000',
    local: 'http://localhost:3000/',
    params: {
      companies: {
        base_url: "https://67e8e189bdcaa2b7f5b80458.mockapi.io/api/",
        all: 'companies',
        filters: {
          quantity: 'companies/:q',
          range: 'companies/:from-:to'
        }
      },
      users: {
        path: 'users',
        login: '/login',
        add: '/add',
        user: '/user'
      },
      auth: {
        path: 'auth',
        login: '/login',
        sign: '/signtoken',
        verify: '/verify'
      },
      job_search: {
        path: 'jobsearch',
        getApplications: '/data',
        addApplication: '/add',
        editApplication: '/edit',
        updateApplication: '/update',
        removeRow: '/removesingle',
        removeRows: '/removemultiple'
      }
    }
  },
};
