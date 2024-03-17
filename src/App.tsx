import { CssBaseline, ThemeProvider } from '@mui/material';

import { APIProvider } from './context/api-context';
import { useColorMode } from './context/color-mode-context';
import IndexPage from './pages';
import { getTheme } from './theme/theme';

function App() {
  const { isDarkMode } = useColorMode();
  const theme = getTheme(isDarkMode ? 'dark' : 'light');

  return (
    <ThemeProvider theme={theme}>
      <APIProvider>
        <CssBaseline />
        <IndexPage />
      </APIProvider>
    </ThemeProvider>
  )
}

export default App
