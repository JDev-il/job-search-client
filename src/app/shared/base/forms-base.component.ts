import { Component, effect, EventEmitter, Input, Output, signal, WritableSignal } from "@angular/core";
import { AbstractControl, FormControl, FormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { City, CityData, Country } from "../../core/models/data.interface";
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
  protected currentCitiesList: WritableSignal<City> = signal({} as City);
  protected filteredCities: WritableSignal<CityData[]> = signal([] as CityData[]);
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

  constructor(public stateService: StateService) {
    effect(() => {
      const countries = this.filterCountries(this.companyLocationField());
      this.filteredCountries.set(countries);
      if (this.companyCityField() || (this.currentCitiesList() && this.currentCitiesList().data)) {
        const cities = this.filterCities(this.companyCityField());
        this.filteredCities.set(cities);
      }
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

  protected onSelectCity(): void {
    const value = this.formType.get('companyCity')?.value || '';
    this.companyCityField.set(value);
  }

  protected onTypeCountry(event: KeyboardEvent): void {
    const companyCountry = this.formType.get('companyLocation') as AbstractControl;
    const value = companyCountry?.value || ''
    if (!value) {
      this.cleanFormField(this.formType.get('companyCity') as AbstractControl)
      this.isCompanyCity.set(false);
      this.isCompanyLoction.set(false);
      event.preventDefault();
    }
    this.companyLocationField.set(value.toLowerCase());
  }

  protected onTypeCity(event: KeyboardEvent): void {
    const companyCity = this.formType.get('companyCity') as AbstractControl;
    const value = companyCity?.value || ''
    if (!value) {
      this.formType.get('companyLocation')?.setValue(this.companyLocationField());
      event.preventDefault();
    }
    this.companyCityField.set(value.toLowerCase());
  }

  //! Refine what happens when focus on compayCity field

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

  protected filterCities(query: string): CityData[] {
    const data = this.currentCitiesList().data;
    return data.filter((city: CityData) => {
      return city.city.toLowerCase().includes(query.toLowerCase());
    });
  }

  protected resetCitiesList(): void {
    return this.currentCitiesList.set(this.stateService.citiesOfCurrentCountry)
  }

  private get formType(): FormGroup<TableDataFormRow> {
    return this.incomingEditForm || this.newAddRowForm
  }
}
