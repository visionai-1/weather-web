# Common Components

This folder contains reusable styled components that combine Ant Design components with styled-components for consistent theming and design patterns.

## Components

### StyledComponents.tsx
- **StyledCard**: Enhanced Card component with variants (default, elevated, bordered)
- **StyledButton**: Custom Button with variants (primary, secondary, danger, ghost)
- **StyledInput**: Themed Input component
- **FlexContainer**: Flexible layout container with configurable alignment
- **GridContainer**: CSS Grid container with responsive behavior
- **PageContainer**: Main page wrapper with max-width and padding
- **StyledContent**: Layout content area with responsive styling
- **MetricCard**: Specialized card for displaying metrics
- **StatusTag**: Status indicator with color variants
- **LoadingContainer**: Centered loading state container
- **ErrorContainer**: Error display container
- **IconContainer**: Consistent icon wrapper
- **ResponsiveSpace**: Space component that stacks on mobile
- **StyledTitle**: Themed typography title
- **StyledText**: Themed typography text

### Container.tsx
- **Container**: Page-level container wrapper
- **Flex**: Flexible layout component
- **Grid**: Grid layout component

### LoadingSpinner.tsx
- **LoadingSpinner**: Consistent loading state with customizable text

### ErrorDisplay.tsx
- **ErrorDisplay**: Error state component with retry functionality

### MetricDisplay.tsx
- **MetricDisplay**: Reusable metric display card

### StatusBadge.tsx
- **StatusBadge**: Status indicator with icon support

## Usage

```tsx
import { 
  StyledCard, 
  StyledButton, 
  Container, 
  LoadingSpinner,
  MetricDisplay 
} from '@/components/common';

// Basic usage
<Container>
  <StyledCard $variant="elevated">
    <StyledButton $variant="primary">Click me</StyledButton>
  </StyledCard>
</Container>

// Loading state
<LoadingSpinner text="Loading..." />

// Metric display
<MetricDisplay
  icon={<TempIcon />}
  label="Temperature"
  value="22°C"
  subtitle="Feels like 24°C"
/>
```

## Design Principles

1. **Consistency**: All components follow the same theming patterns
2. **Responsiveness**: Built-in responsive behavior for all screen sizes
3. **Flexibility**: Configurable props for different use cases
4. **Accessibility**: Proper ARIA labels and semantic HTML
5. **Performance**: Optimized styled-components with theme integration

## Theming

All components use the global theme from `@/styles/theme.ts`:
- Colors (primary, secondary, success, warning, error)
- Spacing (xs, sm, md, lg, xl, xxl)
- Breakpoints (xs, sm, md, lg, xl)
- Shadows (sm, md, lg)

## Best Practices

1. Always use the common components instead of raw Ant Design components
2. Use the `$` prefix for styled-components props to avoid DOM warnings
3. Leverage the theme object for consistent spacing and colors
4. Use responsive utilities for mobile-friendly layouts
5. Combine components for complex layouts (e.g., Container + Grid + StyledCard)