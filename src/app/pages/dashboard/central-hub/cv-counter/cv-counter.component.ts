import { ChangeDetectionStrategy, Component, Input, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-cv-counter',
  standalone: true,
  imports: [],
  templateUrl: './cv-counter.component.html',
  styleUrl: './cv-counter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CvCounterComponent {
  @Input() counter!: WritableSignal<number>
}
