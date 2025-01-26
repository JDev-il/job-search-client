import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Subscription, takeUntil } from 'rxjs';
import { ContinentsEnum } from '../../../../core/models/enum/utils.enum';
import { TableDataFormRow } from '../../../../core/models/forms.interface';
import { FormsBaseComponent } from '../../../base/forms-base.component';

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
    CommonModule
  ],
  templateUrl: './add-row.component.html',
  styleUrl: '../styles/form-style.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddRowComponent extends FormsBaseComponent {
  @Output() formEmit: EventEmitter<FormGroup<TableDataFormRow>> = new EventEmitter();
  @Output() countriesEmit: EventEmitter<ContinentsEnum> = new EventEmitter();
  constructor(private destroyRef: DestroyRef) {
    super();
    this.destroyRef.onDestroy(() => {
      this.destroy$.next();
      this.destroy$.complete();
    })
  }

  ngAfterViewInit(): void {
    this.setCompanyLocationValue();
  }

  public get formArrayKeys(): string[] {
    return Object.keys(this.newAddRowForm.controls);
  }

  public formSubmit(): void {
    if (this.newAddRowForm.valid) {
      this.formEmit.emit(this.newAddRowForm);
    }
  }

  private setCompanyLocationValue(): Subscription | undefined {
    const companyLocationControl = this.newAddRowForm.get('companyLocation');
    return companyLocationControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.companyLocationField.set(value!.toLowerCase());
      });
  }
}
