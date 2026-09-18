export interface UserInfo {
	id: number;
	created_at: number;
	user_uid: number;
	avatar: string | null;
	name: string | null;
	username: string | null;
	username_visible: boolean;
	email: string | null;
	email_visible: boolean;
	email_confirm: boolean;
	phone: string | null;
	phone_visible: boolean;
	overview: string | null;
}
