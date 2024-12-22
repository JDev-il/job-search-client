import { CommonModule } from '@angular/common';
import { Component, effect, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormPlaceholders } from '../../../core/models/enum/table-data.enum';
import { TableDataRowForm } from '../../../core/models/forms.interface';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  @Input() incomingForm!: FormGroup<TableDataRowForm>;
  public formPlaceholders = Object.values(FormPlaceholders);
  constructor(private fb: FormBuilder) {
    effect(() => {
    }, {
      allowSignalWrites: true
    })
  }

  public get formArray(): string[] {
    return Object.keys(this.incomingForm.controls);
  }

  public submitForm(): void {
    console.log(this.incomingForm.value);
  }

  //TODO: Continue from here and finish the dialog form

}
