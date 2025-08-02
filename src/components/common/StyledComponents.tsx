import styled from 'styled-components';
import { Card, Button, Layout, Input, Space, Typography } from 'antd';

const { Content } = Layout;
const { Title, Text } = Typography;

// Common styled wrappers for Ant Design components
export const StyledCard = styled(Card)<{ $variant?: 'default' | 'elevated' | 'bordered' }>`
  border-radius: 12px;
  box-shadow: ${({ theme, $variant }) => {
    switch ($variant) {
      case 'elevated':
        return theme.shadows.lg;
      case 'bordered':
        return 'none';
      default:
        return theme.shadows.sm;
    }
  }};
  
  border: ${({ $variant, theme }) => 
    $variant === 'bordered' ? `2px solid ${theme.colors.border}` : 'none'};
  
  transition: all 0.3s ease;
  
  &:hover {
    transform: ${({ $variant }) => 
      $variant === 'elevated' ? 'translateY(-2px)' : 'none'};
    box-shadow: ${({ theme, $variant }) => 
      $variant === 'elevated' ? theme.shadows.lg : theme.shadows.md};
  }

  .ant-card-head {
    border-bottom: 2px solid ${({ theme }) => theme.colors.border};
    border-radius: 12px 12px 0 0;
  }

  .ant-card-body {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

export const StyledButton = styled(Button)<{ $variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }>`
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'secondary':
        return `
          background: ${theme.colors.background.secondary};
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.border};
          
          &:hover {
            background: ${theme.colors.background.tertiary};
            border-color: ${theme.colors.primary};
            color: ${theme.colors.primary};
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: ${theme.colors.text.secondary};
          border: 1px solid transparent;
          
          &:hover {
            background: ${theme.colors.background.secondary};
            color: ${theme.colors.primary};
          }
        `;
      default:
        return '';
    }
  }}
`;

export const StyledInput = styled(Input)`
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.border};
  transition: all 0.3s ease;
  
  &:focus,
  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }
`;

export const FlexContainer = styled.div<{
  $direction?: 'row' | 'column';
  $align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  $justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  $gap?: string;
  $wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${({ $direction = 'row' }) => $direction};
  align-items: ${({ $align = 'stretch' }) => $align};
  justify-content: ${({ $justify = 'flex-start' }) => $justify};
  gap: ${({ $gap = '16px' }) => $gap};
  flex-wrap: ${({ $wrap = false }) => $wrap ? 'wrap' : 'nowrap'};
`;

export const GridContainer = styled.div<{
  $columns?: number;
  $gap?: string;
  $minWidth?: string;
}>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${({ $minWidth = '300px' }) => $minWidth}, 1fr));
  gap: ${({ $gap = '24px' }) => $gap};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: ${({ $columns }) => 
      $columns ? `repeat(${$columns}, 1fr)` : 'repeat(auto-fit, minmax(300px, 1fr))'};
  }
`;

export const PageContainer = styled.div<{ $maxWidth?: string }>`
  max-width: ${({ $maxWidth = '1200px' }) => $maxWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 ${({ theme }) => theme.spacing.sm};
  }
`;

export const StyledContent = styled(Content)`
  margin: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  min-height: 280px;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: 12px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

export const MetricCard = styled(StyledCard)`
  text-align: center;
  height: 100%;
  
  .metric-icon {
    font-size: 32px;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    display: block;
  }
  
  .metric-label {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }
  
  .metric-value {
    font-size: 24px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
  
  .metric-subtitle {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

export const StatusTag = styled.div<{ $status?: 'success' | 'warning' | 'error' | 'info' }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${({ $status = 'info', theme }) => {
    const colors = {
      success: theme.colors.success,
      warning: theme.colors.warning,
      error: theme.colors.error,
      info: theme.colors.primary,
    };
    
    return `
      background: ${colors[$status]}15;
      color: ${colors[$status]};
      border: 1px solid ${colors[$status]}30;
    `;
  }}
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl} 0;
  text-align: center;
  
  .loading-text {
    margin-top: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 16px;
  }
`;

export const ErrorContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl} 0;
  
  .error-icon {
    font-size: 48px;
    color: ${({ theme }) => theme.colors.error};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  .error-title {
    font-size: 20px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
  
  .error-message {
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

export const IconContainer = styled.div<{ $size?: 'small' | 'medium' | 'large'; $color?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  ${({ $size = 'medium' }) => {
    const sizes = {
      small: '20px',
      medium: '24px',
      large: '32px',
    };
    
    return `
      width: ${sizes[$size]};
      height: ${sizes[$size]};
      font-size: ${sizes[$size]};
    `;
  }}
  
  color: ${({ $color, theme }) => $color || theme.colors.text.secondary};
`;

export const ResponsiveSpace = styled(Space)`
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    width: 100%;
    
    & > * {
      width: 100%;
    }
  }
`;

export const StyledTitle = styled(Title)<{ $variant?: 'primary' | 'secondary' }>`
  &.ant-typography {
    color: ${({ $variant, theme }) => 
      $variant === 'secondary' ? theme.colors.text.secondary : theme.colors.primary};
    
    margin-bottom: ${({ theme }) => theme.spacing.lg} !important;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      font-size: 24px !important;
      margin-bottom: ${({ theme }) => theme.spacing.md} !important;
    }
  }
`;

export const StyledText = styled(Text)<{ $variant?: 'primary' | 'secondary' | 'caption' }>`
  &.ant-typography {
    ${({ $variant, theme }) => {
      switch ($variant) {
        case 'secondary':
          return `color: ${theme.colors.text.secondary};`;
        case 'caption':
          return `
            color: ${theme.colors.text.secondary};
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          `;
        default:
          return `color: ${theme.colors.text.primary};`;
      }
    }}
  }
`;