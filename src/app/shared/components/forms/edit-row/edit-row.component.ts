import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PlatformEnum, PositionStackEnum, PositionTypeEnum, StatusEnum } from '../../../../core/models/enum/table-data.enum';
import { ContinentsEnum } from '../../../../core/models/enum/utils.enum';
import { TableDataFormRow } from '../../../../core/models/forms.interface';

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
export class EditRowComponent {
  @Output() formEmit: EventEmitter<FormGroup<TableDataFormRow>> = new EventEmitter();
  @Output() continentEmit: EventEmitter<ContinentsEnum> = new EventEmitter();
  @Input() incomingEditForm!: FormGroup<TableDataFormRow>;
  @Input() incomingFormTitle!: string;
  public statuses = signal(this.enumsToArray(StatusEnum));
  public positionTypes = signal(this.enumsToArray(PositionTypeEnum));
  public positionStacks = signal(this.enumsToArray(PositionStackEnum));
  public applicationPlatform = signal(this.enumsToArray(PlatformEnum))

  public filteredCountries = signal([] as string[]);

  formSubmit() {
    if (this.incomingEditForm.valid) {
      this.formEmit.emit(this.incomingEditForm);
    }
  }

  private enumsToArray(enums: {}): string[] {
    return Object.values(enums)
  }

}
