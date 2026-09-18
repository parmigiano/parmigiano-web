import axiosClient from './axios';
import type { UserInfo } from '@/interface/user/user.interface';

type UserInfoResponse = {
	message: UserInfo;
};

export const basicUserMe = async (): Promise<UserInfo> => {
	const response = await axiosClient.get<UserInfoResponse>('/users/me');
	return response.data.message;
};

export const basicUserGet = async (userUid: number): Promise<UserInfo> => {
	const response = await axiosClient.get<UserInfoResponse>(`/users/${userUid}`);
	return response.data.message;
};
