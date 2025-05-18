import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import AddFriendModalStyles from './AddFriendModalStyles';
import { useTranslation } from '../../context/TranslationContext';
import { useUserContext } from '../../context/UserContext';
import { customFetch } from '../../utils/customFetch';
import { getJwtToken } from '../../utils/getJwtToken';

interface AddFriendModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface UserSearchResult {
    uuid: string;
    email: string;
    username: string;
    avatar: string;
}

const AddFriendModal: React.FC<AddFriendModalProps> = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<UserSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();
    const { user } = useUserContext();
    const navigate = useNavigate();

    // Recherche d'utilisateurs
    const searchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = getJwtToken();

            const response = await customFetch('/api/user/users', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`${t('error.searchUsers')}: ${response.status}`);
            }

            const data: UserSearchResult[] = await response.json();

            const filteredUsers = data.filter(u => u.uuid !== user?.uuid);

            setUsers(filteredUsers);
        } catch (err: any) {
            console.error('Error searching users:', err);
            setError(err.message || t('error.unknown'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            searchUsers();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const sendFriendRequest = async (userId: string) => {
        try {
            setLoading(true);

            const token = getJwtToken();

            // Cette URL et cette structure de données sont susceptibles d'être modifiées
            // en fonction de votre API réelle
            const response = await customFetch('/api/friends/request', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ friendId: userId })
            });

            if (!response.ok) {
                throw new Error(`${t('error.friendRequest')}: ${response.status}`);
            }

            // Optionnel: vous pourriez vouloir mettre à jour l'interface utilisateur
            // par exemple en désactivant le bouton pour cet utilisateur
            console.log('Friend request sent to user with ID:', userId);

        } catch (err: any) {
            console.error('Error sending friend request:', err);
            setError(err.message || t('error.unknown'));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const handleOverlayClick = (event: React.MouseEvent) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const filteredUsers = searchQuery.trim() === ''
        ? []
        : users.filter(user =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase())
        );

    return createPortal(
        <div className="fixed inset-0 isolate" style={{ zIndex: 99999 }}>
            <div
                className="fixed inset-0 bg-black/25 backdrop-blur flex items-center justify-center min-h-screen min-w-screen overflow-hidden"
                onClick={handleOverlayClick}
            >
                <div className={AddFriendModalStyles.modal}>
                    <button
                        className={AddFriendModalStyles.closeButton}
                        onClick={onClose}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <defs>
                                <filter id="closeShadow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feDropShadow
                                        dx="1"
                                        dy="1"
                                        stdDeviation="2"
                                        floodOpacity="0.3"
                                        floodColor="#000"
                                    />
                                </filter>
                            </defs>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M6 18L18 6M6 6l12 12"
                                filter="url(#closeShadow)"
                            />
                        </svg>
                    </button>
                    <h2 className={AddFriendModalStyles.title}>{t('menu.addFriend')}</h2>
                    <div className={AddFriendModalStyles.searchContainer}>
                        <input
                            type="text"
                            placeholder={t('search.placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={AddFriendModalStyles.searchInput}
                        />
                        <button className={AddFriendModalStyles.searchButton}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className={AddFriendModalStyles.results}>
                        {loading ? (
                            <div className="text-center py-4">{t('loading')}</div>
                        ) : error ? (
                            <div className="text-red-500 text-center py-4">{error}</div>
                        ) : searchQuery.trim() === '' ? (
                            <div className="text-center py-4">{t('search.enterQuery')}</div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center py-4">{t('search.noResults')}</div>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {filteredUsers.map(user => (
                                    <li key={user.uuid} className={`py-3 flex items-center justify-between ${AddFriendModalStyles.userItem}`}>
                                        <div className="flex items-center">
                                            <div
                                                className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 cursor-pointer"
                                                onClick={() => {
                                                    navigate(`/profile/${user.uuid}`);
                                                    onClose();
                                                }}
                                            >
                                                {user.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.username}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <img
                                                        src="/default.JPG"
                                                        alt={user.username}
                                                        className="h-full w-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div
                                                className="ml-3 cursor-pointer"
                                                onClick={() => {
                                                    navigate(`/profile/${user.uuid}`);
                                                    onClose();
                                                }}
                                            >
                                                <p className="text-sm font-medium text-gray-900">{user.username}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => sendFriendRequest(user.uuid)}
                                            className="ml-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                                        >
                                            {t('addFriend')}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AddFriendModal;
