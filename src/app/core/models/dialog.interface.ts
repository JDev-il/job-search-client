import { FormGroup } from '@angular/forms';
import {
  AccountMessagesEnum,
  ConsentDialogTitlesEnum,
  DialogBodyMessagesEnum,
  ErrorMessagesEnum,
  NotificationsStatusEnum,
  SessionMessagesEnum,
  UserMessagesEnum
} from "./enum/messages.enum";
import { FormEnum } from "./enum/utils.enum";
import { TableDataFormRow } from "./forms.interface";


export interface GenericDialogType {
  consent?: ConsentDialog,
  notification?: NotificationDialog,
  form?: FormDialog
}

export interface NotificationDialog {
  title: NotificationsStatusEnum | string,
  message: UserMessagesEnum | AccountMessagesEnum | ErrorMessagesEnum | SessionMessagesEnum | string
}

export interface FormDialog {
  formTitle: FormEnum,
  formType: FormGroup<TableDataFormRow>,
}

export interface ConsentDialog {
  title: ConsentDialogTitlesEnum,
  body: DialogBodyMessagesEnum[];
}
