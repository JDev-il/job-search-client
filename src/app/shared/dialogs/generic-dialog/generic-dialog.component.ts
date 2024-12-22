import { CommonModule } from '@angular/common';
import { Component, DestroyRef, effect, Inject, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GenericDialogType } from '../../../core/models/dialog.interface';
import { TitlesEnum } from '../../../core/models/enum/utils.interface';
import { AuthService } from '../../../core/services/auth.service';
import { FormComponent } from '../../components/form/form.component';
import { FormsService } from '../../services/forms.service';
import { RoutingService } from '../../services/routing.service';
import { StateService } from './../../services/state.service';

@Component({
  selector: 'app-generic-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, FormComponent],
  templateUrl: './generic-dialog.component.html',
  styleUrl: './generic-dialog.component.scss'
})
export class GenericDialogComponent {
  public dataType: WritableSignal<GenericDialogType> = signal({});
  public titleText = TitlesEnum;
  constructor(
    private dialogRef: MatDialogRef<GenericDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GenericDialogType,
    private stateService: StateService,
    private authService: AuthService,
    private routingService: RoutingService,
    private formsService: FormsService,
    private destroyRef: DestroyRef
  ) {
    effect(() => {
      this.dataType.set(data);
      if (this.stateService.getDestroyedState()) {
        return;
      }
      this.dialogRef.afterClosed().subscribe(() => {
        if (this.authService.isAuthenticated) {
          // this.routingService.toDashboard();
        }
      });
    }, {
      allowSignalWrites: true
    });
    this.destroyRef.onDestroy(() => {
      this.stateService.markAsDestroyed(); // Mark the signal as  destroyed
      this.stateService.resetDestroyed();
    });
  }

  public get isSuccess(): boolean {
    return this.dataType().notification?.title === this.titleText.success;
  }

  public get form() {
    return this.dataType().form;
  }

  public closeDialog(): void {
    this.stateService.spinnerState = false;
    this.dialogRef.close();
  }

}
