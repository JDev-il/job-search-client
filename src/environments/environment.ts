export const environment = {
  production: false,
  apiUrls: {
    remote: 'http://192.168.68.56:3000',
    local: 'http://localhost:3000/',
    jobsearchdata: 'jobsearch',
    params: {
      users: {
        path: 'users',
        login: '/login',
        add: '/add',
      },
      auth: {
        path: 'auth',
        login: '/login',
        sign: '/sign',
        verify: '/verify'
      },
    }
  },
};
