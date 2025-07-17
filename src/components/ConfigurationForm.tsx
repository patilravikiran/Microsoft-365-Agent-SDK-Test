/**
 * Configuration Form Component
 *
 * Provides form interface for configuring agent connection settings.
 * Includes validation, error handling, and guided input for Entra ID and
 * Power Platform configuration parameters.
 */

import React, { useState } from "react";
import styled from "styled-components";
import { AgentConfig } from "../types/agent";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
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
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const HelpText = styled.small`
  color: #6c757d;
  font-size: 0.8rem;
  margin-top: 4px;
`;

const ErrorText = styled.small`
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 4px;
  display: block;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #dee2e6;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const CancelButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #5a6268;
  }
`;

/**
 * Props interface for ConfigurationForm component
 */
interface ConfigurationFormProps {
  config: AgentConfig; // Current agent configuration
  onConfigChange: (config: AgentConfig) => void; // Callback for configuration changes
  onCancel?: () => void; // Optional callback for form cancellation
}

/**
 * ConfigurationForm component for agent setup
 * @param props - Component props containing configuration and callbacks
 * @returns JSX.Element - Configuration form interface
 */
const ConfigurationForm: React.FC<ConfigurationFormProps> = ({
  config,
  onConfigChange,
  onCancel,
}) => {
  const [formData, setFormData] = useState<AgentConfig>(config);
  const [errors, setErrors] = useState<Partial<AgentConfig>>({});

  /**
   * Validates individual form field value
   * @param field - Configuration field name to validate
   * @param value - Field value to validate
   * @returns string | null - Error message or null if valid
   */
  const validateField = (
    field: keyof AgentConfig,
    value: string
  ): string | null => {
    switch (field) {
      case "clientId":
        if (!value.trim()) return "Client ID is required";
        if (
          !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            value
          )
        ) {
          return "Client ID must be a valid GUID";
        }
        return null;
      case "tenantId":
        if (!value.trim()) return "Tenant ID is required";
        if (
          !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            value
          )
        ) {
          return "Tenant ID must be a valid GUID";
        }
        return null;
      case "botIdentifier":
        if (!value.trim()) return "Bot Identifier is required";
        return null;
      case "environmentId":
        if (!value.trim()) return "Environment ID is required";
        return null;
      default:
        return null;
    }
  };

  /**
   * Handles input field changes with real-time validation
   * @param field - Configuration field being updated
   * @param value - New field value
   */
  const handleInputChange = (field: keyof AgentConfig, value: string) => {
    const newFormData = {
      ...formData,
      [field]: value,
    };
    setFormData(newFormData);

    const error = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  /**
   * Handles key down events to prevent unwanted modal closing
   * @param e - Keyboard event
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent event bubbling that might close the modal
    e.stopPropagation();

    // Handle Enter key to submit form
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      if (isFormValid) {
        handleSubmit(e as any);
      }
    }
  };

  /**
   * Validates entire form for submission
   * @returns boolean - True if form is valid for submission
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<AgentConfig> = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof AgentConfig>).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  /**
   * Handles form submission with validation
   * @param e - Form submit event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onConfigChange(formData);
    }
  };

  /**
   * Handles form cancellation
   */
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const isFormValid =
    Object.values(errors).every((error) => !error) &&
    Object.values(formData).every((value) => value.trim() !== "");

  return (
    <>
      <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
        <FormGroup>
          <Label htmlFor="clientId">Client ID *</Label>
          <Input
            id="clientId"
            type="text"
            value={formData.clientId}
            onChange={(e) => handleInputChange("clientId", e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            required
          />
          {errors.clientId && <ErrorText>{errors.clientId}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="tenantId">Tenant ID *</Label>
          <Input
            id="tenantId"
            type="text"
            value={formData.tenantId}
            onChange={(e) => handleInputChange("tenantId", e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            required
          />
          {errors.tenantId && <ErrorText>{errors.tenantId}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="botIdentifier">Bot Identifier *</Label>
          <Input
            id="botIdentifier"
            type="text"
            value={formData.botIdentifier}
            onChange={(e) => handleInputChange("botIdentifier", e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            required
          />
          {errors.botIdentifier && (
            <ErrorText>{errors.botIdentifier}</ErrorText>
          )}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="environmentId">Environment ID *</Label>
          <Input
            id="environmentId"
            type="text"
            value={formData.environmentId}
            onChange={(e) => handleInputChange("environmentId", e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            required
          />
          {errors.environmentId && (
            <ErrorText>{errors.environmentId}</ErrorText>
          )}
        </FormGroup>

        <ButtonGroup>
          <CancelButton type="button" onClick={handleCancel}>
            Cancel
          </CancelButton>
          <SubmitButton type="submit" disabled={!isFormValid}>
            Update Configuration
          </SubmitButton>
        </ButtonGroup>
      </Form>
    </>
  );
};

export default ConfigurationForm;
