import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsBaseComponent } from '../../../base/forms-base.component';
import { StateService } from '../../../services/state.service';
import { StringSanitizerPipe } from './../../../pipes/string-sanitizer.pipe';

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
    StringSanitizerPipe,
    CommonModule,
  ],
  templateUrl: './edit-row.component.html',
  styleUrl: '../styles/form-style.scss'
})
export class EditRowComponent extends FormsBaseComponent {

  @Input() incomingFormTitle!: string;
  constructor(private destroyRef: DestroyRef, stateService: StateService) {
    super(stateService);
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
