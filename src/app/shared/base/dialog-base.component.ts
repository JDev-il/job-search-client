import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GenericDialogType } from '../../core/models/dialog.interface';
import { GenericDialogComponent } from '../dialogs/generic-dialog/generic-dialog.component';

@Component({
  selector: 'app-dialog-base',
  template: '',
  standalone: true,
})
export class BaseDialogComponent {
  constructor(private dialog: MatDialog) { }
  public openDialog(dialogData: GenericDialogType): void {
    this.dialog.open(GenericDialogComponent, <MatDialogConfig>{
      disableClose: true,
      backdropClass: 'generic-dialog-backdrop',
      minWidth: 'unset',
      minHeight: 'unset',
      data: dialogData
    });
  }
}
