import SettingsCardStyle from "./SettingsCardStyle";
import Card from "../../Card/Card";
import CustomBtn from "../../CustomBtn/CustomBtn";
import { FaPen } from "react-icons/fa";
import { useTranslation } from "../../../context/TranslationContext";
import globalStyle from "../../../globalStyle";
import { useUserContext } from "../../../context/UserContext";
import { useState } from "react";
import { Modal } from "../../Modal/Modal";
import { customFetch } from "../../../utils/customFetch";
import { getJwtToken } from "../../../utils/getJwtToken";

const SettingsCard: React.FC = () => {
	const { t, locale, setLocale } = useTranslation();
	const { user, loading, updateUsername, updateEmail } = useUserContext();
	const [isEditPseudoModalOpen, setIsEditPseudoModalOpen] = useState(false);
	const [isEditEmailModalOpen, setIsEditEmailModalOpen] = useState(false);
	const [isEditPasswordModalOpen, setIsEditPasswordModalOpen] = useState(false);
	const [newUsername, setNewUsername] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [confirmPasswordError, setConfirmPasswordError] = useState("");
	const [oldPasswordError, setOldPasswordError] = useState("");
	const [generalError, setGeneralError] = useState("");

	const validateEmail = (email: string) => {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(email);
	};

	const validatePassword = (password: string) => {
		const hasUpperCase = /[A-Z]/.test(password);
		const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
			password,
		);
		const hasNumber = /[0-9]/.test(password);
		const hasMinLength = password.length >= 8;

		const errors = [];
		if (!hasUpperCase) errors.push(t("auth.signup.passwordErrorUppercase"));
		if (!hasSpecialChar) errors.push(t("auth.signup.passwordErrorSpecial"));
		if (!hasNumber) errors.push(t("auth.signup.passwordErrorNumber"));
		if (!hasMinLength) errors.push(t("auth.signup.passwordErrorLength"));

		return {
			isValid: hasUpperCase && hasSpecialChar && hasNumber && hasMinLength,
			errors,
		};
	};

	const openEditPseudoModal = () => {
		setNewUsername(user?.username || "");
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
		setNewEmail(user?.email || "");
		setEmailError("");
		setIsEditEmailModalOpen(true);
	};

	const closeEmailModal = () => {
		setIsEditEmailModalOpen(false);
		setEmailError("");
	};

	const handleUpdateEmail = async () => {
		if (!validateEmail(newEmail)) {
			setEmailError(t("auth.signup.emailError"));
			return;
		}

		if (newEmail && newEmail !== user?.email) {
			try {
				await updateEmail(newEmail);
				closeEmailModal();
			} catch (error) {
				console.error("Error updating email:", error);
				setEmailError(t("auth.signup.networkError"));
			}
		} else {
			closeEmailModal();
		}
	};

	const openPasswordModal = () => {
		setOldPassword("");
		setNewPassword("");
		setConfirmPassword("");
		setPasswordError("");
		setConfirmPasswordError("");
		setOldPasswordError("");
		setGeneralError("");
		setIsEditPasswordModalOpen(true);
	};

	const closePasswordModal = () => {
		setIsEditPasswordModalOpen(false);
	};

	const handleUpdatePassword = async () => {
		setPasswordError("");
		setConfirmPasswordError("");
		setOldPasswordError("");
		setGeneralError("");

		let isValid = true;

		if (!oldPassword) {
			setOldPasswordError(t("profile.oldPasswordRequired"));
			isValid = false;
		}

		const passwordValidation = validatePassword(newPassword);
		if (!passwordValidation.isValid) {
			const errorMsg = t("auth.signup.passwordError").replace(
				"{0}",
				passwordValidation.errors.join(", "),
			);
			setPasswordError(errorMsg);
			isValid = false;
		}

		if (newPassword !== confirmPassword) {
			setConfirmPasswordError(t("auth.signup.passwordsNotMatch"));
			isValid = false;
		}

		if (isValid) {
			try {
				const token = getJwtToken();
				const response = await customFetch(
					`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/auth/update`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({
							new_password: newPassword,
							old_password: oldPassword,
						}),
					},
				);

				if (response.ok) {
					closePasswordModal();
				} else {
					const data = await response.json();
					if (data.error) {
						setGeneralError(data.error);
					} else {
						setGeneralError(t("profile.updatePasswordError"));
					}
				}
			} catch (error) {
				console.error("Error updating password:", error);
				setGeneralError(t("profile.networkError"));
			}
		}
	};

	return (
		<Card>
			<div className="md:flex md:flex-row items-center block">
				<span className={globalStyle.span}>{t("profile.settings")}</span>
			</div>
			<div className={globalStyle.separator}></div>
			{loading ? (
				<p>Chargement des informations...</p>
			) : (
				<>
					<div className="md:flex md:flex-row items-center block mb-2">
						<p>{t("profile.pseudo")} :</p>
						<span className="md:mx-2"></span>
						<span className={globalStyle.span}>
							{user?.username || "Non disponible"}
						</span>
						<span className="md:mx-2"></span>
						<button
							className={SettingsCardStyle.editButton}
							aria-label={t("profile.edit_pseudo")}
							onClick={openEditPseudoModal}
						>
							<FaPen size={20} color="#00babc" />
						</button>
					</div>
					<div className="md:flex md:flex-row items-center block mb-2">
						<p>{t("profile.email")} :</p>
						<span className="md:mx-2"></span>
						<span className={globalStyle.span}>
							{user?.email || "Non disponible"}
						</span>
						<span className="md:mx-2"></span>
						<button
							className={SettingsCardStyle.editButton}
							aria-label={t("profile.edit_email")}
							onClick={openEmailModal}
						>
							<FaPen size={20} color="#00babc" />
						</button>
					</div>
				</>
			)}
			<div className={globalStyle.separator}></div>
			<p>{t("profile.password")} :</p>
			<CustomBtn
				text={t("profile.changePassword")}
				onClick={openPasswordModal}
			/>
			<div className={globalStyle.separator}></div>
			<div className="md:flex md:flex-row items-center block">
				<p>{t("profile.language")} :</p>
				<span className="md:mx-2"></span>
				<div className="relative mt-2 md:mt-0">
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
				title={t("profile.edit_pseudo")}
			>
				{/* Modal pseudo */}
				<div className={SettingsCardStyle.container}>
					<input
						type="text"
						className={SettingsCardStyle.input}
						placeholder={t("profile.enter_new_username")}
						value={newUsername}
						onChange={(e) => setNewUsername(e.target.value)}
					/>
					<div className={SettingsCardStyle.buttonContainer}>
						<button
							className={SettingsCardStyle.cancelButton}
							onClick={closeEditPseudoModal}
						>
							{t("common.cancel")}
						</button>
						<button
							className={SettingsCardStyle.saveButton}
							onClick={handleUpdateUsername}
							disabled={!newUsername || newUsername === user?.username}
						>
							{t("common.save")}
						</button>
					</div>
				</div>
			</Modal>
			<Modal
				isOpen={isEditEmailModalOpen}
				onClose={closeEmailModal}
				title={t("profile.edit_email")}
			>
				{/* Modal email */}
				<div className={SettingsCardStyle.container}>
					<input
						type="email"
						className={SettingsCardStyle.input}
						placeholder={t("profile.enter_new_email")}
						value={newEmail}
						onChange={(e) => setNewEmail(e.target.value)}
					/>
					{emailError && (
						<p className={SettingsCardStyle.errorMessage}>{emailError}</p>
					)}
					<div className={SettingsCardStyle.buttonContainer}>
						<button
							className={SettingsCardStyle.cancelButton}
							onClick={closeEmailModal}
						>
							{t("common.cancel")}
						</button>
						<button
							className={SettingsCardStyle.saveButton}
							onClick={handleUpdateEmail}
							disabled={!newEmail || newEmail === user?.email}
						>
							{t("common.save")}
						</button>
					</div>
				</div>
			</Modal>
			<Modal
				isOpen={isEditPasswordModalOpen}
				onClose={closePasswordModal}
				title={t("profile.changePassword")}
			>
				{/* Modal password */}
				<div className={SettingsCardStyle.container}>
					<input
						type="password"
						className={SettingsCardStyle.input}
						placeholder={t("profile.enter_old_password")}
						value={oldPassword}
						onChange={(e) => setOldPassword(e.target.value)}
					/>
					{oldPasswordError && (
						<p className={SettingsCardStyle.errorMessage}>{oldPasswordError}</p>
					)}
					<input
						type="password"
						className={SettingsCardStyle.input}
						placeholder={t("profile.enter_new_password")}
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
					/>
					{passwordError && (
						<p className={SettingsCardStyle.errorMessage}>{passwordError}</p>
					)}
					<input
						type="password"
						className={SettingsCardStyle.input}
						placeholder={t("profile.confirm_new_password")}
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
					{confirmPasswordError && (
						<p className={SettingsCardStyle.errorMessage}>
							{confirmPasswordError}
						</p>
					)}
					{generalError && (
						<p className={SettingsCardStyle.errorMessage}>{generalError}</p>
					)}
					<div className={SettingsCardStyle.buttonContainer}>
						<button
							className={SettingsCardStyle.cancelButton}
							onClick={closePasswordModal}
						>
							{t("common.cancel")}
						</button>
						<button
							className={SettingsCardStyle.saveButton}
							onClick={handleUpdatePassword}
							disabled={!oldPassword || !newPassword || !confirmPassword}
						>
							{t("common.save")}
						</button>
					</div>
				</div>
			</Modal>
		</Card>
	);
};

export default SettingsCard;
