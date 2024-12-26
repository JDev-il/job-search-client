import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '../../core/models/enum/utils.enum';

@Injectable({ providedIn: 'root' })
export class RoutingService {
  constructor(private router: Router) { }
  public toLogin(): void {
    this.router.navigateByUrl(ROUTES.LOGIN);
  }
  public toRegister(): void {
    this.router.navigateByUrl(ROUTES.REGISTER)
  }
  public toAccount(): void {
    this.router.navigateByUrl(ROUTES.ACCOUNT)
  }
  public toDashboard(): void {
    this.router.navigateByUrl(ROUTES.DASHBOARD);
  }
  public toActivity(): void {
    this.router.navigateByUrl(ROUTES.ACTIVITY);
  }
}
