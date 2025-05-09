import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SafeResourceUrl } from '@angular/platform-browser';
import { StringSanitizerPipe } from '../../../shared/pipes/string-sanitizer.pipe';

@Component({
  selector: 'app-cv-counter',
  standalone: true,
  imports: [
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    CommonModule],
  providers: [StringSanitizerPipe],
  templateUrl: './cv-counter.component.html',
  styleUrl: './cv-counter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CvCounterComponent {
  @Input() counter = signal<number>(0);
  @Output() cta = new EventEmitter<void>();
  public icons: Record<string, SafeResourceUrl> = {};
  public isRangePicker = signal(false);
  constructor(private sanitize: StringSanitizerPipe) {
    const iconNames = ['send', 'resume'];
    for (let icon of iconNames) {
      this.icons[icon] = this.sanitize.svgSanitize(`assets/images/${icon}.svg`);
    }
  }
  public get cvCount(): number {
    return this.counter() ?? 0;
  }
}
