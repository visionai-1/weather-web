import React from 'react';
import { PageContainer, FlexContainer, GridContainer } from './StyledComponents';

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
}

interface FlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  gap?: string;
  wrap?: boolean;
  className?: string;
}

interface GridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: string;
  minWidth?: string;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  maxWidth, 
  className 
}) => (
  <PageContainer $maxWidth={maxWidth} className={className}>
    {children}
  </PageContainer>
);

export const Flex: React.FC<FlexProps> = ({ 
  children, 
  direction, 
  align, 
  justify, 
  gap, 
  wrap,
  className 
}) => (
  <FlexContainer
    $direction={direction}
    $align={align}
    $justify={justify}
    $gap={gap}
    $wrap={wrap}
    className={className}
  >
    {children}
  </FlexContainer>
);

export const Grid: React.FC<GridProps> = ({ 
  children, 
  columns, 
  gap, 
  minWidth,
  className 
}) => (
  <GridContainer
    $columns={columns}
    $gap={gap}
    $minWidth={minWidth}
    className={className}
  >
    {children}
  </GridContainer>
);