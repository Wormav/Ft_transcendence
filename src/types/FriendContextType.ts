export type FriendRequest = {
	id: number;
	requester_uuid: string;
	target_uuid: string;
	status: "pending" | "accepted" | "rejected";
	created_at: number;
};

export type FriendData = {
	friends: FriendRequest[];
	requests_sent: FriendRequest[];
	requests_received: FriendRequest[];
};

export type FriendContextType = {
	friendData: FriendData | null;
	loading: boolean;
	error: string | null;
	fetchFriendData: () => Promise<void>;
	addFriend: (uuid: string) => Promise<boolean>;
	acceptFriendRequest: (uuid: string) => Promise<boolean>;
	declineFriendRequest: (uuid: string) => Promise<boolean>;
	removeFriend: (uuid: string) => Promise<boolean>;
};
