import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { IDialogData } from '../../core/models/data.interface';
import { AccountMessages, IncorrectCredentialsMessages, LoginMessages, SessionExpiredMessages } from '../../core/models/enum/messages.enum';
import { TitleText } from '../../core/models/enum/utils.interface';
import { GenericDialogComponent } from '../dialogs/generic-dialog/generic-dialog.component';

@Component({
  selector: 'app-base',
  template: '',
  standalone: true,
})
export class BaseComponent {
  constructor(private dialog: MatDialog) { }

  openDialog(
    title: TitleText,
    message:
      LoginMessages |
      AccountMessages |
      IncorrectCredentialsMessages |
      SessionExpiredMessages
  ):
    void {
    this.dialog.open(GenericDialogComponent, <MatDialogConfig>{
      disableClose: true,
      backdropClass: 'generic-dialog-backdrop',
      minWidth: 'unset',
      minHeight: 'unset',
      maxWidth: 'unset',
      maxHeight: 'unset',
      data: <IDialogData>{ message: message, title: title }
    });
  }
}
