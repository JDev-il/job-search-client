import { ChangeDetectionStrategy, Component, computed, inject, ViewEncapsulation } from '@angular/core';
import { FollowUpEntry } from '../../../../core/models/job-search.interface';
import { PIPELINE_ACTIVE, PIPELINE_PASSED, PIPELINE_PENDING, PIPELINE_REJECTED } from '../../../services/charts.service';
import { DataService } from '../../../services/data.service';

const SUBMITTED_MAX = 7;
const FOLLOWUP_MAX = 14;

@Component({
  selector: 'app-follow-up',
  imports: [],
  templateUrl: './follow-up.component.html',
  styleUrl: './follow-up.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class FollowUpComponent {
  private dataService = inject(DataService);

  public readonly followUpData = computed(() => {
    const tableData = this.dataService.tableDataResponse();
    const today = Date.now();

    const entries: FollowUpEntry[] = tableData
      .filter(row => PIPELINE_PENDING.has(row.status) || PIPELINE_ACTIVE.has(row.status))
      .map(row => {
        console.log(row);

        const daysElapsed = row.applicationDate
          ? Math.floor((today - new Date(row.applicationDate.toString()).getTime()) / 86_400_000)
          : 0;
        const urgency: FollowUpEntry['urgency'] =
          daysElapsed <= SUBMITTED_MAX ? 'submitted' :
            daysElapsed <= FOLLOWUP_MAX ? 'followup' : 'overdue';
        return { companyName: row.companyName, status: row.status, daysElapsed, urgency };
      })
      .sort((a, b) => b.daysElapsed - a.daysElapsed);

    const responded = tableData.filter(row =>
      PIPELINE_ACTIVE.has(row.status) ||
      PIPELINE_PASSED.has(row.status) ||
      PIPELINE_REJECTED.has(row.status)
    ).length;

    return {
      entries,
      counts: {
        submitted: entries.filter(e => e.urgency === 'submitted').length,
        followup: entries.filter(e => e.urgency === 'followup').length,
        overdue: entries.filter(e => e.urgency === 'overdue').length,
      },
      responseRate: tableData.length ? Math.round(responded / tableData.length * 100) : 0,
    };
  });
}
