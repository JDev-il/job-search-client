import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loadGuard } from './load.guard';

describe('loadGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loadGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
