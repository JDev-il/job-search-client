import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { GenericDialogType } from '../../core/models/dialog.interface';
import { GenericDialogComponent } from '../dialogs/generic-dialog/generic-dialog.component';

@Component({
  selector: 'app-dialog-base',
  template: '',
  standalone: true,
})
export class BaseDialogComponent {
  constructor(private dialog: MatDialog) { }

  public openDialog(dialogData: GenericDialogType, duration: number = 100): MatDialogRef<GenericDialogComponent> {
    (document.activeElement as HTMLElement)?.blur();
    return this.dialog.open(GenericDialogComponent, <MatDialogConfig>{
      backdropClass: 'generic-dialog-backdrop',
      minWidth: 'unset',
      minHeight: 'unset',
      autoFocus: false,
      data: dialogData,
      enterAnimationDuration: duration
    });
  }
}
