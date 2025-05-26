import AddFriendModalStyles from "./AddFriendModalStyles";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../context/TranslationContext";
import { useUserContext } from "../../context/UserContext";
import { useFriendContext } from "../../context/FriendContext";
import { useToast } from "../../context/ToastContext";
import { customFetch } from "../../utils/customFetch";
import { getJwtToken } from "../../utils/getJwtToken";
import { useSettings } from "../../context/SettingsContext";
import { getSizeTextStyle } from "../../globalStyle";
import type { AddFriendModalProps } from "../../types/AddFreindModalProps";
import type { UserSearchResult } from "../../types/UserSearchResult";

const AddFriendModal: React.FC<AddFriendModalProps> = ({
	isOpen,
	onClose,
}): React.ReactElement | null => {
	const [searchQuery, setSearchQuery] = useState("");
	const [users, setUsers] = useState<UserSearchResult[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { t } = useTranslation();
	const { user } = useUserContext();
	const {
		friendData,
		fetchFriendData,
		addFriend,
		removeFriend,
		acceptFriendRequest,
		declineFriendRequest,
	} = useFriendContext();
	const { showToast } = useToast();
	const navigate = useNavigate();
	const { size_text } = useSettings();

	const searchUsers = async () => {
		try {
			setLoading(true);
			setError(null);

			const token = getJwtToken();

			const response = await customFetch(
				`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/user/users`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				},
			);

			if (!response.ok) {
				throw new Error(`${t("error.searchUsers")}: ${response.status}`);
			}

			const data: UserSearchResult[] = await response.json();

			const filteredUsers = data.filter((u) => u.uuid !== user?.uuid);

			setUsers(filteredUsers);
		} catch (err: any) {
			console.error("Error searching users:", err);
			setError(err.message || t("error.unknown"));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (isOpen) {
			searchUsers();
			fetchFriendData();
		}
	}, [isOpen]);

	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		if (isOpen) {
			window.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}

		return () => {
			window.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const handleOverlayClick = (event: React.MouseEvent) => {
		if (event.target === event.currentTarget) {
			onClose();
		}
	};

	const filteredUsers =
		searchQuery.trim() === ""
			? []
			: users.filter((user) =>
					user.username.toLowerCase().includes(searchQuery.toLowerCase()),
				);

	const handleRemoveFriend = async (targetUserUuid: string) => {
		if (!user?.uuid) return;
		const relation = friendData?.friends.find(
			(friend) =>
				(friend.requester_uuid === user.uuid &&
					friend.target_uuid === targetUserUuid) ||
				(friend.target_uuid === user.uuid &&
					friend.requester_uuid === targetUserUuid),
		);
		if (!relation) {
			console.error(
				"Friendship relation not found for removal",
				targetUserUuid,
			);
			return;
		}
		const friendUuid =
			relation.requester_uuid === user.uuid
				? relation.target_uuid
				: relation.requester_uuid;
		try {
			const success = await removeFriend(friendUuid);
			if (success) {
				showToast(t("notifications.friendRemoved"), "success");
				fetchFriendData();
			} else {
				showToast(t("notifications.error"), "error");
			}
		} catch (error) {
			console.error("Error removing friend:", error);
			showToast(t("notifications.error"), "error");
		}
	};

	return createPortal(
		<div className={AddFriendModalStyles.overlay} style={{ zIndex: 99999 }}>
			<div
				className={AddFriendModalStyles.overlayInner}
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
								<filter
									id="closeShadow"
									x="-20%"
									y="-20%"
									width="140%"
									height="140%"
								>
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
					<h2
						className={`${AddFriendModalStyles.title} ${getSizeTextStyle(size_text)}`}
					>
						{t("menu.addFriend")}
					</h2>
					<div className={AddFriendModalStyles.searchContainer}>
						<input
							type="text"
							placeholder={t("search.placeholder")}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className={`${AddFriendModalStyles.searchInput} ${getSizeTextStyle(size_text)}`}
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
							<div
								className={`${AddFriendModalStyles.messageContainer} ${getSizeTextStyle(size_text)}`}
							>
								{t("loading")}
							</div>
						) : error ? (
							<div
								className={`${AddFriendModalStyles.errorMessage} ${getSizeTextStyle(size_text)}`}
							>
								{error}
							</div>
						) : searchQuery.trim() === "" ? (
							<div
								className={`${AddFriendModalStyles.messageContainer} ${getSizeTextStyle(size_text)}`}
							>
								{t("search.enterQuery")}
							</div>
						) : filteredUsers.length === 0 ? (
							<div
								className={`${AddFriendModalStyles.messageContainer} ${getSizeTextStyle(size_text)}`}
							>
								{t("search.noResults")}
							</div>
						) : (
							<ul className={AddFriendModalStyles.resultsList}>
								{filteredUsers.map((user) => (
									<li key={user.uuid} className={AddFriendModalStyles.userItem}>
										<div className={AddFriendModalStyles.userInfo}>
											<div
												className={AddFriendModalStyles.userAvatar}
												onClick={() => {
													navigate(`/profile/${user.uuid}`);
													onClose();
												}}
											>
												{user.avatar ? (
													<img
														src={user.avatar}
														alt={user.username}
														className={AddFriendModalStyles.userAvatarImg}
													/>
												) : (
													<img
														src="/default.png"
														alt={user.username}
														className={AddFriendModalStyles.userAvatarImg}
													/>
												)}
											</div>
											<div
												className={AddFriendModalStyles.userName}
												onClick={() => {
													navigate(`/profile/${user.uuid}`);
													onClose();
												}}
											>
												<p
													className={`${AddFriendModalStyles.userNameText} ${getSizeTextStyle(size_text)}`}
												>
													{user.username}
												</p>
											</div>
										</div>
										<div
											className={`${AddFriendModalStyles.actionButtons} ${getSizeTextStyle(size_text)}`}
										>
											{(() => {
												const isFriend = friendData?.friends.some(
													(friend) =>
														friend.requester_uuid === user.uuid ||
														friend.target_uuid === user.uuid,
												);
												const requestSent = friendData?.requests_sent.some(
													(request) => request.target_uuid === user.uuid,
												);
												const requestReceived =
													friendData?.requests_received.some(
														(request) => request.requester_uuid === user.uuid,
													);
												if (isFriend) {
													return (
														<button
															onClick={() => handleRemoveFriend(user.uuid)}
															className={`${AddFriendModalStyles.removeFriendButton} ${getSizeTextStyle(size_text)}`}
														>
															{t("removeFriend")}
														</button>
													);
												} else if (requestSent) {
													return (
														<button
															onClick={async () => {
																try {
																	const request =
																		friendData?.requests_sent.find(
																			(req) => req.target_uuid === user.uuid,
																		);
																	if (!request) {
																		showToast(
																			t("notifications.error"),
																			"error",
																		);
																		return;
																	}

																	const success = await declineFriendRequest(
																		user.uuid,
																	);
																	if (success) {
																		showToast(
																			t("notifications.requestCancelled"),
																			"success",
																		);
																		fetchFriendData();
																	} else {
																		showToast(
																			t("notifications.error"),
																			"error",
																		);
																	}
																} catch (error) {
																	console.error(
																		"Error cancelling the request:",
																		error,
																	);
																	showToast(t("notifications.error"), "error");
																}
															}}
															className={`${AddFriendModalStyles.pendingButton} ${getSizeTextStyle(size_text)}`}
														>
															{t("pendingRequest")}
														</button>
													);
												} else if (requestReceived) {
													return (
														<button
															onClick={async () => {
																try {
																	const request =
																		friendData?.requests_received.find(
																			(req) => req.requester_uuid === user.uuid,
																		);
																	if (!request) {
																		showToast(
																			t("notifications.error"),
																			"error",
																		);
																		return;
																	}

																	const success = await acceptFriendRequest(
																		user.uuid,
																	);
																	if (success) {
																		showToast(
																			t("notifications.friendRequestAccepted"),
																			"success",
																		);
																		fetchFriendData();
																	} else {
																		showToast(
																			t("notifications.error"),
																			"error",
																		);
																	}
																} catch (error) {
																	console.error(
																		"Error accepting friend request:",
																		error,
																	);
																	showToast(t("notifications.error"), "error");
																}
															}}
															className={`${AddFriendModalStyles.acceptButton} ${getSizeTextStyle(size_text)}`}
														>
															{t("acceptRequest")}
														</button>
													);
												} else {
													return (
														<button
															onClick={async () => {
																try {
																	const success = await addFriend(user.uuid);
																	if (success) {
																		showToast(
																			t("notifications.friendRequestSent"),
																			"success",
																		);
																		fetchFriendData();
																	} else {
																		console.error(
																			"Failed to add friend:",
																			user.uuid,
																		);
																		showToast(
																			t("notifications.error"),
																			"error",
																		);
																	}
																} catch (error) {
																	console.error("Error adding friend:", error);
																	showToast(t("notifications.error"), "error");
																}
															}}
															className={`${AddFriendModalStyles.addFriendButton} ${getSizeTextStyle(size_text)}`}
														>
															{t("addFriend")}
														</button>
													);
												}
											})()}
										</div>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</div>
		</div>,
		document.body,
	);
};

export default AddFriendModal;
