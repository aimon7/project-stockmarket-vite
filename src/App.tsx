import { CssBaseline, ThemeProvider } from '@mui/material';

import { GlobalProvider } from './context/global-context';
import IndexPage from './pages';
import { getTheme } from './theme/theme';
import { useColorMode } from './context/color-mode-context';

function App() {
  const { isDarkMode } = useColorMode();
  const theme = getTheme(isDarkMode ? 'dark' : 'light');

  return (
    <ThemeProvider theme={theme}>
      <GlobalProvider>
        <CssBaseline />
        <IndexPage />
      </GlobalProvider>
    </ThemeProvider>
  )
}

export default App
