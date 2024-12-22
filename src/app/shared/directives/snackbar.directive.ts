import { Directive, inject, Input } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { AccountMessages } from '../../core/models/enum/messages.enum';
import { StateService } from '../services/state.service';

@Directive({
  selector: '[SnackBar]',
  exportAs: 'SnackBar',
  standalone: true
})
export class SnackBarDirective {
  private _snackBar = inject(MatSnackBar);

  @Input() durationInSeconds: number = 5;
  @Input() snackBarMessage: string = '';
  @Input() actionLabel: string = 'Dismiss';
  @Input() customClass: string[] = ['snack-bar-container'];
  @Input() spinnerState!: boolean;

  constructor(private stateService: StateService) { }

  public openSnackBar(text: AccountMessages): void {
    this.snackBarMessage = text;
    if (this.snackBarMessage) {
      const snackBarRef = <MatSnackBarRef<any>>this._snackBar.open(
        this.snackBarMessage,
        this.actionLabel,
        {
          horizontalPosition: 'center',
          panelClass: this.customClass
        },
      );
      snackBarRef.onAction().subscribe((): void => {
        this.stateService.spinnerState = this.spinnerState;
      });
    }
  }
}
