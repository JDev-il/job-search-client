import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MarketAnalystComponent } from '../market-analyst/market-analyst.component';
import { PositionsListComponent } from '../positions-list/positions-list.component';
import { ProgressViewerComponent } from '../progress-viewer/progress-viewer.component';
import { StatusPreviewComponent } from '../status-preview/status-preview.component';
import { StateService } from './../../../shared/services/state.service';
@Component({
  selector: 'app-central-hub',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    ProgressViewerComponent,
    PositionsListComponent,
    StatusPreviewComponent,
    MarketAnalystComponent,
    CommonModule
  ],
  templateUrl: './central-hub.component.html',
  styleUrl: './central-hub.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CentralHubComponent {
  constructor(private stateService: StateService) {
    effect(() => {
    }, { allowSignalWrites: true })
  }
}
