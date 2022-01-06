import * as React from 'react';
import { ThemeProvider as OriginalThemeProvider } from '@mui/styles';
import { Theme } from '@mui/system';
import { createTheme } from '@mui/material';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}

const theme = createTheme({});
export const ThemeProvider = (props: { children: React.ReactChild }) => {
  return (
    <OriginalThemeProvider theme={theme}>
      {React.Children.only(props.children)}
    </OriginalThemeProvider>
  );
};
