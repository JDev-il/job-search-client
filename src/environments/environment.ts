export const environment = {
  production: false,
  apiUrls: {
    geo: {
      baseUrl: "https://restcountries.com/v3.1/",
      all: "all",
      name: "name/*"
      // north_america: "subregion/north%20america",
      // rest_of_the_world: "region/{}?fields=name"
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
