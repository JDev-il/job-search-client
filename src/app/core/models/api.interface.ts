export interface ApiEndpoints {
  internal: {
    base: string;
    users: {
      path: string;
      login: string;
      add: string;
      user: string;
    };
    auth: {
      path: string;
      login: string;
      sign: string;
      verify: string;
    };
    jobSearch: {
      path: string;
      getApplications: string;
      addApplication: string;
      editApplication: string;
      updateApplication: string;
      removeRow: string;
      removeRows: string;
    };
  };

  external: {
    timeline: {
      baseUrl: string;
      params: {
        data: string;
      };
    };
    geo: {
      countries: {
        baseUrl: string;
        mockUrl?: string;
        filter: {
          name: string;
          maps: string;
          all: string;
        };
      };
      cities: {
        baseUrl: string;
        citiesList: string;
        filter: string;
        israeli: string;
      };
    };
    companies: {
      baseUrl: string;
      all: string;
      filters: {
        quantity: string;
        range: string;
      };
    };
  };
}
