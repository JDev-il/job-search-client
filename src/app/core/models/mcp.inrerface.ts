export interface IMCPRequest {
  model: "gpt-3" | "gpt-4" | "gpt-4.1" | "gpt-5",
  input: string | undefined
}
export interface IMCPResponse {
  id: string,
  object: "response",
  created_at: number,
  status: "completed",
  error: null,
  incomplete_details: null,
  instructions: null,
  max_output_tokens: null,
  model: string,
  output: [
    {
      type: "message",
      id: string,
      status: "completed",
      role: "assistant",
      content: [
        {
          type: string,
          text: string,
          annotations: unknown[]
        }
      ]
    }
  ],
  parallel_tool_calls: boolean,
  previous_response_id: null,
  reasoning: {
    effort: null,
    summary: null
  },
  store: boolean,
  temperature: number,
  text: {
    format: {
      type: "text"
    }
  },
  tool_choice: "auto",
  tools: unknown[],
  top_p: number,
  truncation: "disabled",
  usage: {
    input_tokens: number,
    input_tokens_details: {
      cached_tokens: number
    },
    output_tokens: number,
    output_tokens_details: {
      reasoning_tokens: number
    },
    total_tokens: number
  },
  user: null,
  metadata: null
}
