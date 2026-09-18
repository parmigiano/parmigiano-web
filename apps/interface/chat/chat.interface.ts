export interface ChatPreview {
	id: number;
	name: string | null;
	username: string | null;
	avatar: string | null;
	user_uid: number;
	last_message: string | null;
	last_message_date: number;
	unread_message_count: number;
}

export interface ChatSetting {
	id: number;
	created_at: number;
	updated_at: number;
	chat_id: number;
	custom_background: string | null;
	blocked: boolean;
	who_blocked_uid: number;
}
