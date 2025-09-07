// src/app/core/services/mcp.service.ts
import { Injectable, Signal } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { StateService } from '../../shared/services/state.service';
import { AgentSuggestion } from '../models/agent.interface';

@Injectable({ providedIn: 'root' })
export class MCPService {
  constructor(
    private stateService: StateService,
    private dataService: DataService
  ) { }

  public get suggestions(): Signal<AgentSuggestion[]> {
    return this.dataService.suggestions;
  }
  public submitUserInput(input: string): void {
    // this.dataService.processUserPrompt(input);
  }
}
