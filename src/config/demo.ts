// Configuration du mode démo
export const DEMO_CONFIG = {
  // Active le mode démo (remplace tous les appels backend par des données fictives)
  // En production GitHub Pages, toujours activer le mode démo
  ENABLED: import.meta.env.PROD || import.meta.env.VITE_DEMO_MODE === 'true',

  // URL de base pour le mode production (quand DEMO_MODE = false)
  BACKEND_URL: `http://localhost:${import.meta.env.VITE_BACKEND_PORT || 3001}`,

  // Délai simulé pour les appels API (en ms)
  API_DELAY: {
    MIN: 100,
    MAX: 500,
  },

  // Messages de démo
  MESSAGES: {
    LOADING: "Chargement des données de démonstration...",
    AUTO_LOGIN: "Connexion automatique en mode démo",
    BACKEND_DISABLED: "Backend désactivé - Mode démonstration",
  }
};

// Helper pour savoir si on est en mode démo
export const isDemoMode = () => DEMO_CONFIG.ENABLED;

// Helper pour obtenir l'URL du backend
export const getBackendUrl = () => DEMO_CONFIG.BACKEND_URL;
