import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { FormPlaceholdersEnum, PlatformEnum, PositionStackEnum, PositionTypeEnum, StatusEnum } from '../../../../core/models/enum/table-data.enum';
import { ContinentsEnum } from '../../../../core/models/enum/utils.enum';
import { TableDataFormRow } from '../../../../core/models/forms.interface';

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
export class AddRowComponent {
  @Output() formEmit: EventEmitter<FormGroup<TableDataFormRow>> = new EventEmitter();
  @Output() continentEmit: EventEmitter<ContinentsEnum> = new EventEmitter();
  @Input() newAddRowForm!: FormGroup<TableDataFormRow>;
  @Input() countries: WritableSignal<string[]> = signal([] as string[]);

  private destroy$ = new Subject<void>();
  public continents: WritableSignal<string[]> = signal([] as string[]);

  public statuses = signal(this.enumsToArray(StatusEnum));
  public positionTypes = signal(this.enumsToArray(PositionTypeEnum));
  public positionStacks = signal(this.enumsToArray(PositionStackEnum));
  public applicationPlatform = signal(this.enumsToArray(PlatformEnum))

  public filteredCountries = signal([] as string[]);
  public companyLocationField = signal<string>('');
  public formPlaceholders = Object.values(FormPlaceholdersEnum);

  constructor(private destroyRef: DestroyRef) {
    effect(() => {
      this.continents.set(this.enumsToArray(ContinentsEnum));
      const countries = [...this.countries()];
      const filtered = countries.filter((country) =>
        country.toLowerCase().includes(this.companyLocationField())
      );
      this.filteredCountries.set(filtered);
    }, { allowSignalWrites: true })
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

  public onContinentChange(continentValue: ContinentsEnum): void {
    this.continentEmit.emit(continentValue);
    const companyLocation = this.newAddRowForm.get('companyLocation');
    if (companyLocation) {
      this.cleanFormField(companyLocation)
    }
  }

  public formSubmit(): void {
    if (this.newAddRowForm.valid) {
      this.formEmit.emit(this.newAddRowForm);
    }
  }

  private enumsToArray(enums: {}): string[] {
    return Object.values(enums)
  }

  private setCompanyLocationValue(): Subscription | undefined {
    const companyLocationControl = this.newAddRowForm.get('companyLocation');
    return companyLocationControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.companyLocationField.set(value!.toLowerCase());
      });
  }

  private cleanFormField(field: AbstractControl<string | null, string | null>) {
    field.setValue('');
    field.markAsPristine();
    field.markAsUntouched();
  }

}
