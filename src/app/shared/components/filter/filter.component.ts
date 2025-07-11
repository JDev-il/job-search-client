import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, WritableSignal } from '@angular/core';
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
  @Output() filterValue: EventEmitter<number> = new EventEmitter();
  @Input({ required: true }) currentDayFilter!: WritableSignal<number>;
  @Input() isDataLength: boolean = false;

  constructor() {
  }

  public onChangeFilter(e: MatButtonToggleChange) {
    const value = +e.value;
    this.currentDayFilter.set(value);
    this.filterValue.emit(e.value);
  }
}
