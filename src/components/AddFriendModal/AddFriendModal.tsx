import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import AddFriendModalStyles from './AddFriendModalStyles';

interface AddFriendModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddFriendModal: React.FC<AddFriendModalProps> = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [modalRoot] = useState(() => {
        const root = document.createElement('div');
        root.setAttribute('id', 'modal-root');
        document.body.appendChild(root);
        return root;
    });

    useEffect(() => {
        return () => {
            document.body.removeChild(modalRoot);
        };
    }, [modalRoot]);

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

    const handleOverlayClick = (event: React.MouseEvent) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className={AddFriendModalStyles.overlay} onClick={handleOverlayClick}>
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
                <h2 className={AddFriendModalStyles.title}>Rechercher un ami</h2>
                <div className={AddFriendModalStyles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Rechercher..."
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
                    {/* Ici, vous pourrez ajouter la liste des résultats de recherche */}
                </div>
            </div>
        </div>
        , modalRoot);
};

export default AddFriendModal;
