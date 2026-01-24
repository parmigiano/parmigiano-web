import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import ChatPage from './ChatPage';
import React from 'react';

const IChatPage = () => {
    const { t } = useTranslation();

    return (
        <React.Fragment>
            <Helmet>
                <meta name="description" content={t('message.home-meta-description')} />
                <meta property="og:title" content={t('message.home-og-title')} />
                <meta property="og:description" content={t('message.home-og-description')} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://parmigianochat.ru/l/" />
                <link rel="canonical" href="https://parmigianochat.ru/l/" />
            </Helmet>

            {/* page content */}
            <ChatPage />
        </React.Fragment>
    );
};

export default IChatPage;
