import { Component, DestroyRef, effect, ElementRef, Inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountMessages, IncorrectCredentialsMessages, LoginMessages, SessionExpiredMessages } from '../../../core/models/enum/messages.enum';
import { StateService } from './../../services/state.service';

@Component({
  selector: 'app-generic-dialog',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './generic-dialog.component.html',
  styleUrl: './generic-dialog.component.scss'
})
export class GenericDialogComponent {
  @Input() element!: ElementRef<HTMLElement>

  constructor(
    private dialogRef: MatDialogRef<GenericDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public message: LoginMessages | AccountMessages | IncorrectCredentialsMessages | SessionExpiredMessages,
    private stateService: StateService,
    private destroyRef: DestroyRef
  ) {
    effect(() => {
      if (this.stateService.getDestroyedState()) {
        return;
      }
      this.dialogRef.afterClosed().subscribe(() => {
        this.stateService.spinnerState = false;
      });
    });
    this.destroyRef.onDestroy(() => {
      this.stateService.markAsDestroyed(); // Mark the signal as destroyed
      this.stateService.resetDestroyed()
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
