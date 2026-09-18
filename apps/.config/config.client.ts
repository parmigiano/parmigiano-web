const envApiUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const config = {
	api: {
		URL_BACKEND: envApiUrl || '/api/v2',
	},
};
