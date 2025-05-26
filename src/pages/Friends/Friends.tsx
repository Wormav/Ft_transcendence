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
import { getSizeTextStyle } from "../../globalStyle";
import { useSettings } from "../../context/SettingsContext";

const isUserOnline = (lastSeen?: number): boolean => {
	if (!lastSeen) return false;

	const currentTime = Date.now();
	const fiveMinutesInMs = 5 * 60 * 1000;

	return currentTime - lastSeen < fiveMinutesInMs;
};

const Friends = () => {
	const { t } = useTranslation();
	const { size_text } = useSettings();
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

		const statusInterval = setInterval(() => {
			setRequestUsers((prevUsers) => {
				const updatedUsers = { ...prevUsers };

				Object.keys(updatedUsers).forEach((uuid) => {
					const user = updatedUsers[uuid];
					if (user) {
						updatedUsers[uuid] = {
							...user,
							status: isUserOnline(user.last_seen) ? "online" : "offline",
						};
					}
				});

				return updatedUsers;
			});
		}, 60000);

		return () => clearInterval(statusInterval);
	}, []);
	useEffect(() => {
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

		if (friendData && friendData.friends && user?.uuid) {
			friendData.friends.forEach((friend) => {
				const friendUuid =
					friend.requester_uuid === user.uuid
						? friend.target_uuid
						: friend.requester_uuid;

				if (!friendUuid) {
					console.error("Invalid friendship relation detected:", friend);
					return;
				}
				fetchUserDetails(friendUuid);
			});
		}
	}, [friendData, user?.uuid]);
	const fetchUserDetails = async (uuid: string) => {
		if (userLoadingState[uuid]) {
			return;
		}

		setUserLoadingState((prev) => ({ ...prev, [uuid]: true }));

		try {
			const token = getJwtToken();
			if (!token) {
				console.error("No authentication token found");
				showToast(t("notifications.authError"), "error");
				return;
			}

			const response = await customFetch(
				`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/user/${uuid}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				},
			);

			if (!response.ok) {
				throw new Error(`Error retrieving user details: ${response.status}`);
			}

			const userData: FriendProfile = await response.json();

			if (!userData || !userData.username) {
				console.warn(`Données invalides pour l'utilisateur ${uuid}:`, userData);
			}

			const userWithStatus: FriendProfile = {
				...userData,
				status: isUserOnline(userData.last_seen) ? "online" : "offline",
			};

			setRequestUsers((prev) => ({ ...prev, [uuid]: userWithStatus }));
		} catch (error) {
			console.error(`Error retrieving user details for ${uuid}:`, error);
			showToast(t("notifications.userDataError"), "error");
		} finally {
			setUserLoadingState((prev) => ({ ...prev, [uuid]: false }));
		}
	};

	const handleRemoveFriend = async (friend: {
		requester_uuid: string;
		target_uuid: string;
		id: number;
	}) => {
		if (!user?.uuid) return;
		const friendUuid =
			friend.requester_uuid === user.uuid
				? friend.target_uuid
				: friend.requester_uuid;
		if (isProcessing[friendUuid]) return;

		setIsProcessing((prev) => ({ ...prev, [friendUuid]: true }));
		try {
			const success = await removeFriend(friendUuid);
			if (success) {
				showToast(t("notifications.friendRemoved"), "success");
			} else {
				console.error("Failed to remove friend:", friendUuid);
				showToast(t("notifications.error"), "error");
			}
		} catch (error) {
			console.error("Error removing friend:", error);
			showToast(t("notifications.error"), "error");
		} finally {
			setIsProcessing((prev) => ({ ...prev, [friendUuid]: false }));
		}
	};

	const handleAcceptRequest = async (uuid: string) => {
		if (isProcessing[uuid]) return;

		setIsProcessing((prev) => ({ ...prev, [uuid]: true }));
		try {
			const success = await acceptFriendRequest(uuid);
			if (success) {
				showToast(t("notifications.friendRequestAccepted"), "success");
			} else {
				console.error("Failed to accept friend request:", uuid);
				showToast(t("notifications.error"), "error");
			}
		} catch (error) {
			console.error("Error accepting friend request:", error);
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
				showToast(t("notifications.friendRequestDeclined"), "success");
			} else {
				console.error("Failed to decline friend request:", uuid);
				showToast(t("notifications.error"), "error");
			}
		} catch (error) {
			console.error("Error declining friend request:", error);
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
			<h1 className={`${FriendsStyle.title} ${getSizeTextStyle(size_text)}`}>
				{t("friends.title")}
			</h1>

			{/* Tabs */}
			<div className={FriendsStyle.tabContainer}>
				<button
					className={`${FriendsStyle.tabButton} ${
						activeTab === "friends"
							? FriendsStyle.tabActive
							: FriendsStyle.tabInactive
					}  ${getSizeTextStyle(size_text)}`}
					onClick={() => setActiveTab("friends")}
				>
					{t("friends.myFriends")}
					{friendData &&
						friendData.friends &&
						friendData.friends.length > 0 && (
							<span
								className={`${FriendsStyle.tabCounter} ${getSizeTextStyle(size_text)}`}
							>
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
				<div
					className={`${FriendsStyle.contentContainer} ${getSizeTextStyle(size_text)}`}
				>
					{!friendData ||
					!friendData.friends ||
					friendData.friends.length === 0 ? (
						renderEmpty(t("friends.noFriends"))
					) : (
						<ul
							className={`${FriendsStyle.list}  ${getSizeTextStyle(size_text)}`}
						>
							{friendData.friends.map((friend) => {
								const friendUuid =
									friend.requester_uuid === user?.uuid
										? friend.target_uuid
										: friend.requester_uuid;
								const friendDetails = requestUsers[friendUuid] || {
									uuid: friendUuid,
									username: "Loading...",
									email: "",
									avatar: "",
								};
								const isLoading = userLoadingState[friendUuid] || false;
								return (
									<li
										key={friend.id}
										className={`${FriendsStyle.listItem}  ${getSizeTextStyle(size_text)}`}
									>
										<div
											className={FriendsStyle.profileSection}
											onClick={() => {
												if (friendUuid) {
													navigate(`/profile/${friendUuid}`);
												} else {
													console.error("Missing UUID for friend:", friend);
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
														src="/default.png"
														alt={friendDetails.username || "User"}
														className={FriendsStyle.avatarImg}
													/>
												)}
											</div>
											<div className={FriendsStyle.infoContainer}>
												<h3
													className={`${FriendsStyle.username}  ${getSizeTextStyle(size_text)}`}
												>
													{isLoading
														? t("loading")
														: friendDetails.username || "Unknown User"}
												</h3>
												<div className={FriendsStyle.statusContainer}>
													<span
														className={
															isUserOnline(friendDetails.last_seen)
																? FriendsStyle.onlineIndicator
																: FriendsStyle.offlineIndicator
														}
													></span>
													<span className={FriendsStyle.statusText}>
														{isUserOnline(friendDetails.last_seen)
															? t("friends.online")
															: t("friends.offline")}
													</span>
												</div>
											</div>
										</div>
										<div className={FriendsStyle.buttonContainer}>
											<button
												className={`${FriendsStyle.removeButton} ${isProcessing[friendUuid] ? FriendsStyle.disabledButton : ""}`}
												onClick={() => handleRemoveFriend(friend)}
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
				<div
					className={`${FriendsStyle.contentContainer}  ${getSizeTextStyle(size_text)}`}
				>
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
													navigate(`/profile/${request.requester_uuid}`);
												} else {
													console.error("Missing UUID for request:", request);
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
														src="/default.png"
														alt="User"
														className={FriendsStyle.avatarImg}
													/>
												)}
											</div>
											<div className={FriendsStyle.infoContainer}>
												<h3
													className={`${FriendsStyle.username}  ${getSizeTextStyle(size_text)}`}
												>
													{userLoadingState[request.requester_uuid]
														? t("loading")
														: requesterDetails?.username || "Unknown User"}
												</h3>
												<p
													className={`${FriendsStyle.requestText}  ${getSizeTextStyle(size_text)}`}
												>
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
												className={`${FriendsStyle.declineButton} ${isProcessing[request.requester_uuid] ? FriendsStyle.disabledButton : ""}  ${getSizeTextStyle(size_text)}`}
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
