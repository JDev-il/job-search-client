import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { INNER_ROUTES, ROUTES } from '../../core/models/enum/utils.enum';
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
  public toInnerData(): void {
    this.router.navigateByUrl(INNER_ROUTES.DATA);
  }
  public toInnerActions(): void {
    this.router.navigateByUrl(INNER_ROUTES.ACTIONS);
  }
  public checkIsActive(route: string): boolean {
    const url = this.router.url;
    if (route === '') return url === '/' || url.startsWith('/dashboard');
    return url === `/${route}` || url.startsWith(`/${route}`);
  }
}
