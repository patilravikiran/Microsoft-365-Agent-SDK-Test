/**
 * Main Application Component
 * Root component that sets up the application layout with header and main content.
 * Provides the overall structure and background styling for the Agent SDK interface.
 */

import React from "react";
import styled from "styled-components";
import AgentInterface from "./components/AgentInterface";
import Header from "./components/Header";

/**
 * Main application container with full height layout
 */

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

/**
 * Main content area with centered layout and padding
 */
const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

/**
 * Main application component
 * @returns JSX.Element - Application layout with header and agent interface
 */
function App() {
  return (
    <AppContainer>
      <Header />
      <MainContent>
        <AgentInterface />
      </MainContent>
    </AppContainer>
  );
}

export default App;
