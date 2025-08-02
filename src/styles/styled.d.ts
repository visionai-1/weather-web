import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      success: string;
      warning: string;
      error: string;
      text: {
        primary: string;
        secondary: string;
        disabled: string;
      };
      background: {
        primary: string;
        secondary: string;
        tertiary: string;
      };
      border: string;
    };
    breakpoints: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
    };
  }
}