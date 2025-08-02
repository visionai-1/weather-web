import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 14px;
    line-height: 1.5715;
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background.primary};
  }

  #root {
    height: 100%;
  }

  /* Ant Design customizations */
  .ant-layout {
    min-height: 100vh;
  }

  .ant-card {
    border-radius: 8px;
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }

  .ant-card-head {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  /* Custom scroll bars */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.secondary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.text.disabled};
  }

  /* Responsive helpers */
  .mobile-only {
    @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
      display: none !important;
    }
  }

  .desktop-only {
    @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
      display: none !important;
    }
  }

  /* Animation utilities */
  .fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Loading states */
  .loading-shimmer {
    background: linear-gradient(90deg, 
      ${({ theme }) => theme.colors.background.secondary} 25%, 
      ${({ theme }) => theme.colors.background.tertiary} 50%, 
      ${({ theme }) => theme.colors.background.secondary} 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;