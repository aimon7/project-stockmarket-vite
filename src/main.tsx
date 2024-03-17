import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { StyledEngineProvider } from '@mui/material';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import App from './App.tsx';
import { ColorModeContextProvider } from './context/color-mode-context.tsx';
import { i18n } from './translations/i18n';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey: [key] }) => {
        if (typeof key !== 'string') {
          throw new Error('Invalid QueryKey');
        }

        const response = await fetch(`${import.meta.env.VITE_BASE_URL}${key}&apikey=${import.meta.env.VITE_ALPHA_VANTAGE_API_KEY}`)
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        return response.json();
      }
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <StyledEngineProvider injectFirst>
          <ColorModeContextProvider>
            <App />
          </ColorModeContextProvider>
        </StyledEngineProvider>
      </QueryClientProvider>
    </I18nextProvider>
  </StrictMode>
)
