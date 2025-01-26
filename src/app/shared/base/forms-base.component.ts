import { Component, effect, Input, signal, WritableSignal } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { Country } from "../../core/models/data.interface";
import { PlatformEnum, PositionStackEnum, PositionTypeEnum, StatusEnum } from "../../core/models/enum/table-data.enum";
import { TableDataFormRow } from "../../core/models/forms.interface";

@Component({
  selector: 'app-forms-base',
  template: '',
  standalone: true,
})
export class FormsBaseComponent {
  @Input() incomingEditForm!: FormGroup<TableDataFormRow>;
  @Input() newAddRowForm!: FormGroup<TableDataFormRow>;
  @Input() countries: WritableSignal<Country[]> = signal([] as Country[]);
  protected filteredCountries: WritableSignal<Country[]> = signal([] as Country[]);
  protected destroy$ = new Subject<void>();
  protected statuses = signal(this.enumsToArray(StatusEnum));
  protected positionTypes = signal(this.enumsToArray(PositionTypeEnum));
  protected positionStacks = signal(this.enumsToArray(PositionStackEnum));
  protected applicationPlatform = signal(this.enumsToArray(PlatformEnum));
  protected companyLocationField: WritableSignal<string> = signal('');
  constructor() {
    effect(() => {
      const filtered = this.filterCountries(this.companyLocationField());
      this.filteredCountries.set(filtered);
    }, { allowSignalWrites: true })
  }

  protected onCountryType(event: KeyboardEvent, form: FormGroup<TableDataFormRow>): void {
    const companyLocation = form.get('companyLocation');
    if (!companyLocation) return;
    event.preventDefault();
    if (event.key === 'Backspace' && !companyLocation.value) {
      event.stopImmediatePropagation();
      return;
    }
    if (companyLocation.value === '') {
      this.cleanFormField(companyLocation);
    } else if (companyLocation.value) {
      this.companyLocationField.set(companyLocation.value);
    }
  }

  protected cleanFormField(field: AbstractControl<string | null, string | null>) {
    field.setValue('');
    field.markAsPristine();
    field.markAsUntouched();
    this.filteredCountries.set(this.countries())
  }

  protected enumsToArray(enums: {}): string[] {
    return Object.values(enums)
  }

  protected filterCountries(query: string): Country[] {
    return this.countries().filter((country: Country) =>
      country.name.common.toLowerCase().includes(query.toLowerCase())
    );
  }
}
