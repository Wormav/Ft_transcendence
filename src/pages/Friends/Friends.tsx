import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFriendContext } from "../../context/FriendContext";
import { useTranslation } from "../../context/TranslationContext";
import { useToast } from "../../context/ToastContext";
import { useUserContext } from "../../context/UserContext";
import FriendsStyle from "./FriendsStyle";
import { customFetch } from "../../utils/customFetch";
import { getJwtToken } from "../../utils/getJwtToken";
import type { FriendProfile } from "../../types/FriendProfile";

const Friends = () => {
	const { t } = useTranslation();
	const {
		friendData,
		fetchFriendData,
		acceptFriendRequest,
		declineFriendRequest,
		removeFriend,
	} = useFriendContext();
	const { user } = useUserContext();
	const navigate = useNavigate();
	const { showToast } = useToast();
	const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");
	const [isProcessing, setIsProcessing] = useState<{ [key: string]: boolean }>(
		{},
	);
	const [requestUsers, setRequestUsers] = useState<{
		[key: string]: FriendProfile;
	}>({});
	const [userLoadingState, setUserLoadingState] = useState<{
		[key: string]: boolean;
	}>({});

	useEffect(() => {
		fetchFriendData();
	}, []);
	useEffect(() => {
		if (friendData) {
			console.log(
				"Structure des données amis:",
				JSON.stringify(friendData, null, 2),
			);
		}

		// Charger les informations des utilisateurs pour les demandes d'amis
		if (friendData && friendData.requests_received) {
			friendData.requests_received.forEach((request) => {
				if (
					!requestUsers[request.requester_uuid] &&
					!userLoadingState[request.requester_uuid]
				) {
					fetchUserDetails(request.requester_uuid);
				}
			});
		}

		// Charger les informations des amis
		if (friendData && friendData.friends && user?.uuid) {
			console.log("Liste des amis (nombre):", friendData.friends.length);

			// Pour chaque ami, déterminer l'UUID de l'ami (qui n'est pas le mien)
			friendData.friends.forEach((friend) => {
				// Déterminer l'UUID de l'ami (celui qui n'est pas le mien)
				const friendUuid =
					friend.requester_uuid === user.uuid
						? friend.target_uuid
						: friend.requester_uuid;

				console.log(
					`Relation d'amitié détectée: ${friend.requester_uuid} <-> ${friend.target_uuid}, ami identifié: ${friendUuid}`,
				);

				// Vérifier si l'UUID est valide
				if (!friendUuid) {
					console.error("Relation d'amitié invalide détectée:", friend);
					return;
				}

				// Toujours charger les détails pour avoir les infos à jour
				console.log(`Chargement des détails pour l'ami ${friendUuid}`);
				fetchUserDetails(friendUuid);
			});
		}
	}, [friendData, user?.uuid]); // Dépend de friendData et de l'UUID de l'utilisateur
	const fetchUserDetails = async (uuid: string) => {
		// Si déjà en train de charger, ne pas faire d'appel supplémentaire
		if (userLoadingState[uuid]) {
			console.log(`Chargement déjà en cours pour ${uuid}, requête ignorée`);
			return;
		}

		console.log(`Début du chargement des détails pour l'utilisateur ${uuid}`);
		setUserLoadingState((prev) => ({ ...prev, [uuid]: true }));

		try {
			const token = getJwtToken();
			if (!token) {
				console.error("Aucun jeton d'authentification trouvé");
				showToast(t("notifications.authError"), "error");
				return;
			}

			console.log(`Envoi de requête à l'API pour l'utilisateur ${uuid}`);
			const response = await customFetch(`/api/user/${uuid}`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(
					`Erreur lors de la récupération des détails de l'utilisateur: ${response.status}`,
				);
			}

			const userData: FriendProfile = await response.json();
			console.log(`Données utilisateur récupérées pour ${uuid}:`, userData);

			if (!userData || !userData.username) {
				console.warn(`Données invalides pour l'utilisateur ${uuid}:`, userData);
			}

			// Mettre à jour le state avec les nouvelles données
			setRequestUsers((prev) => ({ ...prev, [uuid]: userData }));
		} catch (error) {
			console.error(
				`Erreur lors de la récupération des détails de l'utilisateur ${uuid}:`,
				error,
			);
			showToast(t("notifications.userDataError"), "error");
		} finally {
			setUserLoadingState((prev) => ({ ...prev, [uuid]: false }));
			console.log(`Fin du chargement des détails pour l'utilisateur ${uuid}`);
		}
	};

	const handleRemoveFriend = async (uuid: string) => {
		if (isProcessing[uuid]) return;

		setIsProcessing((prev) => ({ ...prev, [uuid]: true }));
		try {
			const success = await removeFriend(uuid);
			if (success) {
				console.log("Ami supprimé avec succès:", uuid);
				showToast(t("notifications.friendRemoved"), "success");
			} else {
				console.error("Échec de la suppression d'ami:", uuid);
				showToast(t("notifications.error"), "error");
			}
		} catch (error) {
			console.error("Erreur lors de la suppression d'ami:", error);
			showToast(t("notifications.error"), "error");
		} finally {
			setIsProcessing((prev) => ({ ...prev, [uuid]: false }));
		}
	};

	const handleAcceptRequest = async (uuid: string) => {
		if (isProcessing[uuid]) return;

		setIsProcessing((prev) => ({ ...prev, [uuid]: true }));
		try {
			const success = await acceptFriendRequest(uuid);
			if (success) {
				console.log("Demande d'ami acceptée avec succès:", uuid);
				showToast(t("notifications.friendRequestAccepted"), "success");
			} else {
				console.error("Échec de l'acceptation de la demande d'ami:", uuid);
				showToast(t("notifications.error"), "error");
			}
		} catch (error) {
			console.error("Erreur lors de l'acceptation de la demande d'ami:", error);
			showToast(t("notifications.error"), "error");
		} finally {
			setIsProcessing((prev) => ({ ...prev, [uuid]: false }));
		}
	};

	const handleDeclineRequest = async (uuid: string) => {
		if (isProcessing[uuid]) return;

		setIsProcessing((prev) => ({ ...prev, [uuid]: true }));
		try {
			const success = await declineFriendRequest(uuid);
			if (success) {
				console.log("Demande d'ami refusée avec succès:", uuid);
				showToast(t("notifications.friendRequestDeclined"), "success");
			} else {
				console.error("Échec du refus de la demande d'ami:", uuid);
				showToast(t("notifications.error"), "error");
			}
		} catch (error) {
			console.error("Erreur lors du refus de la demande d'ami:", error);
			showToast(t("notifications.error"), "error");
		} finally {
			setIsProcessing((prev) => ({ ...prev, [uuid]: false }));
		}
	};

	const renderEmpty = (message: string) => (
		<div className={FriendsStyle.emptyContainer}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className={FriendsStyle.emptyIcon}
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
				/>
			</svg>
			<p className={FriendsStyle.emptyText}>{message}</p>
		</div>
	);

	return (
		<div className={FriendsStyle.container}>
			<h1 className={FriendsStyle.title}>{t("friends.title")}</h1>

			{/* Tabs */}
			<div className={FriendsStyle.tabContainer}>
				<button
					className={`${FriendsStyle.tabButton} ${
						activeTab === "friends"
							? FriendsStyle.tabActive
							: FriendsStyle.tabInactive
					}`}
					onClick={() => setActiveTab("friends")}
				>
					{t("friends.myFriends")}
					{friendData &&
						friendData.friends &&
						friendData.friends.length > 0 && (
							<span className={FriendsStyle.tabCounter}>
								{friendData.friends.length}
							</span>
						)}
				</button>
				<button
					className={`${FriendsStyle.tabButton} ${
						activeTab === "requests"
							? FriendsStyle.tabActive
							: FriendsStyle.tabInactive
					}`}
					onClick={() => setActiveTab("requests")}
				>
					{t("friends.requests")}
					{friendData &&
						friendData.requests_received &&
						friendData.requests_received.length > 0 && (
							<span className={FriendsStyle.tabNotification}>
								{friendData.requests_received.length}
							</span>
						)}
				</button>
			</div>

			{/* Content based on active tab */}
			{activeTab === "friends" ? (
				// Friends list
				<div className={FriendsStyle.contentContainer}>
					{!friendData ||
					!friendData.friends ||
					friendData.friends.length === 0 ? (
						renderEmpty(t("friends.noFriends"))
					) : (
						<ul className={FriendsStyle.list}>
							{friendData.friends.map((friend) => {
								// Déterminer l'UUID de l'ami (celui qui n'est pas le mien)
								const friendUuid =
									friend.requester_uuid === user?.uuid
										? friend.target_uuid
										: friend.requester_uuid;

								// Récupérer les détails de l'ami si disponibles
								const friendDetails = requestUsers[friendUuid] || {
									uuid: friendUuid,
									username: "Loading...",
									email: "",
									avatar: "",
								};
								const isLoading = userLoadingState[friendUuid] || false;

								return (
									<li key={friend.id} className={FriendsStyle.listItem}>
										<div
											className={FriendsStyle.profileSection}
											onClick={() => {
												if (friendUuid) {
													console.log("Navigation vers le profil:", friendUuid);
													navigate(`/profile/${friendUuid}`);
												} else {
													console.error("UUID manquant pour l'ami:", friend);
													showToast(t("notifications.error"), "error");
												}
											}}
										>
											<div className={FriendsStyle.avatar}>
												{friendDetails.avatar ? (
													<img
														src={friendDetails.avatar}
														alt={friendDetails.username || "User"}
														className={FriendsStyle.avatarImg}
													/>
												) : (
													<img
														src="/default.JPG"
														alt={friendDetails.username || "User"}
														className={FriendsStyle.avatarImg}
													/>
												)}
											</div>
											<div className={FriendsStyle.infoContainer}>
												<h3 className={FriendsStyle.username}>
													{isLoading
														? t("loading")
														: friendDetails.username || "Unknown User"}
												</h3>
												<div className={FriendsStyle.statusContainer}>
													<span
														className={
															friendDetails.status === "online"
																? FriendsStyle.onlineIndicator
																: FriendsStyle.offlineIndicator
														}
													></span>
													<span className={FriendsStyle.statusText}>
														{friendDetails.status === "online"
															? t("friends.online")
															: t("friends.offline")}
													</span>
												</div>
											</div>
										</div>{" "}
										<div className={FriendsStyle.buttonContainer}>
											<button
												className={`${FriendsStyle.removeButton} ${isProcessing[friendUuid] ? FriendsStyle.disabledButton : ""}`}
												onClick={() => handleRemoveFriend(friendUuid)}
												disabled={isProcessing[friendUuid]}
											>
												{isProcessing[friendUuid]
													? t("loading")
													: t("removeFriend")}
											</button>
										</div>
									</li>
								);
							})}
						</ul>
					)}
				</div>
			) : (
				// Friend requests
				<div className={FriendsStyle.contentContainer}>
					{!friendData ||
					!friendData.requests_received ||
					friendData.requests_received.length === 0 ? (
						renderEmpty(t("friends.noRequests"))
					) : (
						<ul className={FriendsStyle.list}>
							{friendData.requests_received.map((request) => {
								const requesterDetails = requestUsers[request.requester_uuid];
								return (
									<li key={request.id} className={FriendsStyle.listItem}>
										<div
											className={FriendsStyle.profileSection}
											onClick={() => {
												if (request.requester_uuid) {
													console.log(
														"Navigation vers le profil:",
														request.requester_uuid,
													);
													navigate(`/profile/${request.requester_uuid}`);
												} else {
													console.error(
														"UUID manquant pour la demande:",
														request,
													);
													showToast(t("notifications.error"), "error");
												}
											}}
										>
											<div className={FriendsStyle.avatar}>
												{requesterDetails?.avatar ? (
													<img
														src={requesterDetails.avatar}
														alt={requesterDetails.username || "User"}
														className={FriendsStyle.avatarImg}
													/>
												) : (
													<img
														src="/default.JPG"
														alt="User"
														className={FriendsStyle.avatarImg}
													/>
												)}
											</div>
											<div className={FriendsStyle.infoContainer}>
												<h3 className={FriendsStyle.username}>
													{userLoadingState[request.requester_uuid]
														? t("loading")
														: requesterDetails?.username || "Unknown User"}
												</h3>
												<p className={FriendsStyle.requestText}>
													{t("friends.sentYouRequest")}
												</p>
											</div>
										</div>
										<div className={FriendsStyle.buttonContainer}>
											<button
												className={`${FriendsStyle.acceptButton} ${isProcessing[request.requester_uuid] ? FriendsStyle.disabledButton : ""}`}
												onClick={() =>
													handleAcceptRequest(request.requester_uuid)
												}
												disabled={isProcessing[request.requester_uuid]}
											>
												{isProcessing[request.requester_uuid]
													? t("loading")
													: t("acceptRequest")}
											</button>
											<button
												className={`${FriendsStyle.declineButton} ${isProcessing[request.requester_uuid] ? FriendsStyle.disabledButton : ""}`}
												onClick={() =>
													handleDeclineRequest(request.requester_uuid)
												}
												disabled={isProcessing[request.requester_uuid]}
											>
												{isProcessing[request.requester_uuid]
													? t("loading")
													: t("friends.decline")}
											</button>
										</div>
									</li>
								);
							})}
						</ul>
					)}
				</div>
			)}
		</div>
	);
};

export default Friends;
