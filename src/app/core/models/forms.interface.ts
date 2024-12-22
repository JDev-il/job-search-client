import { FormControl } from "@angular/forms";

export interface LoginModel {
  email: FormControl<string | null>,
  password: FormControl<string | null>
}

export interface RegisterModel {
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}


export type RegisterFormModel = Omit<RegisterModel, 'confirm_password'> & {
  confirm_password: FormControl<string | null>;
};


export interface TableDataForm {
  status: FormControl<string | null>,
  company: FormControl<string | null>,
  position: FormControl<string | null>,
  application: FormControl<string | null>,
  note: FormControl<string | null>,
  hunch: FormControl<string | null>
}


export interface TableDataRowForm {
  status: FormControl<string | null>,
  companyName: FormControl<string | null>,
  companyLocation: FormControl<string | null>,
  positionType: FormControl<string | null>,
  positionStack: FormControl<string | null>,
  applicationPlatform: FormControl<string | null>,
  applicationDate: FormControl<string | null>,
  notes: FormControl<string | null>,
  hunch: FormControl<string | null>
}
