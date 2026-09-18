import axiosClient from './axios';
import type { AuthLoginRequest } from '@/interface/auth/authLoginRequest.interface';
import type { AuthCreateRequest } from '@/interface/auth/authCreateRequest.interface';
import type { AuthVerifyCodeRequest } from '@/interface/auth/authVerifyCodeRequest.interface';
import { CACHEKEYs } from '@/constants/CacheKeys.constants';

const apiPath = '/auth';

type MessageResponse = {
	message?: string;
};

export type VerifyCodeResult = 'authenticated' | 'password' | 'register';

const saveSession = (session?: string) => {
	if (!session) {
		throw new Error('Session token is missing in server response');
	}

	localStorage.setItem(CACHEKEYs.L_SESSION, session);
};

export const basicAuthRequestCode = async (email: string): Promise<void> => {
	await axiosClient.post(`${apiPath}/confirm/email`, { email });
};

export const basicAuthVerifyCode = async (payload: AuthVerifyCodeRequest): Promise<VerifyCodeResult> => {
	const response = await axiosClient.post<MessageResponse>(`${apiPath}/verify`, payload);

	if (response.status === 200) {
		saveSession(response.data.message);
		return 'authenticated';
	}

	if (response.status === 202) {
		if (response.data.message === 'password-required') return 'password';
		if (response.data.message === 'registration-required') return 'register';
	}

	throw new Error('Unexpected verification response');
};

export const basicAuthLogin = async (payload: AuthLoginRequest): Promise<void> => {
	const response = await axiosClient.post<MessageResponse>(`${apiPath}/login`, payload);
	saveSession(response.data.message);
};

export const basicAuthCreate = async (payload: AuthCreateRequest): Promise<void> => {
	const response = await axiosClient.post<MessageResponse>(`${apiPath}/create`, payload);
	saveSession(response.data.message);
};

export const basicAuthLogout = async (): Promise<void> => {
	try {
		await axiosClient.post(`${apiPath}/logout`);
	} finally {
		localStorage.removeItem(CACHEKEYs.L_SESSION);
	}
};
