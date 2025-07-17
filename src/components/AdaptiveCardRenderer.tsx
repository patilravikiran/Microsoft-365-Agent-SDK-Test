/**
 * Adaptive Card Renderer Component
 *
 * Renders Adaptive Cards using the official adaptivecards library.
 * Provides error handling, fallback display, and action handling for interactive cards.
 * Supports custom styling and host configuration for consistent appearance.
 */

import React, { useEffect, useRef } from "react";
import styled from "styled-components";

// Use require for adaptivecards to avoid TypeScript issues
const AdaptiveCards = require("adaptivecards");

const AdaptiveCardWrapper = styled.div`
  background: white;
  border-radius: 6px;
  padding: 16px;
  border: 1px solid #e1e1e1;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  margin: 12px 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  .ac-container {
    font-family: inherit;
  }

  .ac-textBlock {
    margin: 4px 0;
    line-height: 1.4;
    color: #323130;
  }

  .ac-columnSet {
    display: flex;
    gap: 12px;
  }

  .ac-column {
    flex: 1;
  }

  .ac-factset {
    border-spacing: 0;
    width: 100%;
  }

  .ac-factset .ac-fact-title {
    font-weight: 600;
    color: #323130;
    padding: 4px 8px 4px 0;
    vertical-align: top;
    white-space: nowrap;
  }

  .ac-factset .ac-fact-value {
    color: #323130;
    padding: 4px 0;
    word-wrap: break-word;
  }

  .ac-actionSet {
    margin-top: 12px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .ac-pushButton {
    background: #0078d4;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 2px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 400;
    transition: background 0.2s ease;
    min-height: 32px;

    &:hover {
      background: #106ebe;
    }
  }

  .ac-input {
    padding: 6px 8px;
    border: 1px solid #8a8886;
    border-radius: 2px;
    margin: 2px 0;
    font-size: 14px;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: #0078d4;
    }
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 2px;
  }
`;

const CardTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #f5c6cb;
  font-size: 0.9rem;
`;

const FallbackJson = styled.div`
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 12px;
  font-family: "Courier New", monospace;
  font-size: 0.8rem;
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
`;

/**
 * Props interface for AdaptiveCardRenderer component
 */
interface AdaptiveCardRendererProps {
  cardData: any; // Adaptive card data to render
  index: number; // Card index for unique identification
  onAction?: (action: any) => void; // Optional callback for card actions
}

/**
 * AdaptiveCardRenderer component for rendering Adaptive Cards
 * @param props - Component props containing card data and callbacks
 * @returns JSX.Element - Rendered adaptive card or fallback display
 */
const AdaptiveCardRenderer: React.FC<AdaptiveCardRendererProps> = ({
  cardData,
  index,
  onAction,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [renderError, setRenderError] = React.useState<string | null>(null);
  const [fallbackMode, setFallbackMode] = React.useState<boolean>(false);

  useEffect(() => {
    if (!cardRef.current) return;

    try {
      // Create adaptive card instance
      const adaptiveCard = new AdaptiveCards.AdaptiveCard();

      // Set host config to match Copilot Studio styling
      const hostConfig = new AdaptiveCards.HostConfig({
        spacing: {
          small: 4,
          default: 8,
          medium: 12,
          large: 16,
          extraLarge: 20,
          padding: 12,
        },
        separator: {
          lineThickness: 1,
          lineColor: "#E1E1E1",
        },
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSizes: {
          small: 12,
          default: 14,
          medium: 16,
          large: 18,
          extraLarge: 20,
        },
        fontWeights: {
          lighter: 300,
          default: 400,
          bolder: 600,
        },
        containerStyles: {
          default: {
            backgroundColor: "#FFFFFF",
            foregroundColors: {
              default: {
                default: "#323130",
                subtle: "#605E5C",
              },
              accent: {
                default: "#0078D4",
                subtle: "#106EBE",
              },
            },
          },
        },
        factSet: {
          title: {
            color: "default",
            size: "default",
            weight: "bolder",
          },
          value: {
            color: "default",
            size: "default",
            weight: "default",
          },
        },
        actions: {
          maxActions: 5,
          spacing: "default",
          buttonSpacing: 8,
          showCard: {
            actionMode: "inline",
            inlineTopMargin: 8,
          },
          actionsOrientation: "horizontal",
          actionAlignment: "left",
        },
      });

      adaptiveCard.hostConfig = hostConfig;

      // Handle action execution
      adaptiveCard.onExecuteAction = (action: any) => {
        if (onAction) {
          onAction(action);
        }
      };

      // Get the card content
      let cardContent = cardData;

      // If cardData has a 'content' property, use that
      if (cardData.content) {
        cardContent = cardData.content;
      }

      // Parse the card
      adaptiveCard.parse(cardContent);

      // Clear previous content
      cardRef.current.innerHTML = "";

      // Render the card
      const renderedCard = adaptiveCard.render();

      if (renderedCard) {
        cardRef.current.appendChild(renderedCard);
        setRenderError(null);
        setFallbackMode(false);
      } else {
        throw new Error("Failed to render adaptive card");
      }
    } catch (error: any) {
      console.error("Error rendering adaptive card:", error);
      setRenderError(error.message || "Unknown rendering error");
      setFallbackMode(true);
    }
  }, [cardData, onAction]);

  /**
   * Gets display name for the adaptive card
   * @returns string - Card name or generated title
   */
  const getCardName = () => {
    if (cardData.name) return cardData.name;
    if (cardData.content?.title) return cardData.content.title;
    return `Adaptive Card ${index + 1}`;
  };

  if (fallbackMode) {
    return (
      <AdaptiveCardWrapper>
        <CardTitle>🃏 {getCardName()}</CardTitle>
        {renderError && (
          <ErrorMessage>⚠️ Card rendering failed: {renderError}</ErrorMessage>
        )}
        <FallbackJson>{JSON.stringify(cardData, null, 2)}</FallbackJson>
      </AdaptiveCardWrapper>
    );
  }

  return (
    <AdaptiveCardWrapper>
      <CardTitle>🃏 {getCardName()}</CardTitle>
      <div ref={cardRef} />
    </AdaptiveCardWrapper>
  );
};

export default AdaptiveCardRenderer;
