import { FormGroup } from '@angular/forms';
import { AccountMessages, SessionMessages, UserMessages, ValidationMessages } from "./enum/messages.enum";
import { TitlesEnum } from "./enum/utils.interface";
import { TableDataRowForm } from "./forms.interface";


export interface GenericDialogType {
  notification?: NotificationDialog,
  form?: FormGroup<TableDataRowForm>
}

export interface NotificationDialog {
  title: TitlesEnum,
  message: UserMessages | AccountMessages | ValidationMessages | SessionMessages | DataTransfer
}



