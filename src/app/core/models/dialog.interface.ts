import { FormGroup } from '@angular/forms';
import { AccountMessages, ErrorMessages, NotificationsStatusEnum, SessionMessages, UserMessages } from "./enum/messages.enum";
import { FormEnum } from "./enum/utils.enum";
import { TableDataFormRow } from "./forms.interface";


export interface GenericDialogType {
  notification?: NotificationDialog,
  form?: FormDialog
}

export interface NotificationDialog {
  title: NotificationsStatusEnum,
  message: UserMessages | AccountMessages | ErrorMessages | SessionMessages | string
}

export interface FormDialog {
  formTitle: FormEnum,
  formType: FormGroup<TableDataFormRow>,
}

