import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import ChatPage from './ChatPage';
import React from 'react';

const IChatPage = () => {
	const { t } = useTranslation();

	return (
		<React.Fragment>
			<Helmet>
				<meta name="description" content={t('message.online-meta-description')} />
				<meta property="og:title" content={t('message.online-og-title')} />
				<meta property="og:description" content={t('message.online-og-description')} />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://parmigianochat.ru/online/" />
				<link rel="canonical" href="https://parmigianochat.ru/online/" />
			</Helmet>

			{/* page content */}
			<ChatPage />
		</React.Fragment>
	);
};

export default IChatPage;
