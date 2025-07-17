/**
 * Agent Interface Component
 *
 * Main interface component providing comprehensive agent interaction capabilities.
 * Features include:
 * - Message input and sending
 * - Agent response display with adaptive cards
 * - Conversation history tracking
 * - Configuration modal management
 * - Error handling and user feedback
 * - Interactive icons and modern UI
 */

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Oval } from "react-loader-spinner";
import ConfigurationForm from "./ConfigurationForm";
import MessageInterface from "./MessageInterface";
import ResponseDisplay from "./ResponseDisplay";
import AdaptiveCardRenderer from "./AdaptiveCardRenderer";
import Modal from "./Modal";
import { AgentConfig, AgentResponse } from "../types/agent";
import { createAgentClient, AgentClient } from "../services/agentService";

const Container = styled.div`
  width: 100%;
  max-width: 1800px; /* Increased from 1600px to 1800px */
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  margin: 20px;
`;

const ConfigButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ChatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 480px; /* Increased conversation history width from 400px to 480px */
  gap: 30px;
  margin-bottom: 30px;

  @media (max-width: 1400px) {
    grid-template-columns: 1fr 1fr 400px; /* Smaller conversation history on medium screens */
  }

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 25px;
  border: 1px solid #e9ecef;
  max-height: 600px;
  overflow-y: auto;
`;

const SectionTitle = styled.h2`
  color: #343a40;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Icon = styled.span`
  font-size: 1.3rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ConversationHistory = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 25px;
  border: 1px solid #e9ecef;
  max-height: 600px;
  overflow-y: auto;
`;

const ConversationItem = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const MessageRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
`;

const MessageIcon = styled.div`
  flex-shrink: 0;
  width: 36px; /* Increased from 32px */
  height: 36px; /* Increased from 32px */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); /* Added shadow */
  transition: transform 0.2s ease; /* Added hover effect */

  &:hover {
    transform: scale(1.05); /* Slight scale on hover */
  }

  &.user {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }

  &.agent {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    box-shadow: 0 2px 8px rgba(17, 153, 142, 0.3);
  }
`;

const MessageContent = styled.div`
  flex: 1;
  line-height: 1.5;

  &.user {
    font-weight: 600;
    color: #495057;
  }

  &.agent {
    color: #6c757d;
    font-size: 0.95rem;
  }
`;

const MessageTimestamp = styled.div`
  font-size: 0.8rem;
  color: #adb5bd;
  margin-top: 8px;
  text-align: right;
`;

/**
 * User icon component with modern design and gradient styling
 * @returns JSX.Element - SVG user icon
 */
const UserIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Background circle with gradient */}
    <circle
      cx="16"
      cy="16"
      r="15"
      fill="rgba(255,255,255,0.15)"
      stroke="rgba(255,255,255,0.3)"
      strokeWidth="1"
    />

    {/* Modern user avatar */}
    <circle cx="16" cy="12" r="5" fill="white" />

    {/* Body/shoulders */}
    <path
      d="M6 26C6 21 10.5 17 16 17C21.5 17 26 21 26 26"
      fill="white"
      stroke="none"
    />

    {/* Subtle highlight */}
    <circle cx="14" cy="10" r="1.5" fill="rgba(102, 126, 234, 0.3)" />
  </svg>
);

/**
 * Agent icon component with robot design and LED-style elements
 * @returns JSX.Element - SVG agent/robot icon
 */
const AgentIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Main robot head */}
    <rect
      x="6"
      y="6"
      width="20"
      height="16"
      rx="4"
      fill="white"
      stroke="none"
    />

    {/* Screen/face area */}
    <rect
      x="8"
      y="8"
      width="16"
      height="12"
      rx="2"
      fill="rgba(17, 153, 142, 0.2)"
      stroke="none"
    />

    {/* Eyes - modern LED style */}
    <circle cx="12" cy="13" r="2" fill="rgba(17, 153, 142, 0.8)" />
    <circle cx="20" cy="13" r="2" fill="rgba(17, 153, 142, 0.8)" />
    <circle cx="12" cy="13" r="1" fill="white" />
    <circle cx="20" cy="13" r="1" fill="white" />

    {/* Mouth - LED strip */}
    <rect
      x="11"
      y="17"
      width="10"
      height="1.5"
      rx="0.75"
      fill="rgba(17, 153, 142, 0.6)"
    />

    {/* Antenna/connectors */}
    <circle cx="9" cy="4" r="1" fill="white" />
    <circle cx="23" cy="4" r="1" fill="white" />
    <line x1="9" y1="5" x2="9" y2="6" stroke="white" strokeWidth="1" />
    <line x1="23" y1="5" x2="23" y2="6" stroke="white" strokeWidth="1" />

    {/* Side ports */}
    <rect
      x="4"
      y="12"
      width="2"
      height="4"
      rx="1"
      fill="rgba(255,255,255,0.7)"
    />
    <rect
      x="26"
      y="12"
      width="2"
      height="4"
      rx="1"
      fill="rgba(255,255,255,0.7)"
    />

    {/* Base connection */}
    <rect
      x="12"
      y="22"
      width="8"
      height="2"
      rx="1"
      fill="rgba(255,255,255,0.5)"
    />
    <line x1="14" y1="24" x2="18" y2="24" stroke="white" strokeWidth="1" />
  </svg>
);

const ErrorPopup = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
  padding: 20px 24px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.4);
  z-index: 1000;
  max-width: 400px;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const ErrorTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ErrorMessage = styled.p`
  margin: 0 0 16px 0;
  font-size: 0.9rem;
  line-height: 1.4;
  opacity: 0.95;
`;

const ErrorActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ErrorButton = styled.button<{ primary?: boolean }>`
  background: ${(props) =>
    props.primary ? "white" : "rgba(255, 255, 255, 0.2)"};
  color: ${(props) => (props.primary ? "#ff6b6b" : "white")};
  border: 1px solid
    ${(props) => (props.primary ? "white" : "rgba(255, 255, 255, 0.3)")};
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.primary ? "#f8f8f8" : "rgba(255, 255, 255, 0.3)"};
    border-color: ${(props) =>
      props.primary ? "#f0f0f0" : "rgba(255, 255, 255, 0.5)"};
  }
`;

const CombinedControlsSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ConversationToggle = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid #dee2e6;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  flex: 1;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
`;

const ToggleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 220px;
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-weight: 600;
  color: #495057;
  font-size: 0.95rem;
  transition: color 0.2s ease;

  &:hover {
    color: #343a40;
  }
`;

const ToggleSwitch = styled.input`
  width: 50px;
  height: 28px;
  background: ${(props) =>
    props.checked
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)"};
  border-radius: 14px;
  appearance: none;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);

  &:before {
    content: "";
    position: absolute;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: white;
    top: 3px;
    left: ${(props) => (props.checked ? "25px" : "3px")};
    transition: all 0.3s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ToggleHelperText = styled.div`
  color: #6c757d;
  font-size: 0.85rem;
  line-height: 1.4;
  flex: 1;
  min-width: 320px;
  font-style: italic;
