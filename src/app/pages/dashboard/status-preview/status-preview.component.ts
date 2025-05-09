import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-preview',
  standalone: true,
  imports: [],
  templateUrl: './status-preview.component.html',
  styleUrl: './status-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusPreviewComponent {
  @Input() allStatuses!: string[];
  constructor(private cd: ChangeDetectorRef) { }

}
