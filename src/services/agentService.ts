/**
 * Microsoft 365 Agent SDK Service
 *
 * This service provides authentication and communication with Microsoft 365 Copilot Studio agents.
 * It handles MSAL authentication, token management, and agent interactions through the official SDK.
 */

import { AgentConfig, AgentResponse } from "../types/agent";
import {
  CopilotStudioClient,
  ConnectionSettings,
} from "@microsoft/agents-copilotstudio-client";
import {
  PublicClientApplication,
  Configuration,
  AccountInfo,
  AuthenticationResult,
} from "@azure/msal-browser";

/**
 * Authentication error interface for structured error handling
 */
interface AuthError {
  name: string;
  message: string;
  type: string;
  timestamp: string;
}

/**
 * Authentication status interface for real-time status tracking
 */
export interface AuthStatus {
  isAuthenticated: boolean;
  error?: AuthError;
  tokenInfo?: {
    hasToken: boolean;
    expiresAt: string | null;
    isValid: boolean;
  };
}

/**
 * Power Platform Authentication Service
 *
 * Handles MSAL authentication for Power Platform APIs with automatic token management,
 * caching, and renewal. Provides secure browser-based authentication for Copilot Studio.
 */
class PCFAuth {
  private msalInstance: PublicClientApplication | null = null;
  private config: AgentConfig | null = null;
  private scopes = ["https://api.powerplatform.com/.default"];
  private cachedToken: string | null = null;
  private tokenExpiryTime: Date | null = null;
  private authStatusCallback?: (status: AuthStatus) => void;

  /**
   * Initializes MSAL instance with agent configuration
   * @param agentConfig - Agent configuration containing clientId and tenantId
   * @throws Error if required configuration is missing
   */
  initialize(agentConfig: AgentConfig): void {
    if (!agentConfig.clientId || !agentConfig.tenantId) {
      const error = new Error(
        "ClientId and TenantId are required for authentication"
      );
      this.notifyAuthError(error);
      throw error;
    }

    this.config = agentConfig;

    const msalConfig: Configuration = {
      auth: {
        clientId: agentConfig.clientId,
        authority: `https://login.microsoftonline.com/${agentConfig.tenantId}`,
        redirectUri:
          typeof window !== "undefined" ? window.location.origin : "",
      },
      cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true,
      },
    };

