import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule, MatDateRangeInput, MatDateRangePicker } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { SafeResourceUrl } from '@angular/platform-browser';
import { DatePickRange } from '../../../../core/models/data.interface';
import { StringSanitizerPipe } from '../../../../shared/pipes/string-sanitizer.pipe';

@Component({
  selector: 'app-cv-counter',
  standalone: true,
  imports: [
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDateRangePicker,
    MatDateRangeInput,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIcon,
    CommonModule],
  providers: [StringSanitizerPipe],
  templateUrl: './cv-counter.component.html',
  styleUrl: './cv-counter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CvCounterComponent {
  @Input() counter = signal<number>(0);
  @Output() cta = new EventEmitter<void>();
  @Output() rangeEmit = new EventEmitter<DatePickRange>()
  public icons: Record<string, SafeResourceUrl> = {};
  public isRangePicker = signal(false);
  constructor(private sanitize: StringSanitizerPipe) {
    const iconNames = ['send', 'resume'];
    for (let icon of iconNames) {
      this.icons[icon] = this.sanitize.svgSanitize(`assets/images/${icon}.svg`);
    }
  }

  public sendCV(): void {
    this.cta.emit();
  }

  public get cvCount(): number {
    return (this.counter ?? 0)();
  }

  public changeDateRange(): void {
    this.isRangePicker.set(true);
  }
  public hideRangePicker(): void {
    this.isRangePicker.update(() => false);
  }

}
