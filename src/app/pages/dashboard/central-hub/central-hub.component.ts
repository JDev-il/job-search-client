import { ChangeDetectionStrategy, Component, effect, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';

import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { ITableDataRow } from '../../../core/models/table.interface';
import { StateService } from './../../../shared/services/state.service';
import { CvCounterComponent } from './cv-counter/cv-counter.component';
import { MarketAnalystComponent } from './market-analyst/market-analyst.component';
import { PositionsListComponent } from './positions-list/positions-list.component';
import { ProgressViewerComponent } from './progress-viewer/progress-viewer.component';
import { StatusPreviewComponent } from './status-preview/status-preview.component';
@Component({
  selector: 'app-central-hub',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    CvCounterComponent,
    ProgressViewerComponent,
    PositionsListComponent,
    StatusPreviewComponent,
    MarketAnalystComponent
  ],
  templateUrl: './central-hub.component.html',
  styleUrl: './central-hub.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CentralHubComponent {
  @Input() centralHubCvCounter = signal<number>(0);
  @Input() tabIndex = signal(0);
  @Output() genericEmitter = new EventEmitter<void>();
  public status: WritableSignal<string[]> = signal<string[]>([]);
  public progressData: WritableSignal<ITableDataRow[]> = signal<ITableDataRow[]>([]);
  public progressDates: WritableSignal<string[]> = signal<string[]>([]);
  constructor(private stateService: StateService) {
    effect(() => {
      this.status.set(this.stateService.statusPreviewsList);
      this.progressData.set(this.stateService.tableDataResponse$);
    }, { allowSignalWrites: true })
  }
}
