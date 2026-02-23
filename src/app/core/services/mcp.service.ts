// src/app/core/services/mcp.service.ts
import { Injectable, Signal } from '@angular/core';
import { DataService } from '../../shared/services/data.service';
import { StateService } from '../../shared/services/state.service';
import { AgentSuggestion } from '../models/agent.interface';
import { IMCPRequest } from '../models/mcp.inrerface';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class MCPService {
  constructor(
    private apiService: ApiService,
    private stateService: StateService,
    private dataService: DataService,
    private authService: AuthService
  ) { }

  public get suggestions(): Signal<AgentSuggestion[]> {
    return this.dataService.suggestions;
  }

  public sendUserInput(mcpPrompt: IMCPRequest): void {
    const token = this.authService.isAuthenticated ? this.authService.getToken() : null;
    this.apiService.mcpRequest(mcpPrompt, token).subscribe();
  }
}
