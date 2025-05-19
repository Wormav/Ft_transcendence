export type FriendProfile = {
	uuid: string;
	email: string;
	username: string;
	avatar: string;
	color_items?: string;
	color_bg?: string;
	size_text?: string;
	speed_moves?: string;
	last_seen?: number;
	status?: "online" | "offline";
};
