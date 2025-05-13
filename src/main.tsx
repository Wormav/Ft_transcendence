import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { TranslationProvider } from './context/TranslationContext';
import router from './router';
import './App.css';
import { SettingsProvider } from './context/SettingsContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<TranslationProvider>
			<SettingsProvider>
			<RouterProvider router={router} />
			</SettingsProvider>
		</TranslationProvider>
	</StrictMode>
);
