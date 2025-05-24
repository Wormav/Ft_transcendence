import YourPictureCardStyle from "./YourPictureCardStyle";
import Card, { Space } from "../../Card/Card";
import globalStyle from "../../../globalStyle";
import { useTranslation } from "../../../context/TranslationContext";
import { FaPen } from "react-icons/fa6";
import { useUserContext } from "../../../context/UserContext";
import { useState, useRef } from "react";
import type { ChangeEvent } from "react";
import { Modal } from "../../Modal/Modal";

const YourPictureCard: React.FC = () => {
	const { t } = useTranslation();
	const { user, updateAvatar } = useUserContext();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [imageUrl, setImageUrl] = useState("");
	const [error, setError] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const avatarSrc =
		user?.avatar && user.avatar !== "" ? user.avatar : "/default.png";

	const openModal = () => {
		setIsModalOpen(true);
		setPreviewImage(null);
		setImageUrl("");
		setError("");
		setActiveTab("upload");
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setPreviewImage(null);
		setImageUrl("");
		setError("");
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (
			!file.type.match("image/jpeg") &&
			!file.type.match("image/jpg") &&
			!file.type.match("image/png") &&
			!file.type.match("image/gif")
		) {
			setError(t("settings.invalidImageFormat"));
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			setError(t("settings.imageTooLarge"));
			return;
		}

		setError("");
		const reader = new FileReader();
		reader.onload = (event) => {
			setPreviewImage(event.target?.result as string);
		};
		reader.readAsDataURL(file);
	};

	const handleSaveAvatar = async () => {
		try {
			let avatarData = "";

			if (activeTab === "upload" && previewImage) {
				avatarData = previewImage;
			} else if (activeTab === "url" && imageUrl) {
				avatarData = imageUrl;
			} else {
				setError(t("settings.noImageSelected"));
				return;
			}

			const success = await updateAvatar(avatarData);
			if (success) {
				closeModal();
			} else {
				setError(t("settings.avatarUpdateFailed"));
			}
		} catch (err) {
			console.error("Error updating avatar:", err);
			setError(t("settings.avatarUpdateFailed"));
		}
	};

	const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
		setImageUrl(e.target.value);
		setError("");
	};

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	return (
		<Card>
			<div className={globalStyle.row}>
				<p>{t("settings.yourPicture")}</p>
				<Space />
				<span className={globalStyle.span}>{t("home.profile")}</span>
			</div>
			<div className={YourPictureCardStyle.avatarContainer}>
				<img
					src={avatarSrc}
					alt="Profile"
					className={YourPictureCardStyle.avatar}
				/>
				<button
					className={YourPictureCardStyle.editButton}
					aria-label={t("settings.changeAvatar")}
					onClick={openModal}
				>
					<FaPen size={16} color="#00babc" />
				</button>
			</div>
			<button className={YourPictureCardStyle.uploadButton} onClick={openModal}>
				{t("settings.uploadNewProfilPicture")}
			</button>

			<Modal
				isOpen={isModalOpen}
				onClose={closeModal}
				title={t("settings.updateYourPicture")}
			>
				<div className={YourPictureCardStyle.container}>
					<div className={YourPictureCardStyle.tabContainer}>
						<div
							className={
								activeTab === "upload"
									? YourPictureCardStyle.activeTab
									: YourPictureCardStyle.tab
							}
							onClick={() => setActiveTab("upload")}
						>
							{t("settings.uploadImage")}
						</div>
						<div
							className={
								activeTab === "url"
									? YourPictureCardStyle.activeTab
									: YourPictureCardStyle.tab
							}
							onClick={() => setActiveTab("url")}
						>
							{t("settings.imageUrl")}
						</div>
					</div>

					{activeTab === "upload" && (
						<>
							{previewImage && (
								<div className={YourPictureCardStyle.previewContainer}>
									<img
										src={previewImage}
										alt="Preview"
										className={YourPictureCardStyle.previewImage}
									/>
								</div>
							)}
							<input
								type="file"
								ref={fileInputRef}
								className={YourPictureCardStyle.fileInput}
								accept="image/jpeg,image/jpg,image/png,image/gif"
								onChange={handleFileChange}
							/>
							<button
								className={YourPictureCardStyle.uploadButton}
								onClick={triggerFileInput}
							>
								{previewImage
									? t("settings.chooseAnotherImage")
									: t("settings.chooseImage")}
							</button>
						</>
					)}

					{activeTab === "url" && (
						<div className={YourPictureCardStyle.inputContainer}>
							<label className={YourPictureCardStyle.inputLabel}>
								{t("settings.enterImageUrl")}
							</label>
							<input
								type="url"
								className={YourPictureCardStyle.urlInput}
								placeholder="https://example.com/image.jpg"
								value={imageUrl}
								onChange={handleUrlChange}
							/>
							{imageUrl && (
								<div className={YourPictureCardStyle.previewContainer}>
									<img
										src={imageUrl}
										alt="Preview"
										className={YourPictureCardStyle.previewImage}
										onError={() => setError(t("settings.invalidImageUrl"))}
									/>
								</div>
							)}
						</div>
					)}

					{error && (
						<p className={YourPictureCardStyle.errorMessage}>{error}</p>
					)}

					<div className={YourPictureCardStyle.buttonContainer}>
						<button
							className={YourPictureCardStyle.cancelButton}
							onClick={closeModal}
						>
							{t("common.cancel")}
						</button>
						<button
							className={YourPictureCardStyle.saveButton}
							onClick={handleSaveAvatar}
							disabled={activeTab === "upload" ? !previewImage : !imageUrl}
						>
							{t("common.save")}
						</button>
					</div>
				</div>
			</Modal>
		</Card>
	);
};

export default YourPictureCard;
