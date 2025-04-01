import { LayoutProvider } from './contexts/LayoutContext'
import { ThemeProvider as FlowbiteThemeProvider } from 'flowbite-react';

import AppRoutes from './routes/AppRoutes';

import { themes } from './theme/themeConfig';

function App() {
  return (
    <FlowbiteThemeProvider theme={themes}>
      <LayoutProvider>
        <AppRoutes />
      </LayoutProvider>
    </FlowbiteThemeProvider>
  );
}

export default App;
