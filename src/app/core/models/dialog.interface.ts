import { FormGroup } from '@angular/forms';
import { AccountMessages, SessionMessages, UserMessages, ValidationMessages } from "./enum/messages.enum";
import { FormEnum, NotificationsEnum } from "./enum/utils.enum";
import { TableDataFormRow } from "./forms.interface";


export interface GenericDialogType {
  notification?: NotificationDialog,
  form?: FormDialog
}

export interface NotificationDialog {
  title: NotificationsEnum,
  message: UserMessages | AccountMessages | ValidationMessages | SessionMessages | DataTransfer
}

export interface FormDialog {
  formTitle: FormEnum,
  formType: FormGroup<TableDataFormRow>,
}

