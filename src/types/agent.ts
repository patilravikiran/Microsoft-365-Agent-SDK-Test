/**
 * TypeScript Type Definitions for Microsoft 365 Agent SDK
 * Contains all interface definitions for agent configuration, responses,
 * activities, and message requests used throughout the application.
 */

/**
 * Agent configuration interface containing authentication and connection details
 */
export interface AgentConfig {
  clientId: string;
  tenantId: string;
  botIdentifier: string;
  environmentId: string;
}

/**
 * Structured agent response interface with support for text, adaptive cards, and metadata
 */
export interface AgentResponse {
  message: string;
  success: boolean;
  timestamp: string;
  conversationId: string;
  metadata?: {
    duration?: number;
    tokens?: number;
    model?: string;
    error?: boolean | string;
    botId?: string;
    environmentId?: string;
    authenticated?: boolean;
    endpoint?: string;
    apiResponse?: any;
    watermark?: string;
    activitiesCount?: number;
    agentResponseId?: string;
    connectionEstablished?: boolean;
    note?: string;
    conversationId?: string;
    suggestedActions?: any[];
    adaptiveCards?: any[];
    hasAdaptiveCards?: boolean;
    hasText?: boolean;
    hasSuggestedActions?: boolean;
    fullActivities?: any[];
  };
}

/**
 * Activity interface representing individual conversation activities
 */
export interface Activity {
  type: string;
  id: string;
  timestamp: string;
  from: {
    id: string;
    name?: string;
  };
  text?: string;
  value?: any;
  channelData?: any;
}

/**
 * Message request interface for sending messages to agents
 */
export interface MessageRequest {
  text: string;
  userId?: string;
  conversationId?: string;
  locale?: string;
}
