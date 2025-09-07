export interface AgentSuggestion {
  text: string | string[];
  id: string;
  source: 'user' | 'agent' | 'criteria_changed' | 'system';
  type?: 'info' | 'success' | 'warning' | 'error' | 'action';
  score?: number;
  context?: Record<string, unknown>;
}
