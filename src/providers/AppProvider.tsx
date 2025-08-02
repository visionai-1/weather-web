import React from 'react';
import { ConfigProvider } from 'antd';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { antdTheme, lightTheme } from '@/styles/theme';
import { GlobalStyles } from '@/styles/GlobalStyles';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <ConfigProvider theme={antdTheme}>
        <ThemeProvider theme={lightTheme}>
          <GlobalStyles />
          {children}
        </ThemeProvider>
      </ConfigProvider>
    </Provider>
  );
};