import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CvCounterComponent } from './cv-counter/cv-counter.component';
import { MarketAnalystComponent } from './market-analyst/market-analyst.component';
import { PositionsListComponent } from './positions-list/positions-list.component';
import { ProgressViewerComponent } from './progress-viewer/progress-viewer.component';
import { StatusPreviewComponent } from './status-preview/status-preview.component';

@Component({
  selector: 'app-central-hub',
  standalone: true,
  imports: [CvCounterComponent, PositionsListComponent, ProgressViewerComponent, StatusPreviewComponent, MarketAnalystComponent],
  templateUrl: './central-hub.component.html',
  styleUrl: './central-hub.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CentralHubComponent {
  @Input() centralHubCvCounter = signal<number>(0);
  @Output() genericEmitter = new EventEmitter<void>();
  constructor() { }

}
