import React from 'react';
import { Spin } from 'antd';
import { LoadingContainer } from './StyledComponents';

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  text = 'Loading...',
  className,
}) => (
  <LoadingContainer className={className}>
    <Spin size={size} />
    {text && <div className="loading-text">{text}</div>}
  </LoadingContainer>
);