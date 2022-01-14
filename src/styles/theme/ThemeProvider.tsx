import * as React from 'react';
import { ThemeProvider as OriginalThemeProvider } from '@mui/styles';
import { Theme } from '@mui/system';
import { createTheme } from '@mui/material';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}
export const ColorModeContext = React.createContext<{
  toggleColorMode: () => void;
}>({
  toggleColorMode: () => {},
});

export const ThemeProvider = (props: { children: React.ReactChild }) => {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  const toggleColorMode = React.useCallback(() => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  }, []);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );
  return (
    <ColorModeContext.Provider value={{ toggleColorMode }}>
      <OriginalThemeProvider theme={theme}>
        {React.Children.only(props.children)}
      </OriginalThemeProvider>
    </ColorModeContext.Provider>
  );
};
