export const ROUTES = {
	CHAT: '/online',
	NOT_FOUND: '*',
	AUTH: '/l',
};

type Params = Record<string, string | number>;

export const buildRoute = (route: string, params: Params): string => {
	let result = route;

	Object.entries(params).forEach(([key, value]) => {
		result = result.replace(`:${key}`, encodeURIComponent(String(value)));
	});

	return result;
};
