/**
 * Agent Response Display Component
 *
 * Renders agent responses with support for text, adaptive cards, suggested actions,
 * and rich metadata display. Includes syntax highlighting, copy functionality,
 * and comprehensive response visualization.
 */

import React from "react";
import styled from "styled-components";
import SyntaxHighlighter from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { AgentResponse } from "../types/agent";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AdaptiveCardRenderer from "./AdaptiveCardRenderer";

const Container = styled.div`
  min-height: 200px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-                <CopyButton
                  onClick={() =>
                    copyToClipboard(
                      JSON.stringify(response.metadata?.fullActivities, null, 2)
                    )
                  > center;
  justify-content: center;
  min-height: 200px;
  color: #6c757d;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const ResponseContainer = styled.div`
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
`;

const ResponseHeader = styled.div`
  background: #f8f9fa;
  padding: 12px 16px;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ResponseTitle = styled.h3`
  margin: 0;
  color: #495057;
  font-size: 1rem;
  font-weight: 600;
`;

const Timestamp = styled.span`
  color: #6c757d;
  font-size: 0.85rem;
`;

const ResponseBody = styled.div`
  padding: 20px;
`;

const MessageText = styled.div`
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  margin-bottom: 20px;
  line-height: 1.6;
  color: #495057;
`;

const MetadataSection = styled.div`
  background: #f1f3f4;
  padding: 16px;
  border-radius: 8px;
  margin-top: 20px;
`;

const MetadataTitle = styled.h4`
  margin: 0 0 12px 0;
  color: #495057;
  font-size: 0.9rem;
  font-weight: 600;
`;

const MetadataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
`;

const MetadataItem = styled.div`
  background: white;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
`;

const MetadataLabel = styled.div`
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: 600;
  margin-bottom: 2px;
`;

const MetadataValue = styled.div`
  font-size: 0.9rem;
  color: #495057;
  font-weight: 500;
`;

const ActivitiesSection = styled.div`
  margin-top: 20px;
`;

const ActivitiesTitle = styled.h4`
  margin: 0 0 12px 0;
  color: #495057;
  font-size: 0.9rem;
  font-weight: 600;
`;

const CodeBlock = styled.div`
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #dee2e6;
`;

const CopyButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  margin-left: 10px;
  transition: background 0.2s ease;

  &:hover {
    background: #5a6268;
  }
`;

const SuggestedActionsContainer = styled.div`
  margin: 16px 0;
`;

