import { useEffect } from "react";
import type { ModalProps } from "../../types/ModalProps"
import { createPortal } from "react-dom";


export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
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

    if (!isOpen) return null;

    const handleOverlayClick = (event: React.MouseEvent) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return createPortal(
        <div className="fixed inset-0 isolate" style={{ zIndex: 99999 }}>
            <div
                className="fixed inset-0 bg-black/25 backdrop-blur flex items-center justify-center min-h-screen min-w-screen overflow-hidden"
                onClick={handleOverlayClick}
            >
                <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-auto p-6 relative">
                    <button
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={onClose}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-6 h-6"
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

                    {title && <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>}

                    <div className="mt-2">
                        {children}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
