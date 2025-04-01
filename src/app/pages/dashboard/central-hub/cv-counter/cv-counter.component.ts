import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cv-counter',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './cv-counter.component.html',
  styleUrl: './cv-counter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CvCounterComponent {
  @Input() counter = signal<number>(0)
  @Output() cta = new EventEmitter<void>();

  public sendCV(): void {
    this.cta.emit();
  }

  get currentCounter(): number {
    return (this.counter ?? 0)();
  }
}
