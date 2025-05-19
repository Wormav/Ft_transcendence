import type { FriendProfile } from "./FriendProfile";

export type FriendRequest = {
	id: number;
	requester_uuid: string;
	target_uuid: string;
	status: "pending" | "accepted" | "rejected";
	created_at: number;
};

export type FriendData = {
	friends: FriendProfile[];
	requests_sent: FriendRequest[];
	requests_received: FriendRequest[];
};

export type FriendContextType = {
	friendData: FriendData | null;
	loading: boolean;
	error: string | null;
	fetchFriendData: () => Promise<void>;
	addFriend: (uuid: string) => Promise<boolean>;
};
