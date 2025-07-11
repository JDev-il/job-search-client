import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsBaseComponent } from '../../../base/forms-base.component';
import { StringSanitizerPipe } from '../../../pipes/string-sanitizer.pipe';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-add-row',
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
    CommonModule
  ],
  templateUrl: './add-row.component.html',
  styleUrl: '../styles/form-style.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddRowComponent extends FormsBaseComponent {
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  constructor(private destroyRef: DestroyRef, dataService: DataService) {
    super(dataService);
    this.destroyRef.onDestroy(() => {
      this.destroy$.next();
      this.destroy$.complete();
    })
  }

  public get formArrayKeys(): string[] {
    return Object.keys(this.newAddRowForm.controls);
  }

  public formSubmit(): void {
    if (this.newAddRowForm.valid) {
      this.formEmit.emit(this.newAddRowForm);
    }
  }
}
