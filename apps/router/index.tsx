import { useEffect, useState } from 'react';
import { getAuthState } from '@/private-route';
import config from './config';
import type { CustomRouteConfig } from './config';
import { ROUTES } from '@/constants/constants';
import { useTranslation } from 'react-i18next';
import Fallback from '@/components/Fallback';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

const CustomRoute: React.FC<CustomRouteConfig> = ({ loginRequired = true, redirectIfLogged = true, component: Component, title }) => {
	const { t } = useTranslation();
	const location = useLocation();
	const [isLoading, setIsLoading] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		document.title = title ? `${t(title)} - ParmigianoChat` : 'ParmigianoChat Web';
	}, [title, t]);

	useEffect(() => {
		let active = true;
		void getAuthState().then((logged) => {
			if (!active) return;
			setIsLoggedIn(logged);
			setIsLoading(false);
		});

		return () => {
			active = false;
		};
	}, []);

	if (isLoading) return <Fallback />;

	if (loginRequired) {
		return isLoggedIn ? <Component /> : <Navigate to={ROUTES.AUTH} state={{ from: location }} replace />;
	}

	return isLoggedIn && redirectIfLogged ? <Navigate to={ROUTES.CHAT} replace /> : <Component />;
};

const AppRouter: React.FC = () => {
	return (
		<Routes>
			<Route path="/" element={<Navigate to={ROUTES.CHAT} replace />} />
			{config.map((route) => (
				<Route key={route.path} path={route.path} element={<CustomRoute {...route} />} />
			))}
			<Route path="*" element={<Navigate to={ROUTES.CHAT} replace />} />
		</Routes>
	);
};

export default AppRouter;
