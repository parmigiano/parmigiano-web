import { lazy } from 'react';
import type { JSX, LazyExoticComponent } from 'react';
import { ROUTES } from '@/constants/constants';

/* Auth */
const Login = lazy(() => import('@/pages/LPage/index'));

const Chat = lazy(() => import('@/pages/ChatPage/index'));

export interface CustomRouteConfig {
	path: string;
	title?: string;
	loginRequired?: boolean;
	redirectIfLogged?: boolean;
	component: LazyExoticComponent<() => JSX.Element>;
}

const config: CustomRouteConfig[] = [
	/* Login */
	{
		path: ROUTES.LOGIN,
		loginRequired: false,
		redirectIfLogged: true,
		component: Login,
		title: 'label.web-title',
	},
	/* Chat */
	{
		path: ROUTES.CHAT,
		loginRequired: true,
		component: Chat,
	},
];

export default config;
