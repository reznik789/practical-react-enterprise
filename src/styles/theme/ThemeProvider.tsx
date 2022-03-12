import * as React from 'react';
import { ThemeProvider as OriginalThemeProvider } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {
    zIndex: {
      mobileStepper: number;
      speedDial: number;
      appBar: number;
      drawer: number;
      modal: number;
      snackbar: number;
      tooltip: number;
    };
  }
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
        zIndex: {
          mobileStepper: 1000,
          speedDial: 1050,
          appBar: 1100,
          drawer: 1200,
          modal: 1300,
          snackbar: 1400,
          tooltip: 1500,
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
