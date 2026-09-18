import { CACHEKEYs } from './constants/CacheKeys.constants';
import { basicUserMe } from './rest/userAPI';

export async function getAuthState() {
	const session = localStorage.getItem(CACHEKEYs.L_SESSION);
	if (!session) return false;

	try {
		await basicUserMe();
		return true;
	} catch {
		return false;
	}
}
