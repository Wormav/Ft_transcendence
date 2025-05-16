import { createContext, useState, useContext, useEffect } from 'react';
import type { UserContextType, UserData } from '../types/UserContextType';

const UserContext = createContext<UserContextType>({
  user: null,
  loading: false,
  error: null,
  fetchUserData: async () => {}
});

const getJwtToken = (): string | null => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'jwt') {
      return value;
    }
  }
  return null;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getJwtToken();

      if (!token) {
        setLoading(false);
        setError('Aucun token d\'authentification trouvé');
        return;
      }

      const response = await fetch(`/api/user/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des données utilisateur: ${response.status}`);
      }

      const userData = await response.json();

      const filteredUserData: UserData = {
        uuid: userData.uuid,
        email: userData.email,
        username: userData.username,
        avatar: userData.avatar
      };

      setUser(filteredUserData);
      console.log('Données utilisateur récupérées:', filteredUserData);
    } catch (err: any) {
      console.error('Erreur lors de la récupération des données utilisateur:', err);
      // Vérifier si c'est une erreur CORS
      if (err.message && err.message.includes('NetworkError') ||
          err.message && err.message.includes('Failed to fetch')) {
        setError('Erreur de connexion au serveur. Problème potentiel de CORS.');
      } else {
        setError(err.message || 'Une erreur est survenue lors de la récupération des données utilisateur');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
