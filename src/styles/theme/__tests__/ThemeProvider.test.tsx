import * as React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { Store } from '@reduxjs/toolkit';
import { ThemeProvider, Theme } from '../ThemeProvider';
import { StyledEngineProvider } from '@mui/system';
import { configureAppStore } from 'store/configureStore';
import { useTheme } from 'styled-components';
import { selectTheme } from '../slice/selectors';


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


const renderThemeProvider = (store: Store, Child: React.FunctionComponent) =>
  render(
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider>
          <Child />
        </ThemeProvider>
      </StyledEngineProvider>
    </Provider>,
  );

describe('<ThemeProvider />', () => {
  let store: ReturnType<typeof configureAppStore>;

  beforeEach(() => {
    store = configureAppStore();
  });

  it('should render its children', () => {
    const text = 'Test';
    const children = () => <h1>{text}</h1>;
    const { queryByText } = renderThemeProvider(store, children);
    expect(queryByText(text)).toBeInTheDocument();
  });

  it('should render selected theme', () => {
    let theme: any;
    const children = () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      theme = useTheme();
      return <h1>a</h1>;
    };
    renderThemeProvider(store, children);
    expect(theme).toBe(selectTheme(store.getState() as any));
  });
});
