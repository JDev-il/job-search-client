import { Injectable, signal, WritableSignal } from '@angular/core';
import { Subject } from 'rxjs';
import { ChartDataType1, ChartDataType2 } from '../../core/models/chart.interface';
import { ChartTimeLine, City, Country } from './../../core/models/data.interface';
import { ITableDataRow } from './../../core/models/table.interface';
import { AuthUserResponse, UserResponse } from './../../core/models/users.interface';

@Injectable({ providedIn: 'root' })
export class StateService {
  public readonly spinner = signal<boolean>(true);
  public readonly destroyed$ = signal<boolean>(false);
  public _usersResponse: WritableSignal<AuthUserResponse> = signal<AuthUserResponse>({} as AuthUserResponse);
  public _tableDataResponse: WritableSignal<ITableDataRow[]> = signal<ITableDataRow[]>([]);
  public _dataUserResponse: WritableSignal<UserResponse> = signal({} as UserResponse);
  public _countries: WritableSignal<Country[]> = signal<Country[]>([] as Country[]);
  public _currentCountry: WritableSignal<Country> = signal<Country>({} as Country);
  public _currentCitiesByCountry: WritableSignal<City> = signal<City>({} as City);
  public _companiesList: WritableSignal<string[]> = signal<string[]>([] as string[])
  public _statusPreviewList: WritableSignal<string[]> = signal<string[]>([]);
  public _globalFilteredChartData: WritableSignal<ITableDataRow[]> = signal<ITableDataRow[]>([]);
  public _currentChartData: WritableSignal<ChartDataType1[]> = signal<ChartDataType1[]>([]);
  public _currentTabIndex: WritableSignal<number> = signal(0);
  public _lastSortedDataSource: WritableSignal<ITableDataRow[]> = signal<ITableDataRow[]>([]);
  public _cvProgressTimeline: WritableSignal<ChartTimeLine[]> = signal<ChartTimeLine[]>([]);
  public _isCachedRequest: WritableSignal<boolean> = signal<boolean>(true);
  public _currentCountryName: WritableSignal<string> = signal<string>('');
  public _isDataExists = signal<boolean>(false);
  public _buttonText = signal<string>("Don't have an account?");
  public _isFetchingCities = signal(false);
  public _isRegistrationError = signal(false);
  public _chronicalDates = signal<string[]>([]);
  public _daysFilter: WritableSignal<number> = signal(0);
  public _destroy$: Subject<boolean> = new Subject();

  // Charts Data
  public _progressChart = signal<ChartDataType1[]>([]);
  public _statusChart = signal<ChartDataType2[]>([]);
}
