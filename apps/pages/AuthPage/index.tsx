import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import LPage from './AuthPage';
import React from 'react';

const IAuthPage = () => {
	const { t } = useTranslation();

	return (
		<React.Fragment>
			<Helmet>
				<meta name="description" content={t('message.auth-meta-description')} />
				<meta property="og:title" content={t('message.auth-og-title')} />
				<meta property="og:description" content={t('message.auth-og-description')} />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://parmigianochat.ru/l/" />
				<link rel="canonical" href="https://parmigianochat.ru/l/" />
			</Helmet>

			{/* page content */}
			<LPage />
		</React.Fragment>
	);
};

export default IAuthPage;
