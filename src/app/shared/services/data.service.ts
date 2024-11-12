import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DataService {

  constructor() { }

  public get tokenValidator(): boolean {
    const isToken = !!localStorage.getItem('token');
    if (isToken) {
      return true;
    }
    return false;
  }

}
