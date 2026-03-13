import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { IMCPRequest } from '../../../core/models/mcp.inrerface';
import { MCPService } from '../../../core/services/mcp.service';
@Component({
    selector: 'app-agent',
    imports: [MatInputModule, MatFormFieldModule, MatInput, MatProgressSpinner],
    templateUrl: './agent.component.html',
    styleUrls: ['./agent.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentComponent {
  private mcpService = inject(MCPService);
  private debounceTimeout = signal<number | null>(null);
  public isAgent = signal(true);
  public userInputTitle = signal('');
  public userInput = signal('');
  public loading = signal(false);

  constructor() {
    effect(() => {
      const input = this.userInput();
      if (input) {
        this.loading.set(true);
        this.mcpService.sendUserInput(<IMCPRequest>{ input: input, model: "gpt-4" })
      } else {
        this.loading.set(false);
      }
    }, { allowSignalWrites: true });
  }

  public onUserInput(ev: Event): void {
    const value = (ev.target as HTMLInputElement)?.value;
    const timeoutId = this.debounceTimeout();
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    const timeout = window.setTimeout(() => {
      this.debounceTimeout.set(null);
      this.userInput.set(value);
    }, 600);
    this.debounceTimeout.set(timeout);
  }

  public closeAgent(): void {
    this.isAgent.set(false);
  }
}
