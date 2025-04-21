import { Component, effect, EventEmitter, Input, Output, signal, ViewChild, WritableSignal } from "@angular/core";
import { AbstractControl, FormControl, FormGroup } from "@angular/forms";
import { MatSelect } from "@angular/material/select";
import { Subject, throwError } from "rxjs";
import { Country } from "../../core/models/data.interface";
import { PlatformEnum, PositionStackEnum, PositionTypeEnum, StatusEnum } from "../../core/models/enum/table-data.enum";
import { FieldType } from "../../core/models/enum/utils.enum";
import { TableDataFormRow } from "../../core/models/forms.interface";
import { StateService } from "../services/state.service";

@Component({
  selector: 'app-forms-base',
  template: '',
  standalone: true,
})
export class FormsBaseComponent {
  @Output() formEmit: EventEmitter<FormGroup<TableDataFormRow>> = new EventEmitter();
  @Output() changeCountryEmit: EventEmitter<string> = new EventEmitter();
  @Input() incomingEditForm!: FormGroup<TableDataFormRow>;
  @Input() newAddRowForm!: FormGroup<TableDataFormRow>;
  @Input() countries: WritableSignal<Country[]> = signal([] as Country[]);
  @ViewChild('statusSelect') statusSelect!: MatSelect;
  @ViewChild('typeSelect') typeSelect!: MatSelect;
  @ViewChild('stackSelect') stackSelect!: MatSelect;
  @ViewChild('platformSelect') platformSelect!: MatSelect;
  protected filteredCountries: WritableSignal<Country[]> = signal([] as Country[]);
  protected filteredCities: WritableSignal<string[]> = signal([] as string[]);
  protected filteredCompanies: WritableSignal<string[]> = signal([] as string[]);
  protected currentCitiesList: WritableSignal<string[]> = signal<string[]>([]);
  protected companiesList: WritableSignal<string[]> = signal([] as string[]);
  protected companyCity = new FormControl('');
  protected destroy$ = new Subject<void>();
  protected statuses = signal(this.enumsToArray(StatusEnum));
  protected positionTypes = signal(this.enumsToArray(PositionTypeEnum));
  protected positionStacks = signal(this.enumsToArray(PositionStackEnum));
  protected applicationPlatform = signal(this.enumsToArray(PlatformEnum));
  protected FieldTypes = FieldType;
  protected countryNameField = signal('');
  protected companyCityField = signal('');
  protected companyNameField = signal('');

  constructor(public stateService: StateService) {
    effect(() => {
      if (this.companyCityField() || this.isCurrentCitiesList) {
        this.currentCitiesList.set(this.stateService.citiesOfCurrentCountry.data);
        const cities = this.filterCities(this.companyCityField());
        this.filteredCities.set(cities);
      }
      if (this.companyNameField() || this.stateService.listOfCompanies.length) {
        this.companiesList.set(this.stateService.listOfCompanies);
        const companies = this.filterCompanies(this.companyNameField());
        this.filteredCompanies.set(companies);
      }
      if (this.countryNameField() || this.stateService.allCountries) {
        this.countries.set(this.stateService.allCountries);
        const countries = this.filterCountries(this.countryNameField());
        this.filteredCountries.set(countries);
      }
    }, { allowSignalWrites: true });
  }

  protected onSelect(data: string, type: FieldType): void {
    if (type === FieldType.location) {
      this.companyCityField.set(data);
    } else if (type === FieldType.name) {
      this.companyNameField.set(data)
    }
  }

  protected onTypeValue(event: KeyboardEvent, type: FieldType): void {
    const abstractControl = this.abstractControlSwitch(type);
    const value = abstractControl?.value || '';
    if (!value && event.key === 'Backspace') {
      this.resetCitiesList();
      event.preventDefault();
    }

    if (type === FieldType.location) {
      this.companyCityField.set(value);
    } else if (type === FieldType.name) {
      this.companyNameField.set(value);
    }
    return;
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

  protected filterCompanies(query: string): string[] {
    const companiesData = this.companiesList() as string[];
    return companiesData.filter((company: string) => {
      return company.toLowerCase().includes(query.toLowerCase())
    });
  }

  protected resetCitiesList(): void {
    this.currentCitiesList.set(this.stateService.citiesOfCurrentCountry.data);
  }

  protected whichSelect(controlName: string) {
    switch (controlName) {
      case 'status':
        this.statusSelect.open();
        break;
      case 'positionType':
        this.typeSelect.open();
        break;
      case 'positionStack':
        this.stackSelect.open();
        break;
      case 'applicationPlatform':
        this.platformSelect.open();
        break;
    }
  }

  protected changeCountryRequest(e: MouseEvent): void {
    e.preventDefault();
    this.stateService.isFetchingCities.set(true);
    this.companyCityField.set('');
    this.filteredCountries.set(this.countries());
    if (!this.newAddRowForm) {
      this.incomingEditForm.get('companyLocation')?.reset();
    } else {
      this.newAddRowForm.get('companyLocation')?.reset();
    }
  }

  protected onSelectCountry(country: string): void {
    !this.newAddRowForm ?
      this.incomingEditForm.get('companyLocation')?.reset() :
      this.newAddRowForm.get('companyLocation')?.reset();
    this.stateService.isFetchingCities.set(false);
    this.stateService.getCitiesByCountry(country).subscribe({
      next: cities => this.filteredCities.set(cities.data),
      error: (err) => throwError(() => err)
    })
  }

  protected get placeholderText(): string {
    return !this.stateService.isFetchingCities()
      ? `Search a City in ${this.stateService.currentCountryName()}`
      : 'Choose a Country'
  };

  protected filterPastDates = (date: Date | null): boolean => {
    const today = new Date();
    return date ? date <= today : false;
  };


  private abstractControlSwitch(type: string): AbstractControl {
    let control!: AbstractControl;
    switch (type) {
      case FieldType.location:
        control = this.formType.get('companyLocation') as AbstractControl;
        break;
      case FieldType.name:
        control = this.formType.get('companyName') as AbstractControl;
        break;
      case FieldType.country:
        control = this.formType.get('companyLocation') as AbstractControl;
        break;
    }
    return control;
  }

  private get formType(): FormGroup<TableDataFormRow> {
    return this.incomingEditForm || this.newAddRowForm;
  }

  private get isCurrentCitiesList(): boolean {
    return !!this.stateService.citiesOfCurrentCountry.data;
  }

}
