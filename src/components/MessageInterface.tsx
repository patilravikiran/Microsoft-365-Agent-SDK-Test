/**
 * Message Interface Component
 *
 * Provides user input interface for sending messages to agents.
 * Includes text area, character counter, send button, and quick action buttons.
 * Handles form submission and message state management.
 */

import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const MessageForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const TextArea = styled.textarea`
  padding: 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: all 0.2s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #adb5bd;
  }

  &:disabled {
    background: #f8f9fa;
    color: #6c757d;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(40, 167, 69, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const CharacterCount = styled.div`
  font-size: 0.8rem;
  color: #6c757d;
  text-align: right;
`;

const QuickActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const QuickActionButton = styled.button`
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #495057;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e9ecef;
    border-color: #adb5bd;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuickActionHeader = styled.h4`
  margin: 0 0 10px 0;
  color: #495057;
  font-size: 0.9rem;
`;

const LastMessageContainer = styled.div`
  background: #e3f2fd;
  padding: 12px;
  border-radius: 6px;
  margin-top: 10px;
  border: 1px solid #bbdefb;
`;

const LastMessageTitle = styled.strong`
  color: #1976d2;
  font-size: 0.9rem;
`;

const LastMessageText = styled.p`
  margin: 4px 0 0 0;
  color: #424242;
`;

/**
 * Props interface for MessageInterface component
 */
interface MessageInterfaceProps {
  onSendMessage: (message: string) => void; // Callback for message submission
  disabled: boolean; // Whether input is disabled
  currentMessage: string; // Currently displayed message
}

/**
 * MessageInterface component for user input and message sending
 * @param props - Component props containing callbacks and state
 * @returns JSX.Element - Message input interface
 */
const MessageInterface: React.FC<MessageInterfaceProps> = ({
  onSendMessage,
  disabled,
  currentMessage,
}) => {
  const [message, setMessage] = useState("");

  /**
   * Handles form submission and message sending
   * @param e - Form event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  /**
   * Inserts quick message into text area
   * @param quickMessage - Predefined message to insert
   */
  const insertQuickMessage = (quickMessage: string) => {
    setMessage(quickMessage);
  };

  const quickMessages = [
    "Hello! How can you help me?",
    "What can you do?",
    "Tell me about the weather",
    "Help me with my tasks",
    "Show me the latest updates",
  ];

  return (
    <Container>
      <MessageForm onSubmit={handleSubmit}>
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          disabled={disabled}
          maxLength={1000}
        />
        <CharacterCount>{message.length}/1000 characters</CharacterCount>
        <SendButton type="submit" disabled={disabled || !message.trim()}>
          {disabled ? "Sending..." : "Send Message"}
        </SendButton>
      </MessageForm>

      <div>
        <QuickActionHeader>Quick Actions:</QuickActionHeader>
        <QuickActions>
          {quickMessages.map((quickMessage, index) => (
            <QuickActionButton
              key={index}
              type="button"
              onClick={() => insertQuickMessage(quickMessage)}
              disabled={disabled}
            >
              {quickMessage}
            </QuickActionButton>
          ))}
        </QuickActions>
      </div>

      {currentMessage && (
        <LastMessageContainer>
          <LastMessageTitle>Last sent message:</LastMessageTitle>
          <LastMessageText>{currentMessage}</LastMessageText>
        </LastMessageContainer>
      )}
    </Container>
  );
};

export default MessageInterface;
