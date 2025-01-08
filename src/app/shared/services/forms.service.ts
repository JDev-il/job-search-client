import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { TableDataForm } from '../../core/models/forms.interface';
import { ITableDataRow } from '../../core/models/table.interface';
import { TableDataFormRow } from './../../core/models/forms.interface';

@Injectable({ providedIn: 'root' })
export class FormsService {
  constructor(public fb: FormBuilder) { }

  public initializeRegistrationForm(): FormGroup {
    return this.fb.group({
      firstName: this.fb.control('', [Validators.required, Validators.pattern(/^[\p{L}]+(([' -][\p{L}])?[\p{L}]*)*$/u)]),
      lastName: this.fb.control('', [Validators.required, Validators.pattern(/^[\p{L}]+(([' -][\p{L}])?[\p{L}]*)*$/u)]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required, Validators.minLength(3)]),
      confirm_password: this.fb.control('', Validators.required),
    }, { validators: this.passwordMatchValidator });
  }


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

  public tableRowInit(): FormGroup<TableDataFormRow> {
    return this.fb.group<TableDataFormRow>({
      userId: this.fb.control(null),
      jobId: this.fb.control(null),
      status: this.fb.control('', Validators.required),
      companyName: this.fb.control('', Validators.required),
      companyLocation: this.fb.control('', Validators.required),
      positionType: this.fb.control('', Validators.required),
      positionStack: this.fb.control([''], Validators.required),
      applicationPlatform: this.fb.control('', Validators.required),
      applicationDate: this.fb.control('', Validators.required),
      notes: this.fb.control(''),
      hunch: this.fb.control('')
    })
  }

  public editRowInit(row?: ITableDataRow): FormGroup<TableDataFormRow> {
    return this.fb.group<TableDataFormRow>({
      userId: this.fb.control(row?.userId ?? null),
      jobId: this.fb.control(row?.jobId ?? null),
      status: this.fb.control(row?.status ?? '', Validators.required),
      companyName: this.fb.control(row?.companyName ?? '', Validators.required),
      companyLocation: this.fb.control(row?.companyLocation ?? '', Validators.required),
      positionType: this.fb.control(row?.positionType ?? '', Validators.required),
      positionStack: this.fb.control(row?.positionStack ?? [''], Validators.required),
      applicationPlatform: this.fb.control(row?.applicationPlatform ?? '', Validators.required),
      applicationDate: this.fb.control(row?.applicationDate ?? null, Validators.required),
      notes: this.fb.control(row?.notes ?? ''),
      hunch: this.fb.control(row?.hunch ?? '')
    })
  }

  private passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirm_password')?.value;
    return password === confirmPassword ? null : { isConfirmed: true };
  }
}
