import { Component, signal } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { IDialogData } from '../../core/models/data.interface';
import { AccountMessages, IncorrectCredentialsMessages, LoginMessages, SessionExpiredMessages, UserMessages } from '../../core/models/enum/messages.enum';
import { TitleTextEnum } from '../../core/models/enum/utils.interface';
import { GenericDialogComponent } from '../dialogs/generic-dialog/generic-dialog.component';
@Component({
  selector: 'app-base',
  template: '',
  standalone: true,
})
export class BaseDialogComponent {
  constructor(private dialog: MatDialog) { }

  openDialog(
    title: TitleTextEnum,
    message:
      LoginMessages |
      AccountMessages |
      IncorrectCredentialsMessages |
      SessionExpiredMessages |
      UserMessages
  ):
    void {
    this.dialog.open(GenericDialogComponent, <MatDialogConfig>{
      disableClose: true,
      backdropClass: 'generic-dialog-backdrop',
      minWidth: 'unset',
      minHeight: 'unset', signal,
      data: <IDialogData>{ message: message, title: title }
    });
  }
}
