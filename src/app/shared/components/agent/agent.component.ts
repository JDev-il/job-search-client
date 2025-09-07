import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MCPService } from '../../../core/services/mcp.service';

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentComponent {
  public userInputTitle = signal('');
  public userInput = signal('');
  public loading = signal(false);
  public isAgent = signal(true);
  private debounceTimeout = signal<number | null>(null);

  constructor(private mcpService: MCPService) {
    // Effect to auto-fetch suggestions when criteria change
    // const currentSuggestionsList = this.mcpService.suggestions();
  }

  public onUserInput(ev: Event): void {
    const value = (ev.target as HTMLInputElement)?.value;
    clearTimeout(this.debounceTimeout()!);
    const timeout = setTimeout(() => {
      this.userInput.set(value);
      this.debounceTimeout.set(null);
    }, 600) as unknown as number;
    this.debounceTimeout.set(timeout);
  }

  public closeAgent() {
    this.isAgent.set(false);
  }
}
