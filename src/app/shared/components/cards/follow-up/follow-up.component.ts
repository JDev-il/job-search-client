import { ChangeDetectionStrategy, Component, computed, effect, inject, ViewEncapsulation } from '@angular/core';
import { IResponseRatesData } from '../../../../core/models/data.interface';
import { FollowUpEntry, JobSearchFollowUpCircles } from '../../../../core/models/job-search.interface';
import { ITableDataRow } from '../../../../core/models/table.interface';
import { FOLLOWUP_MAX, SUBMITTED_MAX } from '../../../constants/additional-data';
import { PIPELINE_ACTIVE, PIPELINE_PASSED, PIPELINE_PENDING, PIPELINE_REJECTED } from '../../../constants/charts';
import { DataService } from '../../../services/data.service';

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

  constructor() {
    effect(() => {
      this.followUpData();
    });
  }

  public readonly followUpData = computed(() => {
    const tableData = this.dataService.tableDataResponse();
    const entries = this.buildEntries(tableData);
    const counts = this.buildCounts(entries);
    const responseRate = this.calcResponseRate(tableData);
    return { entries, counts, responseRate };
  });

  private buildEntries(tableData: ITableDataRow[]): FollowUpEntry[] {
    const today = Date.now();
    return tableData
      .filter(row => PIPELINE_PENDING.has(row.status) || PIPELINE_ACTIVE.has(row.status))
      .map(row => {
        const daysElapsed = row.applicationDate
          ? Math.floor((today - new Date(row.applicationDate.toString()).getTime()) / 86400000)
          : 0;
        const urgency: FollowUpEntry['urgency'] =
          daysElapsed <= SUBMITTED_MAX ? 'submitted' :
            daysElapsed <= FOLLOWUP_MAX ? 'followup' : 'overdue';
        return { companyName: row.companyName, status: row.status, daysElapsed, urgency };
      })
      .sort((a, b) => b.daysElapsed - a.daysElapsed);
  }

  private buildCounts(entries: FollowUpEntry[]): JobSearchFollowUpCircles {
    return {
      submitted: entries.filter(e => e.urgency === 'submitted').length,
      followup: entries.filter(e => e.urgency === 'followup').length,
      overdue: entries.filter(e => e.urgency === 'overdue').length,
    };
  }

  private calcResponseRate(tableData: ITableDataRow[]): IResponseRatesData | null {
    if (!tableData.length) return null;
    const interviewRate = tableData.filter((row) => PIPELINE_ACTIVE.has(row.status));
    const responded = tableData.filter(row =>
      PIPELINE_ACTIVE.has(row.status) ||
      PIPELINE_PASSED.has(row.status) ||
      PIPELINE_REJECTED.has(row.status)
    ).length;
    return null
    // return Math.round(responded / tableData.length * 100);
  }
}
