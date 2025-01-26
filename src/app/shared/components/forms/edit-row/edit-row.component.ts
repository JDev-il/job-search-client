import { CommonModule } from '@angular/common';
import { Component, DestroyRef, effect, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TableDataFormRow } from '../../../../core/models/forms.interface';
import { FormsBaseComponent } from '../../../base/forms-base.component';

@Component({
  selector: 'app-edit-row',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    CommonModule
  ],
  templateUrl: './edit-row.component.html',
  styleUrl: '../styles/form-style.scss'
})
export class EditRowComponent extends FormsBaseComponent {
  @Output() formEmit: EventEmitter<FormGroup<TableDataFormRow>> = new EventEmitter();
  @Input() incomingFormTitle!: string;
  constructor(private destroyRef: DestroyRef) {
    super();
    effect(() => {
      const filtered = this.filterCountries(this.companyLocationField());
      this.filteredCountries.set(filtered);
    }, { allowSignalWrites: true })
    this.destroyRef.onDestroy(() => {
      this.destroy$.next();
      this.destroy$.complete();
    })
  }
  formSubmit() {
    if (this.incomingEditForm.valid) {
      this.formEmit.emit(this.incomingEditForm);
    }
  }
}
