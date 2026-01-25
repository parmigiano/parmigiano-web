import axiosClient from './axios';
import type { AuthLoginRequest } from '@/interface/auth/authLoginRequest.interface';
import type { AuthCreateRequest } from '@/interface/auth/authCreateRequest.interface';
import type { AuthVerifyCodeRequest } from '@/interface/auth/authVerifyCodeRequest.interface';
import { CACHEKEYs } from '@/constants/CacheKeys.constants';

const apiPath = '/auth';

export const basicAuthLogin = async (payload: AuthLoginRequest): Promise<'success' | 'password' | 'register'> => {
	const response = await axiosClient.post(`${apiPath}/login`, payload, {
		validateStatus: (status: number) => status === 200 || status === 202 || status === 404,
	});

	if (response.status === 200) {
		return 'success';
	}

	if (response.status === 202) {
		return 'password';
	}

	if (response.status === 404) {
		return 'register';
	}

	throw new Error('Unhandled login status');
};

export const basicAuthCreate = async (payload: AuthCreateRequest): Promise<'success'> => {
	await axiosClient.post(`${apiPath}/create`, payload);
	return 'success';
};

export const basicAuthVerifyCode = async (payload: AuthVerifyCodeRequest): Promise<'success'> => {
	const response = await axiosClient.post(`${apiPath}/verify`, payload);

	localStorage.setItem(CACHEKEYs.L_SESSION, response.data.message);
	return 'success';
};
