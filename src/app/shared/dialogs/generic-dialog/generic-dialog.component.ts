import { CommonModule } from '@angular/common';
import { Component, DestroyRef, effect, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IDialogData } from '../../../core/models/data.interface';
import { TitleTextEnum } from '../../../core/models/enum/utils.interface';
import { RoutingService } from '../../services/routing.service';
import { StateService } from './../../services/state.service';

@Component({
  selector: 'app-generic-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './generic-dialog.component.html',
  styleUrl: './generic-dialog.component.scss'
})
export class GenericDialogComponent {
  public titleType!: string;
  public titleText = TitleTextEnum;
  constructor(
    private dialogRef: MatDialogRef<GenericDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
    private stateService: StateService,
    private routingService: RoutingService,
    private destroyRef: DestroyRef
  ) {
    effect(() => {
      if (this.stateService.getDestroyedState()) {
        return;
      }
      this.dialogRef.afterClosed().subscribe(() => {
        this.stateService.spinnerState = false;
        data.title === this.titleText.success ? this.routingService.toDashboard() : ''
      });
    });
    this.destroyRef.onDestroy(() => {
      this.stateService.markAsDestroyed(); // Mark the signal as destroyed
      this.stateService.resetDestroyed();
    });
  }


  public get isSuccess(): boolean {
    return this.data.title === this.titleText.success
  }
  public closeDialog(): void {
    this.dialogRef.close();
  }

}
