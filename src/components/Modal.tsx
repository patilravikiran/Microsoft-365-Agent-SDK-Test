/**
 * Modal Component
 *
 * Reusable modal dialog with overlay and backdrop blur.
 * Provides centered content display with customizable title and children content.
 * Modal can only be closed using the close button or ESC key (when not typing).
 */

import React, { useEffect } from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 40px;
  max-width: 800px;
  width: 95%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #dee2e6;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #343a40;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 5px;
  border-radius: 4px;

  &:hover {
    background: #f8f9fa;
    color: #495057;
  }
`;

/**
 * Props interface for Modal component
 */
interface ModalProps {
  isOpen: boolean; // Whether modal is visible
  onClose: () => void; // Callback for closing modal
  title: string; // Modal title text
  children: React.ReactNode; // Modal content
}

/**
 * Modal component for displaying overlay dialogs
 * @param props - Component props containing state and callbacks
 * @returns JSX.Element | null - Modal dialog or null if closed
 */
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Handle ESC key to close modal, but only when not typing in an input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        // Only close on ESC if the user is not actively typing in an input field
        const activeElement = document.activeElement;
        const isInputFocused =
          activeElement &&
          (activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA" ||
            (activeElement as HTMLElement).contentEditable === "true");

        if (!isInputFocused) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>⚙️ {title}</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;
