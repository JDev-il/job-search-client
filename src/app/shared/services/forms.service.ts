import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableDataForm } from '../../core/models/forms.interface';

@Injectable({ providedIn: 'root' })
export class FormsService {
  constructor(private fb: FormBuilder) { }

  public tableFormInit(): FormGroup {
    return this.fb.group<TableDataForm>({
      status: this.fb.control('', Validators.required),
      company: this.fb.control('', Validators.required),
      position: this.fb.control('', Validators.required),
      application: this.fb.control('', Validators.required),
      note: this.fb.control(''),
      hunch: this.fb.control('')
    })
  }

  /* this.fb.group({
    firstname: this.fb.control('', [Validators.required, Validators.pattern(/^[\p{L}]+(([' -][\p{L}])?[\p{L}]*)*$/u)]),
    lastname: this.fb.control('', [Validators.required, Validators.pattern(/^[\p{L}]+(([' -][\p{L}])?[\p{L}]*)*$/u)]),
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [Validators.required, Validators.minLength(3)]),
    confirm_password: this.fb.control('', Validators.required),
  } */

}