const SuggestedActionsTitle = styled.h4`
  margin: 0 0 12px 0;
  color: #495057;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SuggestedActionButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  margin: 4px 8px 4px 0;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #0056b3;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const RichTextContainer = styled.div`
  line-height: 1.6;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #212529;
    margin: 16px 0 8px 0;
  }

  p {
    margin: 8px 0;
  }

  ul,
  ol {
    margin: 8px 0;
    padding-left: 24px;
  }

  li {
    margin: 4px 0;
  }

  code {
    background: #f8f9fa;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: "Courier New", monospace;
    color: #e83e8c;
  }

  pre {
    background: #f8f9fa;
    padding: 12px;
    border-radius: 6px;
    overflow-x: auto;
    border: 1px solid #dee2e6;
  }

  blockquote {
    border-left: 4px solid #007bff;
    margin: 16px 0;
    padding: 8px 16px;
    background: #f8f9fa;
    font-style: italic;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
  }

  th,
  td {
    border: 1px solid #dee2e6;
    padding: 8px 12px;
    text-align: left;
  }

  th {
    background: #f8f9fa;
    font-weight: 600;
  }

  a {
    color: #007bff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

/**
 * Props interface for ResponseDisplay component
 */
interface ResponseDisplayProps {
  response: AgentResponse | null; // Agent response to display
  onSuggestedAction?: (action: string) => void; // Callback for suggested action clicks
}

/**
 * ResponseDisplay component for rendering agent responses
 * @param props - Component props containing response data and callbacks
 * @returns JSX.Element - Rendered response display
 */
const ResponseDisplay: React.FC<ResponseDisplayProps> = ({
  response,
  onSuggestedAction,
}) => {
  /**
   * Formats timestamp for display in local format
   * @param timestamp - ISO timestamp string
   * @returns string - Formatted timestamp
   */
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  /**
   * Copies text to clipboard using browser API
   * @param text - Text to copy to clipboard
   */
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  /**
   * Handles suggested action button clicks
   * @param action - Action text to execute
   */
  const handleSuggestedAction = (action: string) => {
    if (onSuggestedAction) {
      onSuggestedAction(action);
    }
  };

  const renderMessageContent = (message: string) => {
    const hasHtml = /<[^>]*>/g.test(message);

    if (hasHtml) {
      return (
        <RichTextContainer dangerouslySetInnerHTML={{ __html: message }} />
      );
    }

    const hasMarkdown = /[*_`#\[\]]/g.test(message);

    if (hasMarkdown) {
      return (
        <RichTextContainer>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message}</ReactMarkdown>
        </RichTextContainer>
      );
    }

    // Handle plain text with line breaks
    const messageLines = message.split("\n");
    return (
      <MessageText>
        {messageLines.map((line, index) => (
          <div key={index}>
            {line}
            {index < messageLines.length - 1 && <br />}
          </div>
        ))}
      </MessageText>
    );
  };

  const renderAdaptiveCards = () => {
    if (
      !response?.metadata?.adaptiveCards ||
      response.metadata.adaptiveCards.length === 0
    ) {
      return null;
    }

    return (
      <div>
        {response.metadata.adaptiveCards.map((card, index) => (
          <AdaptiveCardRenderer
            key={index}
            cardData={card}
            index={index}
            onAction={(action) => {
              if (action.type === "Action.Submit" && action.data) {
                const actionText = action.title || JSON.stringify(action.data);
                if (onSuggestedAction) {
                  onSuggestedAction(actionText);
                }
              }
            }}
          />
        ))}
      </div>
    );
  };

  const renderSuggestedActions = () => {
    if (
      !response?.metadata?.suggestedActions ||
      response.metadata.suggestedActions.length === 0
    ) {
      return null;
    }

    return (
      <SuggestedActionsContainer>
        <SuggestedActionsTitle>💡 Suggested Actions</SuggestedActionsTitle>
        <div>
          {response.metadata.suggestedActions.map((action, index) => (
            <SuggestedActionButton
              key={index}
              onClick={() =>
                handleSuggestedAction(action.value || action.title)
              }
            >
              {action.title}
            </SuggestedActionButton>
          ))}
        </div>
      </SuggestedActionsContainer>
    );
  };

  if (!response) {
    return (
      <Container>
        <EmptyState>
          <EmptyIcon>💬</EmptyIcon>
          <h3 style={{ margin: "0 0 8px 0", color: "#6c757d" }}>
            No Response Yet
          </h3>
          <p style={{ margin: 0, fontSize: "0.9rem" }}>
            Send a message to your agent to see the response here
          </p>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <ResponseContainer>
        <ResponseHeader>
          <ResponseTitle>Agent Response</ResponseTitle>
          <Timestamp>{formatTimestamp(response.timestamp)}</Timestamp>
        </ResponseHeader>

        <ResponseBody>
          {/* Main Message Content - Only show if there's actual content */}
          {response.message &&
            response.message.trim() &&
            response.message !== "No response from agent" && (
              <div style={{ marginBottom: "20px" }}>
                {renderMessageContent(response.message)}
              </div>
            )}

          {/* Adaptive Cards */}
          {renderAdaptiveCards()}

          {/* Suggested Actions */}
          {renderSuggestedActions()}

          {/* Show placeholder only if no content at all */}
          {(!response.message ||
            response.message.trim() === "" ||
            response.message === "No response from agent") &&
            (!response.metadata?.adaptiveCards ||
              response.metadata.adaptiveCards.length === 0) &&
            (!response.metadata?.suggestedActions ||
              response.metadata.suggestedActions.length === 0) && (
              <div
                style={{
                  color: "#6c757d",
                  fontStyle: "italic",
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                No response content available
              </div>
            )}

          {/* Enhanced Metadata */}
          {response.metadata && (
            <MetadataSection>
              <MetadataTitle>📊 Response Metadata</MetadataTitle>
              <MetadataGrid>
                <MetadataItem>
                  <MetadataLabel>DURATION</MetadataLabel>
                  <MetadataValue>{response.metadata.duration}ms</MetadataValue>
                </MetadataItem>
                {response.metadata.tokens && (
                  <MetadataItem>
                    <MetadataLabel>TOKENS</MetadataLabel>
                    <MetadataValue>{response.metadata.tokens}</MetadataValue>
                  </MetadataItem>
                )}
                {response.metadata.model && (
                  <MetadataItem>
                    <MetadataLabel>MODEL</MetadataLabel>
                    <MetadataValue>{response.metadata.model}</MetadataValue>
                  </MetadataItem>
                )}
                <MetadataItem>
                  <MetadataLabel>CONVERSATION ID</MetadataLabel>
                  <MetadataValue>{response.conversationId}</MetadataValue>
                </MetadataItem>
                {response.metadata?.suggestedActions &&
                  response.metadata.suggestedActions.length > 0 && (
                    <MetadataItem>
                      <MetadataLabel>SUGGESTED ACTIONS</MetadataLabel>
                      <MetadataValue>
                        ✅ {response.metadata.suggestedActions.length}
                      </MetadataValue>
                    </MetadataItem>
                  )}
              </MetadataGrid>
            </MetadataSection>
          )}

          {/* Raw Response Data - Collapsible */}
          {response.metadata?.fullActivities && (
            <ActivitiesSection>
              <ActivitiesTitle>
                📋 Full Response Data
                <CopyButton
                  onClick={() =>
                    copyToClipboard(
                      JSON.stringify(response.metadata?.fullActivities, null, 2)
                    )
                  }
                >
                  Copy Raw Data
                </CopyButton>
              </ActivitiesTitle>
              <CodeBlock>
                <SyntaxHighlighter
                  language="json"
                  style={tomorrow}
                  customStyle={{
                    margin: 0,
                    fontSize: "0.85rem",
                    maxHeight: "300px",
                  }}
                >
                  {JSON.stringify(response.metadata?.fullActivities, null, 2)}
                </SyntaxHighlighter>
              </CodeBlock>
            </ActivitiesSection>
          )}
        </ResponseBody>
      </ResponseContainer>
    </Container>
  );
};

export default ResponseDisplay;
