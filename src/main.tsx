import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { TranslationProvider } from './context/TranslationContext';
import router from './router';
import './App.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<TranslationProvider>
			<RouterProvider router={router} />
		</TranslationProvider>
	</StrictMode>
);
