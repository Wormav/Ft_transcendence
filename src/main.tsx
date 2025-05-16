import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { TranslationProvider } from './context/TranslationContext';
import router from './router';
import './App.css';
import './styles/zIndex.css';
import { SettingsProvider } from './context/SettingsContext';
import { UserProvider } from './context/UserContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<TranslationProvider>
			<SettingsProvider>
				<UserProvider>
					<RouterProvider router={router} />
				</UserProvider>
			</SettingsProvider>
		</TranslationProvider>
	</StrictMode>
);
