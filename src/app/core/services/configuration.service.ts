import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from '../models/api.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  private readonly endpoints: ApiEndpoints;

  constructor() {
    this.endpoints = this.buildEndpoints();
  }

  get internal() {
    return this.endpoints.internal;
  }

  get external() {
    return this.endpoints.external;
  }

  public getUsersUrl(endpoint?: string): string {
    return this.buildInternalUrl(this.internal.users.path, endpoint);
  }

  public getAuthUrl(endpoint?: string): string {
    return this.buildInternalUrl(this.internal.auth.path, endpoint);
  }

  public getJobSearchUrl(endpoint?: string): string {
    return this.buildInternalUrl(this.internal.jobSearch.path, endpoint);
  }

  public getCountriesUrl(useFilter?: keyof typeof this.external.geo.countries.filter): string {
    const config = this.external.geo.countries;
    const baseUrl = config.mockUrl && !environment.production ? config.mockUrl : config.baseUrl;
    const filter = useFilter ? config.filter[useFilter] : '';
    return `${baseUrl}${filter}`;
  }

  public getCitiesUrl(endpoint?: string): string {
    const config = this.external.geo.cities;
    const path = endpoint || config.citiesList;
    return this.buildExternalUrl(config.baseUrl, path);
  }

  public getCompaniesUrl(endpoint?: string, params?: { q?: number; from?: number; to?: number }): string {
    const config = this.external.companies;
    let path = endpoint || config.all;
    if (params) {
      if (params.q && path === config.filters.quantity) {
        path = path.replace(':q', params.q.toString());
      }
      if (params.from && params.to && path === config.filters.range) {
        path = path.replace(':from', params.from.toString()).replace(':to', params.to.toString());
      }
    }
    return this.buildExternalUrl(config.baseUrl, path);
  }

  public getTimelineUrl(params?: Record<string, any>): string {
    const config = this.external.timeline;
    const mergedParams = { ...config.params, ...params };
    return this.buildExternalUrl(config.baseUrl, undefined, mergedParams);
  }

  // Helper methods for building full URLs
  public buildInternalUrl(path: string, endpoint?: string): string {
    const base = this.internal.base.endsWith('/')
      ? this.internal.base.slice(0, -1)
      : this.internal.base;

    const fullPath = endpoint ? `${path}${endpoint}` : path;
    return `${base}/${fullPath}`;
  }

  public buildExternalUrl(baseUrl: string, path?: string, params?: Record<string, any>): string {
    let url = baseUrl;

    if (path) {
      url = url.endsWith('/') ? `${url}${path}` : `${url}/${path}`;
    }

    if (params) {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          searchParams.append(key, params[key].toString());
        }
      });

      const paramString = searchParams.toString();
      if (paramString) {
        url += url.includes('?') ? `&${paramString}` : `?${paramString}`;
      }
    }

    return url;
  }

  private buildEndpoints(): ApiEndpoints {
    const isProduction = environment.production;
    const isDevelopment = !isProduction;
    const internalBase = this.getInternalApiBase();
    return {
      internal: {
        base: internalBase,
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
        jobSearch: {
          path: 'jobsearch',
          getApplications: '/data',
          addApplication: '/add',
          editApplication: '/edit',
          updateApplication: '/update',
          removeRow: '/removesingle',
          removeRows: '/removemultiple'
        }
      },
      external: {
        timeline: {
          baseUrl: "https://6804a77d79cb28fb3f5b7ae5.mockapi.io/api/timeline",
          params: {
            data: "years_months"
          }
        },
        geo: {
          countries: {
            baseUrl: "https://67ea3d9d34bcedd95f62aea6.mockapi.io/api/countries",
            filter: {
              name: "?fields=name",
              maps: "?fields=maps",
              all: "?fields=name,maps"
            }
          },
          cities: {
            baseUrl: "https://countriesnow.space/api/v0.1/",
            citiesList: "countries/cities",
            filter: "countries/population/cities/filter",
            israeli: "https://67e8e189bdcaa2b7f5b80458.mockapi.io/api/cities"
          }
        },
        companies: {
          baseUrl: "https://67e8e189bdcaa2b7f5b80458.mockapi.io/api/",
          all: 'companies',
          filters: {
            quantity: 'companies/:q',
            range: 'companies/:from-:to'
          }
        }
      }
    };
  }

  private getInternalApiBase(): string {
    if (environment.production) {
      return '/api';
    }

    if (environment.apiUrls?.local) {
      return environment.apiUrls.local;
    }

    return '/api';
  }
}
