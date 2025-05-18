import { FaPen } from 'react-icons/fa';
import { useTranslation } from '../../../context/TranslationContext';
import globalStyle from '../../../globalStyle';
import Card, { Space } from '../../Card/Card';
import CustomBtn from '../../CustomBtn/CustomBtn';
import { useUserContext } from '../../../context/UserContext';
import { useState } from 'react';
import { Modal } from '../../Modal/Modal';
import SettingsCardStyle from './SettingsCardStyle';

export default function SettingsCard() {
	const { t, locale, setLocale } = useTranslation();
	const { user, loading, updateUsername, updateEmail } = useUserContext();
	const [isEditPseudoModalOpen, setIsEditPseudoModalOpen] = useState(false);
	const [isEditEmailModalOpen, setIsEditEmailModalOpen] = useState(false);
	const [newUsername, setNewUsername] = useState('');
	const [newEmail, setNewEmail] = useState('');
	const [emailError, setEmailError] = useState('');

	const validateEmail = (email: string) => {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(email);
	};

	const openEditPseudoModal = () => {
		setNewUsername(user?.username || '');
		setIsEditPseudoModalOpen(true);
	};

	const closeEditPseudoModal = () => {
		setIsEditPseudoModalOpen(false);
	};

	const handleUpdateUsername = async () => {
		if (newUsername && newUsername !== user?.username) {
			await updateUsername(newUsername);
		}
		closeEditPseudoModal();
	};

	const openEmailModal = () => {
		setNewEmail(user?.email || '');
		setEmailError('');
		setIsEditEmailModalOpen(true);
	};

	const closeEmailModal = () => {
		setIsEditEmailModalOpen(false);
		setEmailError('');
	};

	const handleUpdateEmail = async () => {
		if (!validateEmail(newEmail)) {
			setEmailError(t('auth.signup.emailError'));
			return;
		}

		if (newEmail && newEmail !== user?.email) {
			try {
				await updateEmail(newEmail);
				closeEmailModal();
			} catch (error) {
				console.error('Error updating email:', error);
				setEmailError(t('auth.signup.networkError'));
			}
		} else {
			closeEmailModal();
		}
	};

	return (
		<Card>
			<div className={globalStyle.row}>
				<span className={globalStyle.span}>{t('profile.settings')}</span>
			</div>
			<div className={globalStyle.separator}></div>
			{loading ? (
				<p>Chargement des informations...</p>
			) : (
				<>
					<div className={globalStyle.row}>
						<p>{t('profile.pseudo')} :</p>
						<Space />
						<span className={globalStyle.span}>{user?.username || 'Non disponible'}</span>
						<Space />
						<button
							className={SettingsCardStyle.editButton}
							aria-label={t('profile.edit_pseudo')}
							onClick={openEditPseudoModal}
						>
							<FaPen size={20} color="#00babc" />
						</button>
					</div>
					<div className={globalStyle.row}>
						<p>{t('profile.email')} :</p>
						<Space />
						<span className={globalStyle.span}>{user?.email || 'Non disponible'}</span>
						<Space />
						<button
							className={SettingsCardStyle.editButton}
								aria-label={t('profile.edit_email')}
								onClick={openEmailModal}
						>
							<FaPen size={20} color="#00babc" />
						</button>
					</div>
				</>
			)}
			<div className={globalStyle.separator}></div>
			<p>{t('profile.password')} :</p>
			<CustomBtn text={t('profile.changePassword')} onClick={() => console.log('btn')} />
			<div className={globalStyle.separator}></div>
			<div className={globalStyle.row}>
				<p>{t('profile.language')} :</p>
				<Space />
				<div className="relative">
					<select
						className="appearance-none bg-white-custom border border-gray-300 rounded-md py-2 pl-3 pr-10 text-primary focus:outline-none focus:ring-primary focus:border-primary cursor-pointer"
						value={locale}
						onChange={(e) => setLocale(e.target.value as any)}
					>
						<option value="fr">🇫🇷 Français</option>
						<option value="en">🇬🇧 English</option>
						<option value="es">🇪🇸 Español</option>
					</select>
					<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary">
						<svg
							className="h-5 w-5"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fillRule="evenodd"
								d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
				</div>
			</div>
		<Modal
    isOpen={isEditPseudoModalOpen}
    onClose={closeEditPseudoModal}
    title={t('profile.edit_pseudo')}
>
    {/* Modal pseudo */}
    <div className={SettingsCardStyle.container}>
        <input
           type="text"
                className={SettingsCardStyle.input}
                placeholder={t('profile.enter_new_username')}
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
        />
        <div className={SettingsCardStyle.buttonContainer}>
            <button
                className={SettingsCardStyle.cancelButton}
                onClick={closeEditPseudoModal}
            >
                {t('common.cancel')}
            </button>
            <button
                className={SettingsCardStyle.saveButton}
                onClick={handleUpdateUsername}
                disabled={!newUsername || newUsername === user?.username}
            >
                {t('common.save')}
            </button>
        </div>
    </div>
			</Modal>
			<Modal
    isOpen={isEditEmailModalOpen}
    onClose={closeEmailModal}
    title={t('profile.edit_email')}
>
    {/* Modal email */}
    <div className={SettingsCardStyle.container}>
        <input
           type="email"
                className={SettingsCardStyle.input}
                placeholder={t('profile.enter_new_email')}
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
        />
        {emailError && <p className={SettingsCardStyle.errorMessage}>{emailError}</p>}
        <div className={SettingsCardStyle.buttonContainer}>
            <button
                className={SettingsCardStyle.cancelButton}
                onClick={closeEmailModal}
            >
                {t('common.cancel')}
            </button>
            <button
                className={SettingsCardStyle.saveButton}
                onClick={handleUpdateEmail}
                disabled={!newEmail || newEmail === user?.email}
            >
                {t('common.save')}
            </button>
        </div>
    </div>
</Modal>
		</Card>
	);
}
