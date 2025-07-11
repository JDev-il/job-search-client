import { Directive, inject, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs';
import { NotificationDialog } from '../../core/models/dialog.interface';
import { NotificationsStatusEnum } from '../../core/models/enum/messages.enum';
import { DataService } from '../services/data.service';
import { RoutingService } from './../services/routing.service';

@Directive({
  selector: '[SnackBar]',
  exportAs: 'SnackBar',
  standalone: true
})
export class SnackBarDirective {
  private _snackBar = inject(MatSnackBar);
  private durationInSeconds!: number;
  private snackBarMessage: string = '';
  @Input() spinnerState!: boolean;

  constructor(private dataService: DataService, private routingService: RoutingService) { }

  public openSnackBar(data: NotificationDialog, actionLable?: string): void {
    const isRedirecting = (data.title === NotificationsStatusEnum.successlog || data.title === NotificationsStatusEnum.successreg);
    this.snackBarMessage = data.message;
    if (this.snackBarMessage) {
      const snackBarRef = this._snackBar.open(
        this.snackBarMessage,
        actionLable || 'Dismiss',
        {
          duration: isRedirecting ? 2500 : 0,
          horizontalPosition: 'center',
          panelClass: ['snack-bar-container', `${data.title}`]
        },
      );
      if (isRedirecting) {
        snackBarRef.afterDismissed().pipe(tap(() => this.routingService.toDashboard())).subscribe()
      }
      snackBarRef.onAction().subscribe((): void => {
        this.dataService.setSpinnerState(this.spinnerState);
      });
    }
  }
}
