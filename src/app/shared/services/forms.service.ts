import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableDataForm } from '../../core/models/forms.interface';
import { TableDataFormRow } from './../../core/models/forms.interface';

@Injectable({ providedIn: 'root' })
export class FormsService {
  constructor(public fb: FormBuilder) { }

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
}
