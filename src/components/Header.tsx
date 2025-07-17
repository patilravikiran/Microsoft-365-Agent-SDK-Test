/**
 * Application Header Component
 *
 * Displays the application title with glassmorphism styling.
 * Provides visual branding and consistent header layout across the application.
 */

import React from "react";
import styled from "styled-components";

/**
 * Header container with glassmorphism effect
 */

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px 40px;
  text-align: center;
`;

/**
 * Main title styling with shadow effects
 */
const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

/**
 * Icon styling for the title
 */
const TitleIcon = styled.span`
  font-size: 2.2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
`;

/**
 * Header component displaying application title
 * @returns JSX.Element - Header with title and branding
 */
const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Title>
        <TitleIcon>🤖</TitleIcon>
        Microsoft 365 Agent SDK
      </Title>
    </HeaderContainer>
  );
};

export default Header;
