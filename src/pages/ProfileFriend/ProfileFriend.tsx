import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProfilHomeCard from "../../components/Cards/ProfilHomeCard/ProfilHomeCard";
import ResultsCard from "../../components/Cards/ResultsCard/ResultsCard";
import globalStyle from "../../globalStyle";
import { customFetch } from "../../utils/customFetch";
import { getJwtToken } from "../../utils/getJwtToken";
import { useTranslation } from "../../context/TranslationContext";

interface FriendProfile {
  uuid: string;
  email: string;
  username: string;
  avatar: string;
  color_items?: string;
  color_bg?: string;
  size_text?: string;
  speed_moves?: string;
}

export default function ProfileFriend() {
  const { uuid } = useParams<{ uuid: string }>();
  const [friendProfile, setFriendProfile] = useState<FriendProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriendProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = getJwtToken();
        if (!token) {
          navigate('/login');
          return;
        }

        if (!uuid) {
          setError("UUID manquant");
          setLoading(false);
          return;
        }

        const response = await customFetch(`/api/user/${uuid}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération du profil: ${response.status}`);
        }

        const profileData = await response.json();
        setFriendProfile(profileData);
      } catch (err: any) {
        console.error('Erreur lors du chargement du profil ami:', err);
        setError(err.message || "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchFriendProfile();
  }, [uuid, navigate]);

  if (loading) {
    return (
      <div className={globalStyle.cardContainer}>
        <div className="flex justify-center items-center min-h-screen">
          <p>{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !friendProfile) {
    return (
      <div className={globalStyle.cardContainer}>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-red-500">{error || "Profil non trouvé"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={globalStyle.cardContainer}>
      <ProfilHomeCard
        home={false}
        friendProfile={friendProfile}
      />
      <ResultsCard />
    </div>
  );
}
