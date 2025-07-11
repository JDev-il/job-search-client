import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsBaseComponent } from '../../../base/forms-base.component';
import { StringSanitizerPipe } from './../../../pipes/string-sanitizer.pipe';
import { DataService } from './../../../services/data.service';

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
    MatIcon,
    CommonModule,
  ],
  templateUrl: './edit-row.component.html',
  styleUrls: ['../styles/form-style.scss', './edit-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditRowComponent extends FormsBaseComponent {

  @Input() incomingFormTitle!: string;
  constructor(private cd: ChangeDetectorRef, private destroyRef: DestroyRef, dataService: DataService) {
    super(dataService);
    this.destroyRef.onDestroy(() => {
      this.destroy$.next();
      this.destroy$.complete();
    })
  }

  public formSubmit(): void {
    if (this.incomingEditForm.valid) {
      this.formEmit.emit(this.incomingEditForm);
    }
  }

  public editOption(fieldName: string): void {
    this.incomingEditForm.get(fieldName)?.reset();
    setTimeout(() => {
      this.whichSelect(fieldName);

    }, 200)
  }
}
