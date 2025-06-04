import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [MatButtonToggleModule, MatCheckboxModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class FilterComponent {
  @Output() filterValue: EventEmitter<string> = new EventEmitter();
  @Input() currentDayFilter: WritableSignal<number> = signal(0);
  @Input() isDataLength: boolean = false;

  public onChangeFilter(e: MatButtonToggleChange) {
    this.filterValue.emit(e.value);
  }
}
