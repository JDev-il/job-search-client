import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, inject, Injector, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsBaseComponent } from '../../../base/forms-base.component';
import { StringSanitizerPipe } from '../../../pipes/string-sanitizer.pipe';
import { StateService } from '../../../services/state.service';

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
  private _injector = inject(Injector);
  constructor(private destroyRef: DestroyRef, stateService: StateService) {
    super(stateService);
    this.destroyRef.onDestroy(() => {
      this.destroy$.next();
      this.destroy$.complete();
    })
  }

  public get formArrayKeys(): string[] {
    return Object.keys(this.newAddRowForm.controls);
  }

  triggerResize() {
    afterNextRender(
      () => {
        this.autosize.resizeToFitContent(true);
      },
      {
        injector: this._injector,
      },
    );
  }
  public formSubmit(): void {
    if (this.newAddRowForm.valid) {
      this.formEmit.emit(this.newAddRowForm);
    }
  }
}
