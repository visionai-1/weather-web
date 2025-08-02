import React from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ErrorContainer, StyledButton } from './StyledComponents';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = 'Error',
  message,
  onRetry,
  retryText = 'Try Again',
  className,
}) => (
  <ErrorContainer className={className}>
    <ExclamationCircleOutlined className="error-icon" />
    <div className="error-title">{title}</div>
    <div className="error-message">{message}</div>
    {onRetry && (
      <StyledButton type="primary" onClick={onRetry}>
        {retryText}
      </StyledButton>
    )}
  </ErrorContainer>
);