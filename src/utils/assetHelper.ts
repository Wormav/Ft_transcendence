// Helper pour les chemins d'assets en fonction de l'environnement
export const getAssetPath = (path: string): string => {
  // Enlever le slash initial si présent
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // En production, utiliser le base path de GitHub Pages
  if (import.meta.env.PROD) {
    return `/42_Ft_transcendence/${cleanPath}`;
  }
  
  // En développement, utiliser le chemin relatif standard
  return `/${cleanPath}`;
};

// Helper spécifique pour les images du dossier public
export const getPublicAsset = (filename: string): string => {
  return getAssetPath(filename);
};
