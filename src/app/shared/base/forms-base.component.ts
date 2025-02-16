import { Component, effect, EventEmitter, Input, Output, signal, WritableSignal } from "@angular/core";
import { AbstractControl, FormControl, FormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { City, Country } from "../../core/models/data.interface";
import { PlatformEnum, PositionStackEnum, PositionTypeEnum, StatusEnum } from "../../core/models/enum/table-data.enum";
import { ContinentsEnum } from "../../core/models/enum/utils.enum";
import { TableDataFormRow } from "../../core/models/forms.interface";
import { StateService } from "../services/state.service";

@Component({
  selector: 'app-forms-base',
  template: '',
  standalone: true,
})
export class FormsBaseComponent {
  @Output() formEmit: EventEmitter<FormGroup<TableDataFormRow>> = new EventEmitter();
  @Output() countriesEmit: EventEmitter<ContinentsEnum> = new EventEmitter();
  @Input() incomingEditForm!: FormGroup<TableDataFormRow>;
  @Input() newAddRowForm!: FormGroup<TableDataFormRow>;
  @Input() countries: WritableSignal<Country[]> = signal([] as Country[]);
  protected filteredCountries: WritableSignal<Country[]> = signal([] as Country[]);
  protected currentCitiesList: WritableSignal<string[]> = signal<string[]>([]);
  protected filteredCities: WritableSignal<string[]> = signal([] as string[]);
  protected companyCity = new FormControl('');
  protected destroy$ = new Subject<void>();
  protected statuses = signal(this.enumsToArray(StatusEnum));
  protected positionTypes = signal(this.enumsToArray(PositionTypeEnum));
  protected positionStacks = signal(this.enumsToArray(PositionStackEnum));
  protected applicationPlatform = signal(this.enumsToArray(PlatformEnum));
  protected companyLocationField = signal('');
  protected companyCityField = signal('');
  protected isCompanyCity = signal(false);
  protected isCompanyLoction = signal(false);


  //! Complete edit field logic
  protected isEditField = signal(false);


  constructor(public stateService: StateService) {
    effect(() => {
      if (this.companyCityField() || this.isCurrentCitiesList) {
        this.currentCitiesList.set(this.stateService.citiesOfCurrentCountry.data);
        const cities = this.filterCities(this.companyCityField());
        this.filteredCities.set(cities);
      }

      //! Keeping logic in case I want to include country change base on user's choice
      // const countries = this.filterCountries(this.companyLocationField());
      // this.filteredCountries.set(countries);
      // if (this.companyCityField() || this.isCurrentCitiesList) {
      //   const cities = this.filterCities(this.companyCityField());
      //   this.filteredCities.set(cities);
      // }
    }, { allowSignalWrites: true });
  }

  protected onSelectCountry(country: string): void {
    this.companyLocationField.set(country);
    this.isCompanyLoction.set(true);
    if (!this.isCompanyCity()) {
      this.stateService.getCities(country).subscribe((response: City) => {
        if (response) {
          this.resetCitiesList();
          this.isCompanyCity.set(true);
        }
      })
    } else {
      this.resetCitiesList();
    }
  }

  protected onSelectCity(city: string): void {
    this.companyCityField.set(city);
  }

  protected onTypeCity(event: KeyboardEvent): void {
    const companyCity = this.formType.get('companyLocation') as AbstractControl;
    const value = companyCity?.value || '';
    if (!value && event.key === 'Backspace') {
      this.resetCitiesList();
      event.preventDefault();
      return;
    }
    this.companyCityField.set(value);
  }

  protected cleanFormField(field: AbstractControl<string | null>) {
    field.setValue('');
    field.markAsPristine();
    field.markAsUntouched();
  }

  protected enumsToArray(enums: {}): string[] {
    return Object.values(enums)
  }

  protected filterCountries(query: string): Country[] {
    return this.countries().filter((country: Country) => {
      return country.name.common.toLowerCase().includes(query.toLowerCase());
    });
  }

  protected filterCities(query: string): string[] {
    const citiesData = this.currentCitiesList() as string[];
    return citiesData.filter((city: string) => {
      return city.toLowerCase().includes(query.toLowerCase())
    });
  }

  protected resetCitiesList(): void {
    this.currentCitiesList.set(this.stateService.citiesOfCurrentCountry.data);
  }

  private get formType(): FormGroup<TableDataFormRow> {
    return this.incomingEditForm || this.newAddRowForm
  }

  private get isCurrentCitiesList(): boolean {
    return !!this.stateService.citiesOfCurrentCountry.data;
  }
}
