import React from 'react';
import { StatusTag } from './StyledComponents';

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  children,
  icon,
  className,
}) => (
  <StatusTag $status={status} className={className}>
    {icon}
    {children}
  </StatusTag>
);