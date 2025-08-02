import React from 'react';
import { MetricCard, IconContainer } from './StyledComponents';

interface MetricDisplayProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  className?: string;
  children?: React.ReactNode;
}

export const MetricDisplay: React.FC<MetricDisplayProps> = ({
  icon,
  label,
  value,
  subtitle,
  color,
  className,
  children,
}) => (
  <MetricCard className={className}>
    <IconContainer $size="large" $color={color} className="metric-icon">
      {icon}
    </IconContainer>
    <div className="metric-label">{label}</div>
    <div className="metric-value">{value}</div>
    {subtitle && <div className="metric-subtitle">{subtitle}</div>}
    {children}
  </MetricCard>
);