`;

const AgentInterface: React.FC = () => {
  const [config, setConfig] = useState<AgentConfig>({
    clientId: "",
    tenantId: "",
    botIdentifier: "",
    environmentId: "",
  });

  const [message, setMessage] = useState<string>("");
  const [response, setResponse] = useState<AgentResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [continueConversation, setContinueConversation] =
    useState<boolean>(false);
  const [agentClient, setAgentClient] = useState<AgentClient | null>(null);
  const [conversationHistory, setConversationHistory] = useState<
    Array<{
      message: string;
      response: AgentResponse;
      timestamp: string;
    }>
  >([]);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [showErrorPopup, setShowErrorPopup] = useState<boolean>(false);
  const [errorDetails, setErrorDetails] = useState<{
    title: string;
    message: string;
    canNavigateToConfig: boolean;
  } | null>(null);

  // Reset conversation context when toggle changes to false
  useEffect(() => {
    if (!continueConversation && agentClient) {
      agentClient.resetConversationContext();
    }
  }, [continueConversation, agentClient]);

  /**
   * Validates current agent configuration for required fields
   * @returns Object containing validation status and missing fields
   */
  const validateConfiguration = (): {
    isValid: boolean;
    missingFields: string[];
  } => {
    const missingFields: string[] = [];

    if (!config.clientId.trim()) missingFields.push("Client ID");
    if (!config.tenantId.trim()) missingFields.push("Tenant ID");
    if (!config.botIdentifier.trim()) missingFields.push("Bot Identifier");
    if (!config.environmentId.trim()) missingFields.push("Environment ID");

    return {
      isValid: missingFields.length === 0,
      missingFields,
    };
  };

  /**
   * Shows configuration error popup with specified missing fields
   * @param missingFields - Array of missing configuration field names
   */
  const showConfigurationError = (missingFields: string[]) => {
    setErrorDetails({
      title: "🔧 Configuration Required",
      message: `Please configure the following required fields before sending messages: ${missingFields.join(
        ", "
      )}. Click "Open Configuration" to set up your agent connection.`,
      canNavigateToConfig: true,
    });
    setShowErrorPopup(true);
  };

  /**
   * Dismisses error popup dialog
   */
  const dismissErrorPopup = () => {
    setShowErrorPopup(false);
    setErrorDetails(null);
  };

  /**
   * Opens configuration modal from error popup
   */
  const openConfigurationFromError = () => {
    setShowErrorPopup(false);
    setErrorDetails(null);
    setShowConfigModal(true);
  };

  /**
   * Handles configuration form submission and updates state
   * @param newConfig - Updated agent configuration
   */
  const handleConfigChange = (newConfig: AgentConfig) => {
    setConfig(newConfig);
    setError("");
    setShowErrorPopup(false);
    setShowConfigModal(false);

    // Create new agent client with updated configuration
    const newAgentClient = createAgentClient(newConfig);
    setAgentClient(newAgentClient);

    // Clear conversation history when configuration changes
    setConversationHistory([]);
  };

  /**
   * Handles configuration form cancellation
   */
  const handleConfigCancel = () => {
    setShowConfigModal(false);
  };

  /**
   * Handles message sending to agent with validation and error handling
   * @param messageText - User message to send to agent
   */
  const handleSendMessage = async (messageText: string) => {
    const validation = validateConfiguration();
    if (!validation.isValid) {
      showConfigurationError(validation.missingFields);
      return;
    }

    setMessage(messageText);
    setLoading(true);
    setError("");
    setShowErrorPopup(false);

    try {
      // Create agent client if not exists or config changed
      let currentClient = agentClient;
      if (!currentClient) {
        currentClient = createAgentClient(config);
        setAgentClient(currentClient);
      }

      const result = await currentClient.sendMessage(
        messageText,
        continueConversation
      );
      setResponse(result);

      setConversationHistory((prev) => [
        ...prev,
        {
          message: messageText,
          response: result,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles suggested action clicks by sending action as message
   * @param action - Suggested action text to execute
   */
  const handleSuggestedAction = async (action: string) => {
    await handleSendMessage(action);
  };
  return (
    <Container>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <CombinedControlsSection>
        <ConversationToggle>
          <ToggleSection>
            <ToggleLabel>
              <ToggleSwitch
                type="checkbox"
                checked={continueConversation}
                onChange={(e) => setContinueConversation(e.target.checked)}
              />
              Continue Conversation Context
            </ToggleLabel>
          </ToggleSection>
          <ToggleHelperText>
            {continueConversation ? (
              <span>
                <strong>✅ Enabled:</strong> Agent remembers previous messages
                and maintains conversation flow.
              </span>
            ) : (
              <span>
                <strong>🔄 Disabled:</strong> Each message starts fresh - no
                memory of previous context.
              </span>
            )}
          </ToggleHelperText>
        </ConversationToggle>

        <ConfigButton onClick={() => setShowConfigModal(true)}>
          ⚙️ Update Agent Configuration
        </ConfigButton>
      </CombinedControlsSection>

      <ChatGrid>
        <Section>
          <SectionTitle>
            <Icon>💬</Icon>
            Chat with Agent
          </SectionTitle>
          <MessageInterface
            onSendMessage={handleSendMessage}
            disabled={loading}
            currentMessage={message}
          />

          {loading && (
            <LoadingContainer>
              <Oval
                height={50}
                width={50}
                color="#667eea"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#764ba2"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            </LoadingContainer>
          )}
        </Section>

        <Section>
          <SectionTitle>
            <Icon>📤</Icon>
            Agent Response
          </SectionTitle>
          <ResponseDisplay
            response={response}
            onSuggestedAction={handleSuggestedAction}
          />
        </Section>

        <ConversationHistory>
          <SectionTitle>
            <Icon>💭</Icon>
            Conversation History
          </SectionTitle>
          {conversationHistory.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                color: "#6c757d",
                fontStyle: "italic",
                padding: "40px 20px",
              }}
            >
              No conversation history yet
            </div>
          ) : (
            conversationHistory
              .slice()
              .reverse()
              .map((item, index) => (
                <ConversationItem key={index}>
                  <MessageRow>
                    <MessageIcon className="user">
                      <UserIcon />
                    </MessageIcon>
                    <MessageContent className="user">
                      {item.message}
                    </MessageContent>
                  </MessageRow>
                  <MessageRow>
                    <MessageIcon className="agent">
                      <AgentIcon />
                    </MessageIcon>
                    <MessageContent className="agent">
                      {/* Show text message if available */}
                      {item.response.message &&
                        item.response.message.trim() && (
                          <div style={{ marginBottom: "12px" }}>
                            {item.response.message}
                          </div>
                        )}

                      {/* Show adaptive cards if available */}
                      {item.response.metadata?.adaptiveCards &&
                        item.response.metadata.adaptiveCards.length > 0 && (
                          <div>
                            {item.response.metadata.adaptiveCards.map(
                              (card, cardIndex) => (
                                <div
                                  key={cardIndex}
                                  style={{ marginBottom: "8px" }}
                                >
                                  <AdaptiveCardRenderer
                                    cardData={card}
                                    index={cardIndex}
                                  />
                                </div>
                              )
                            )}
                          </div>
                        )}

                      {/* Show placeholder if no content */}
                      {(!item.response.message ||
                        !item.response.message.trim()) &&
                        (!item.response.metadata?.adaptiveCards ||
                          item.response.metadata.adaptiveCards.length ===
                            0) && (
                          <div
                            style={{ color: "#adb5bd", fontStyle: "italic" }}
                          >
                            No response content
                          </div>
                        )}
                    </MessageContent>
                  </MessageRow>
                  <MessageTimestamp>
                    {new Date(item.timestamp).toLocaleString()}
                  </MessageTimestamp>
                </ConversationItem>
              ))
          )}
        </ConversationHistory>
      </ChatGrid>

      <Modal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        title="Agent Configuration"
      >
        <ConfigurationForm
          config={config}
          onConfigChange={handleConfigChange}
          onCancel={handleConfigCancel}
        />
      </Modal>

      {showErrorPopup && errorDetails && (
        <ErrorPopup>
          <ErrorTitle>{errorDetails.title}</ErrorTitle>
          <ErrorMessage>{errorDetails.message}</ErrorMessage>
          <ErrorActions>
            {errorDetails.canNavigateToConfig && (
              <ErrorButton primary onClick={openConfigurationFromError}>
                Open Configuration
              </ErrorButton>
            )}
            <ErrorButton onClick={dismissErrorPopup}>Close</ErrorButton>
          </ErrorActions>
        </ErrorPopup>
      )}
    </Container>
  );
};

export default AgentInterface;
