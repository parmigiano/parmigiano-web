import Qs from 'qs';
import i18next from 'i18next';
import { toast } from 'react-toastify';
import axios, { AxiosError } from 'axios';
import { config } from '@/.config/config.client';
import { CACHEKEYs } from '@/constants/CacheKeys.constants';
import { ROUTES } from '@/constants/constants';

const axiosClient = axios.create({
	baseURL: config.api.URL_BACKEND,
	paramsSerializer: (params) => Qs.stringify(params, { arrayFormat: 'comma' }),
});

axiosClient.interceptors.request.use(
	(request) => {
		request.headers['Accept-Language'] = i18next.language || 'en';

		const session = localStorage.getItem(CACHEKEYs.L_SESSION);
		if (session) {
			request.headers.Authorization = `Bearer ${session}`;
		}

		return request;
	},
	(error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (axios.isCancel(error) || error.code === 'ERR_CANCELED') {
			return Promise.reject(error);
		}

		if (error.message === 'Network Error' || error.code === 'ERR_NETWORK' || error.message?.includes('Network request failed')) {
			toast.error(i18next.t('message.internet-error'));
			return Promise.reject(error);
		}

		if (error instanceof AxiosError) {
			if (error.response?.status === 401) {
				localStorage.removeItem(CACHEKEYs.L_SESSION);
				if (window.location.pathname !== ROUTES.AUTH) {
					window.location.replace(ROUTES.AUTH);
				}
			} else if (error.response?.status) {
				const responseData = error.response.data as { error?: string; message?: string } | undefined;
				toast.error(responseData?.error || responseData?.message || i18next.t('message.server-error'));
			} else if (error.request) {
				toast.error(i18next.t('message.request-error'));
			} else {
				toast.error(i18next.t('message.unknown-request-error'));
			}
		} else {
			toast.error(i18next.t('message.try-again-error'));
		}

		return Promise.reject(error);
	}
);

export default axiosClient;
