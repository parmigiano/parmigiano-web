import axiosClient from './axios';
import type { ChatPreview, ChatSetting } from '@/interface/chat/chat.interface';

type ApiResponse<T> = {
	message: T;
};

export const basicChatsGet = async (offset = 0): Promise<ChatPreview[]> => {
	const response = await axiosClient.get<ApiResponse<ChatPreview[]>>('/chats', { params: { offset } });
	return Array.isArray(response.data.message) ? response.data.message : [];
};

export const basicChatsSearch = async (username: string): Promise<ChatPreview[]> => {
	const response = await axiosClient.get<ApiResponse<ChatPreview[]>>(`/chats/u/${encodeURIComponent(username)}`);
	return Array.isArray(response.data.message) ? response.data.message : [];
};

export const basicChatSettings = async (chatId: number): Promise<ChatSetting> => {
	const response = await axiosClient.get<ApiResponse<ChatSetting>>(`/chats/${chatId}`);
	return response.data.message;
};

export const basicChatTranslate = async (chatId: number, text: string): Promise<string> => {
	const response = await axiosClient.post<ApiResponse<string>>(`/chats/${chatId}/translate`, { text });
	return response.data.message;
};

export const basicChatAi = async (message: string): Promise<string> => {
	const response = await axiosClient.post<ApiResponse<string>>('/chats/bot/ai', { message });
	return response.data.message;
};