    this.msalInstance = new PublicClientApplication(msalConfig);
  }

  /**
   * Acquires access token with automatic caching and renewal
   * @returns Promise<string> - Valid access token for Power Platform API
   * @throws Error if authentication fails or token cannot be acquired
   */
  async acquireToken(): Promise<string> {
    if (this.isCachedTokenValid()) {
      return this.cachedToken!;
    }

    this.validateInitialization();

    try {
      await this.initializeMsalInstance();
      const accounts = await this.ensureUserIsLoggedIn();
      const token = await this.acquireTokenSilentOrInteractive(accounts);

      this.notifyAuthSuccess();
      return token;
    } catch (error) {
      this.notifyAuthError(error as Error);
      throw error;
    }
  }

  /**
   * Checks if cached token is still valid
   * @returns boolean - True if cached token exists and is not expired
   */
  private isCachedTokenValid(): boolean {
    return Boolean(
      this.cachedToken &&
        this.tokenExpiryTime &&
        new Date() < this.tokenExpiryTime
    );
  }

  /**
   * Validates that MSAL instance and configuration are properly initialized
   * @throws Error if MSAL instance or configuration is not initialized
   */
  private validateInitialization(): void {
    if (!this.msalInstance || !this.config) {
      const error = new Error(
        "PCF Auth not initialized - call initialize() first"
      );
      this.notifyAuthError(error);
      throw error;
    }
  }

  /**
   * Initializes the MSAL instance after creation
   * @returns Promise<void>
   */
  private async initializeMsalInstance(): Promise<void> {
    await this.msalInstance!.initialize();
  }

  /**
   * Ensures user is logged in, performs interactive login if no accounts exist
   * @returns Promise<AccountInfo[]> - Array of user accounts
   */
  private async ensureUserIsLoggedIn(): Promise<AccountInfo[]> {
    const accounts = this.msalInstance!.getAllAccounts();

    if (accounts.length === 0) {
      await this.performInteractiveLogin("No existing accounts found");
      return this.msalInstance!.getAllAccounts();
    }

    return accounts;
  }

  /**
   * Attempts silent token acquisition, falls back to interactive login if needed
   * @param accounts - Array of user accounts to use for token acquisition
   * @returns Promise<string> - Access token
   */
  private async acquireTokenSilentOrInteractive(
    accounts: AccountInfo[]
  ): Promise<string> {
    try {
      const result = await this.msalInstance!.acquireTokenSilent({
        scopes: this.scopes,
        account: accounts[0],
      });

      return this.cacheAndReturnToken(result, "silent");
    } catch (silentError) {
      const result = await this.performInteractiveLoginForToken();
      return this.cacheAndReturnToken(result, "interactive");
    }
  }

  /**
   * Performs interactive login via popup window
   * @param reason - Reason for performing interactive login (for logging)
   * @returns Promise<void>
   */
  private async performInteractiveLogin(reason: string): Promise<void> {
    try {
      await this.msalInstance!.loginPopup({ scopes: this.scopes });
    } catch (loginError) {
      const error = new Error(
        `Interactive login failed: ${this.getErrorMessage(loginError)}`
      );
      this.notifyAuthError(error);
      throw error;
    }
  }

  /**
   * Performs interactive login and returns authentication result with token
   * @returns Promise<AuthenticationResult> - Authentication result containing token
   */
  private async performInteractiveLoginForToken(): Promise<AuthenticationResult> {
    try {
      const result = await this.msalInstance!.loginPopup({
        scopes: this.scopes,
      });
      return result;
    } catch (interactiveError) {
      const error = new Error(
        `Interactive token acquisition failed: ${this.getErrorMessage(
          interactiveError
        )}`
      );
      this.notifyAuthError(error);
      throw error;
    }
  }

  /**
   * Caches authentication result and returns access token
   * @param result - Authentication result from MSAL
   * @param method - Authentication method used (for logging)
   * @returns string - Access token
   */
  private cacheAndReturnToken(
    result: AuthenticationResult,
    method: string
  ): string {
    this.cachedToken = result.accessToken;
    this.tokenExpiryTime = result.expiresOn || null;
    return result.accessToken;
  }

  /**
   * Extracts error message from unknown error type
   * @param error - Error object of unknown type
   * @returns string - Human-readable error message
   */
  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : "Unknown error";
  }

  /**
   * Creates structured authentication error object
   * @param error - Error object of unknown type
   * @returns AuthError - Structured error object with metadata
   */
  private createAuthError(error: unknown): AuthError {
    return {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      type: typeof error,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Notifies callback about successful authentication
   */
  private notifyAuthSuccess(): void {
    if (this.authStatusCallback) {
      this.authStatusCallback({
        isAuthenticated: true,
        tokenInfo: this.getTokenInfo(),
      });
    }
  }

  /**
   * Notifies callback about authentication error
   * @param error - Error that occurred during authentication
   */
  private notifyAuthError(error: Error): void {
    if (this.authStatusCallback) {
      this.authStatusCallback({
        isAuthenticated: false,
        error: this.createAuthError(error),
      });
    }
  }

  /**
   * Gets current token information and validity status
   * @returns Object containing token status, expiration, and validity
   */
  getTokenInfo(): {
    hasToken: boolean;
    expiresAt: string | null;
    isValid: boolean;
  } {
    const hasToken = Boolean(this.cachedToken);
    const expiresAt = this.tokenExpiryTime?.toISOString() || null;
    const isValid = this.isCachedTokenValid();

    return { hasToken, expiresAt, isValid };
  }
}

/**
 * Microsoft 365 Agent Client
 *
 * Main client for communicating with Microsoft 365 Copilot Studio agents.
 * Handles authentication, connection management, and message sending/receiving.
 * Provides structured responses with support for adaptive cards and suggested actions.
 */
export class AgentClient {
  private config: AgentConfig;
  private authService: PCFAuth;
  private copilotClient: CopilotStudioClient | null = null;
  private currentConversationId: string | null = null;

  /**
   * Creates new AgentClient instance
   * @param config - Agent configuration with authentication and connection details
   */
  constructor(config: AgentConfig) {
    this.config = config;
    this.authService = new PCFAuth();
    this.initializeAuth();
  }

  /**
   * Initializes authentication service with agent configuration
   */
  private initializeAuth(): void {
    try {
      this.authService.initialize(this.config);
    } catch (error) {
      console.error("Failed to initialize auth service:", error);
    }
  }

  /**
   * Resets conversation context by clearing stored conversation ID
   */
  resetConversationContext(): void {
    this.currentConversationId = null;
  }

  /**
   * Sends message to agent and returns structured response
   * @param message - User message to send to the agent
   * @param continueConversation - Whether to continue in same conversation context
   * @returns Promise<AgentResponse> - Structured response with text, adaptive cards, and metadata
   * @throws Error if configuration is invalid or communication fails
   */
  async sendMessage(
    message: string,
    continueConversation: boolean = true
  ): Promise<AgentResponse> {
    // Record start time for duration calculation
    const startTime = new Date();
    const startTimeISO = startTime.toISOString();

    try {
      const validation = this.validateConfig();
      if (!validation.isValid) {
        throw new Error(
          `Configuration invalid: ${validation.errors.join(", ")}`
        );
      }

      const accessToken = await this.authService.acquireToken();
      await this.initializeCopilotClient(accessToken);
      const agentResponse = await this.sendMessageToAgent(
        message,
        continueConversation
      );

      // Record end time and calculate duration
      const endTime = new Date();
      const endTimeISO = endTime.toISOString();
      const duration = endTime.getTime() - startTime.getTime();

      const response: AgentResponse = {
        message:
          agentResponse.text ||
          agentResponse.message ||
          (agentResponse.hasAdaptiveCards ? "" : "No response from agent"),
        success: true,
        timestamp: endTimeISO, // Use end time as the response timestamp
        conversationId: agentResponse.conversationId || agentResponse.id || "",
        metadata: {
          botId: this.config.botIdentifier,
          environmentId: this.config.environmentId,
          authenticated: true,
          agentResponseId: agentResponse.id,
          duration: duration, // Calculated duration in milliseconds
          startTime: startTimeISO,
          endTime: endTimeISO,
          conversationId: agentResponse.conversationId,
          suggestedActions: agentResponse.suggestedActions || [],
          adaptiveCards: agentResponse.adaptiveCards || [],
          activitiesCount: agentResponse.activities?.length || 0,
          hasAdaptiveCards: agentResponse.hasAdaptiveCards || false,
          hasText: agentResponse.hasText || false,
          hasSuggestedActions: agentResponse.hasSuggestedActions || false,
          fullActivities: agentResponse.activities || [],
        },
      };

      return response;
    } catch (error: any) {
      // Record end time for error cases as well
      const endTime = new Date();
      const endTimeISO = endTime.toISOString();
      const duration = endTime.getTime() - startTime.getTime();

      return {
        message: `API Error: ${error.message}`,
        success: false,
        timestamp: endTimeISO,
        conversationId: "error",
        metadata: {
          duration: duration,
          startTime: startTimeISO,
          endTime: endTimeISO,
          error: error.message,
          botId: this.config.botIdentifier,
          environmentId: this.config.environmentId,
          authenticated: false,
        },
      };
    }
  }

  /**
   * Initializes Copilot Studio client with access token and connection settings
   * @param accessToken - Valid access token for Power Platform API
   * @returns Promise<void>
   * @throws Error if client initialization fails
   */
  private async initializeCopilotClient(accessToken: string): Promise<void> {
    try {
      const connectionSettings: ConnectionSettings = {
        appClientId: this.config.clientId,
        tenantId: this.config.tenantId,
        environmentId: this.config.environmentId,
        agentIdentifier: this.config.botIdentifier,
      };

      this.copilotClient = new CopilotStudioClient(
        connectionSettings,
        accessToken
      );
    } catch (error: any) {
      throw new Error(
        `Failed to initialize Copilot Studio Client: ${error.message}`
      );
    }
  }

  /**
   * Sends message to agent using Copilot Studio client
   * @param message - User message to send
   * @param continueConversation - Whether to continue in same conversation context
   * @returns Promise<any> - Agent response from Copilot Studio
   * @throws Error if client is not initialized or message sending fails
   */
  private async sendMessageToAgent(
    message: string,
    continueConversation: boolean = true
  ): Promise<any> {
    if (!this.copilotClient) {
      throw new Error("Copilot Studio Client not initialized");
    }

    try {
      let conversationId: string;

      // Reset conversation context if not continuing
      if (!continueConversation) {
        this.currentConversationId = null;
      }

      // Use existing conversation ID or start new conversation
      if (this.currentConversationId && continueConversation) {
        conversationId = this.currentConversationId;
      } else {
        const conversationActivity =
          await this.copilotClient.startConversationAsync(true);
        const newConversationId = conversationActivity.conversation?.id;

        if (!newConversationId) {
          throw new Error("Failed to get conversation ID from agent");
        }

        conversationId = newConversationId;
        // Store conversation ID for future use
        this.currentConversationId = conversationId;
      }

      const replies = await this.copilotClient.askQuestionAsync(
        message,
        conversationId
      );

      let responseText = "";
      let textMessages: string[] = [];
      let suggestedActions: any[] = [];
      let adaptiveCards: any[] = [];
      let allActivities: any[] = [];

      replies.forEach((activity: any) => {
        allActivities.push(activity);

        if (activity.type === "message") {
          if (activity.text && activity.text.trim()) {
            textMessages.push(activity.text.trim());
          }

          if (activity.attachments && activity.attachments.length > 0) {
            activity.attachments.forEach((attachment: any) => {
              if (
                attachment.contentType ===
                "application/vnd.microsoft.card.adaptive"
              ) {
                adaptiveCards.push({
                  content: attachment.content,
                  contentType: attachment.contentType,
                  name: attachment.name || "Adaptive Card",
                });
              }
            });
          }

          if (activity.suggestedActions?.actions) {
            suggestedActions.push(...activity.suggestedActions.actions);
          }
        }
      });

      // Join all text messages with line breaks
      responseText = textMessages.join("\n\n");

      return {
        text: responseText || "",
        message: responseText || "",
        id: `response-${Date.now()}`,
        conversationId: conversationId,
        activities: allActivities,
        suggestedActions: suggestedActions,
        adaptiveCards: adaptiveCards,
        agentResponseReceived: true,
        hasAdaptiveCards: adaptiveCards.length > 0,
        hasText: !!responseText,
        hasSuggestedActions: suggestedActions.length > 0,
      };
    } catch (error: any) {
      throw new Error(`Failed to communicate with agent: ${error.message}`);
    }
  }

  /**
   * Validates agent configuration for required fields and format
   * @returns Object containing validation result and list of errors
   */
  public validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.config.clientId) {
      errors.push("Client ID is required");
    }

    if (!this.config.tenantId) {
      errors.push("Tenant ID is required");
    }

    if (!this.config.botIdentifier) {
      errors.push("Bot Identifier is required");
    }

    if (!this.config.environmentId) {
      errors.push("Environment ID is required");
    }

    if (this.config.clientId && !this.isValidGuid(this.config.clientId)) {
      errors.push("Client ID must be a valid GUID");
    }

    if (this.config.tenantId && !this.isValidGuid(this.config.tenantId)) {
      errors.push("Tenant ID must be a valid GUID");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates if a string is a properly formatted GUID
   * @param value - String to validate as GUID
   * @returns boolean - True if string matches GUID format
   */
  private isValidGuid(value: string): boolean {
    const guidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return guidRegex.test(value);
  }
}

/**
 * Factory function to create new AgentClient instance
 * @param config - Agent configuration with authentication and connection details
 * @returns AgentClient - New configured agent client instance
 */
export function createAgentClient(config: AgentConfig): AgentClient {
  return new AgentClient(config);
}
