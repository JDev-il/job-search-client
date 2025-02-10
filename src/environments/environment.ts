export const environment = {
  production: false,
  apiUrls: {
    geo: {
      countries: {
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
      }
    },
    remote: 'http://192.168.68.56:3000',
    local: 'http://localhost:3000/',
    params: {
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
