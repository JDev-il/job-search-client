export const environment = {
  production: false,
  apiUrls: {
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
        getData: '/data',
        addData: '/add'
      }
    }
  },
};
