import Qs from 'qs';
import i18next from 'i18next';
import { toast } from 'react-toastify';
import axios, { AxiosError } from 'axios';
import { config } from '@/.config/config.client';
import { CACHEKEYs } from '@/constants/CacheKeys.constants';

// axios base url
const axiosClient = axios.create({
	baseURL: config.type.release == 'dev' ? config.links.URL_BACKEND_DEV : config.links.URL_BACKEND_PROD,
	paramsSerializer: (params) => Qs.stringify(params, { arrayFormat: 'comma' }),
});

// axios helper for request
axiosClient.interceptors.request.use(
	(config) => {
		const currentLanguage = i18next.language || 'en';
		config.headers['Accept-Language'] = currentLanguage;

		return config;
	},
	(error) => Promise.reject(error)
);

// axios helper for response
axiosClient.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		if (axios.isCancel(error) || error.code === 'ERR_CANCELED') {
			return Promise.reject(error);
		}

		// internet
		if (error.message === 'Network Error' || error.code === 'ERR_NETWORK' || error.message.includes('Network request failed')) {
			toast.error(i18next.t('message.internet-error'));
			return Promise.reject(error);
		}

		if (error instanceof AxiosError) {
			if (error.response && error.response.status) {
				if (error.response.status === 401) {
					try {
						localStorage.removeItem(CACHEKEYs.L_SESSION);
					} catch (e) {
						console.error(e);
					}
				} else {
					toast.error(error.response.data?.error || i18next.t('message.server-error'));
				}
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
