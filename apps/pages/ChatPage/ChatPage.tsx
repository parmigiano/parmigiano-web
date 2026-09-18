import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Menu from '@/components/@icons/menu';
import { ROUTES } from '@/constants/constants';
import { basicAuthLogout } from '@/rest/authAPI';
import { basicChatAi, basicChatSettings, basicChatsGet, basicChatsSearch } from '@/rest/chatAPI';
import { basicUserMe } from '@/rest/userAPI';
import type { ChatPreview } from '@/interface/chat/chat.interface';

type SelectedChat = { kind: 'ai' } | { kind: 'chat'; chat: ChatPreview };

type AiMessage = {
	id: number;
	role: 'user' | 'assistant';
	text: string;
};

const Avatar = ({ src, name, size = 52 }: { src?: string | null; name?: string | null; size?: number }) => {
	const [imageFailed, setImageFailed] = useState(false);
	const initials = (name || '?')
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join('');

	return (
		<div className="relative shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#2aabee] to-[#667eea]" style={{ width: size, height: size }}>
			<div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white">{initials || '?'}</div>
			{src && !imageFailed && <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" onError={() => setImageFailed(true)} />}
		</div>
	);
};

const formatTime = (timestamp: number) => {
	if (!timestamp) return '';
	const date = new Date(timestamp * 1000);
	if (Number.isNaN(date.getTime())) return '';

	const now = new Date();
	if (date.toDateString() === now.toDateString()) {
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
};

const ChatPage = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [menuOpen, setMenuOpen] = useState(false);
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [selected, setSelected] = useState<SelectedChat | null>(null);
	const [draft, setDraft] = useState('');
	const [aiMessages, setAiMessages] = useState<AiMessage[]>([
		{ id: 1, role: 'assistant', text: t('message.ai-greeting') },
	]);
	const [aiSending, setAiSending] = useState(false);

	useEffect(() => {
		const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
		return () => window.clearTimeout(timer);
	}, [search]);

	const meQuery = useQuery({ queryKey: ['user', 'me'], queryFn: basicUserMe, retry: false });
	const chatsQuery = useQuery({ queryKey: ['chats', 'history'], queryFn: () => basicChatsGet(0), retry: 1 });
	const searchQuery = useQuery({
		queryKey: ['chats', 'search', debouncedSearch],
		queryFn: () => basicChatsSearch(debouncedSearch),
		enabled: debouncedSearch.length >= 2,
		retry: 1,
	});

	const selectedChatId = selected?.kind === 'chat' ? selected.chat.id : null;
	const settingsQuery = useQuery({
		queryKey: ['chat', 'settings', selectedChatId],
		queryFn: () => basicChatSettings(selectedChatId as number),
		enabled: selectedChatId !== null,
		retry: 1,
	});

	const chatItems = useMemo(() => {
		if (debouncedSearch.length >= 2) return searchQuery.data ?? [];
		return chatsQuery.data ?? [];
	}, [chatsQuery.data, debouncedSearch.length, searchQuery.data]);

	const logout = async () => {
		await basicAuthLogout();
		navigate(ROUTES.AUTH, { replace: true });
	};

	const sendAiMessage = async () => {
		const text = draft.trim();
		if (!text || aiSending) return;

		const userMessage: AiMessage = { id: Date.now(), role: 'user', text };
		setAiMessages((current) => [...current, userMessage]);
		setDraft('');
		setAiSending(true);

		try {
			const answer = await basicChatAi(text);
			setAiMessages((current) => [...current, { id: Date.now() + 1, role: 'assistant', text: answer }]);
		} finally {
			setAiSending(false);
		}
	};

	const currentChat = selected?.kind === 'chat' ? selected.chat : null;
	const backgroundStyle = settingsQuery.data?.custom_background
		? { backgroundImage: `linear-gradient(rgba(14, 22, 33, 0.72), rgba(14, 22, 33, 0.72)), url(${settingsQuery.data.custom_background})` }
		: undefined;

	return (
		<main className="h-[100dvh] overflow-hidden bg-[#0e1621] text-[#f5f5f5]">
			<div className="flex h-full">
				<aside className={`${selected ? 'hidden md:flex' : 'flex'} relative w-full shrink-0 flex-col border-r border-[#0b141d] bg-[#17212b] md:w-[360px] lg:w-[420px]`}>
					<div className="flex items-center gap-2 border-b border-[#202b36] px-3 py-2.5">
						<button type="button" aria-label="Menu" onClick={() => setMenuOpen((value) => !value)} className="rounded-full p-2.5 transition hover:bg-[#202b36]">
							<Menu fill="#9ba8b4" />
						</button>
						<div className="flex-1 rounded-full bg-[#242f3d] px-4 py-2.5 focus-within:ring-1 focus-within:ring-[#2aabee]">
							<input
								value={search}
								onChange={(event) => setSearch(event.target.value)}
								placeholder={t('label.search')}
								className="w-full border-0 bg-transparent p-0 text-sm text-white outline-none placeholder:text-[#7f91a4]"
							/>
						</div>
					</div>

					{menuOpen && (
						<div className="absolute left-3 top-14 z-30 w-[270px] overflow-hidden rounded-2xl border border-[#2a3745] bg-[#1f2c38] shadow-2xl">
							<div className="border-b border-[#2a3745] p-4">
								<div className="flex items-center gap-3">
									<Avatar src={meQuery.data?.avatar} name={meQuery.data?.name || meQuery.data?.username} size={48} />
									<div className="min-w-0">
										<p className="truncate font-semibold">{meQuery.data?.name || meQuery.data?.username || t('label.profile')}</p>
										<p className="truncate text-xs text-[#8b9bad]">{meQuery.data?.username ? `@${meQuery.data.username}` : meQuery.data?.email}</p>
									</div>
								</div>
							</div>
							<button type="button" onClick={logout} className="w-full px-4 py-3 text-left text-sm transition hover:bg-[#2a3745]">
								{t('label.logout')}
							</button>
						</div>
					)}

					<div className="chat-scrollbar flex-1 overflow-y-auto p-2">
						<button
							type="button"
							onClick={() => setSelected({ kind: 'ai' })}
							className={`mb-1 flex w-full items-center gap-3 rounded-xl p-2 text-left transition ${selected?.kind === 'ai' ? 'bg-[#2b5278]' : 'hover:bg-[#202b36]'}`}
						>
							<div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2aabee] to-[#6d5dfc] text-xl">✦</div>
							<div className="min-w-0 flex-1">
								<div className="flex items-center justify-between gap-2">
									<p className="truncate font-semibold">Parmigiano AI</p>
									<span className="text-[11px] text-[#7f91a4]">HTTP</span>
								</div>
								<p className="truncate text-sm text-[#8b9bad]">{t('message.ai-chat-description')}</p>
							</div>
						</button>

						{(chatsQuery.isLoading || searchQuery.isFetching) && <p className="px-3 py-5 text-center text-sm text-[#8b9bad]">{t('message.loading-chats')}</p>}
						{!chatsQuery.isLoading && !searchQuery.isFetching && chatItems.length === 0 && (
							<p className="px-6 py-8 text-center text-sm leading-6 text-[#8b9bad]">{debouncedSearch.length >= 2 ? t('message.no-search-results') : t('message.no-chats')}</p>
						)}

						{chatItems.map((chat) => {
							const active = selected?.kind === 'chat' && selected.chat.id === chat.id;
							return (
								<button
									key={`${chat.id}-${chat.user_uid}`}
									type="button"
									onClick={() => setSelected({ kind: 'chat', chat })}
									className={`mb-1 flex w-full items-center gap-3 rounded-xl p-2 text-left transition ${active ? 'bg-[#2b5278]' : 'hover:bg-[#202b36]'}`}
								>
									<Avatar src={chat.avatar} name={chat.name || chat.username} size={54} />
									<div className="min-w-0 flex-1">
										<div className="flex items-center justify-between gap-2">
											<p className="truncate font-semibold">{chat.name || chat.username || t('label.unknown-user')}</p>
											<span className={`shrink-0 text-[11px] ${active ? 'text-[#c8d9e8]' : 'text-[#7f91a4]'}`}>{formatTime(chat.last_message_date)}</span>
										</div>
										<div className="flex items-center gap-2">
											<p className={`min-w-0 flex-1 truncate text-sm ${active ? 'text-[#d4e2ed]' : 'text-[#8b9bad]'}`}>{chat.last_message || `@${chat.username || ''}`}</p>
											{chat.unread_message_count > 0 && <span className="min-w-5 rounded-full bg-[#2aabee] px-1.5 py-0.5 text-center text-[11px] font-semibold text-white">{chat.unread_message_count}</span>}
										</div>
									</div>
								</button>
							);
						})}
					</div>
				</aside>

				<section className={`${selected ? 'flex' : 'hidden md:flex'} min-w-0 flex-1 flex-col bg-[#0e1621]`}>
					{selected ? (
						<>
							<header className="flex h-[64px] shrink-0 items-center gap-3 border-b border-[#0b141d] bg-[#17212b] px-3 md:px-5">
								<button type="button" onClick={() => setSelected(null)} className="rounded-full p-2 text-xl text-[#9ba8b4] hover:bg-[#202b36] md:hidden" aria-label="Back">
									←
								</button>
								{selected.kind === 'ai' ? (
									<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2aabee] to-[#6d5dfc]">✦</div>
								) : (
									<Avatar src={currentChat?.avatar} name={currentChat?.name || currentChat?.username} size={40} />
								)}
								<div className="min-w-0 flex-1">
									<p className="truncate font-semibold">{selected.kind === 'ai' ? 'Parmigiano AI' : currentChat?.name || currentChat?.username}</p>
									<p className="truncate text-xs text-[#8b9bad]">{selected.kind === 'ai' ? t('message.ai-chat-description') : currentChat?.username ? `@${currentChat.username}` : t('message.backend-connected')}</p>
								</div>
							</header>

							<div className="telegram-wallpaper chat-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto bg-cover bg-center p-3 sm:p-5" style={backgroundStyle}>
								{selected.kind === 'ai' ? (
									<div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-end gap-2 py-4">
										{aiMessages.map((message) => (
											<div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
												<div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-5 shadow-sm ${message.role === 'user' ? 'rounded-br-md bg-[#2b5278]' : 'rounded-bl-md bg-[#182533]'}`}>
													{message.text}
												</div>
											</div>
										))}
										{aiSending && <div className="w-fit rounded-2xl rounded-bl-md bg-[#182533] px-4 py-2.5 text-sm text-[#8b9bad]">{t('message.ai-thinking')}</div>}
									</div>
								) : (
									<div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center py-8">
										<div className="mx-auto max-w-md rounded-2xl bg-[#17212be8] p-5 text-center shadow-xl backdrop-blur">
											<p className="font-semibold">{t('message.messages-unavailable-title')}</p>
											<p className="mt-2 text-sm leading-6 text-[#8b9bad]">{t('message.messages-unavailable-desc')}</p>
											{currentChat?.last_message && (
												<div className="mt-4 rounded-xl bg-[#0f1d2a] p-3 text-left">
													<p className="text-[11px] font-medium uppercase tracking-wide text-[#5aa7e8]">{t('label.last-message')}</p>
													<p className="mt-1 text-sm leading-5">{currentChat.last_message}</p>
												</div>
											)}
										</div>
									</div>
								)}
							</div>

							<footer className="shrink-0 border-t border-[#0b141d] bg-[#17212b] p-2.5 sm:p-3">
								<div className="mx-auto flex max-w-3xl items-end gap-2">
									<textarea
										value={draft}
										onChange={(event) => setDraft(event.target.value)}
										onKeyDown={(event) => {
											if (event.key === 'Enter' && !event.shiftKey && selected.kind === 'ai') {
												event.preventDefault();
												void sendAiMessage();
											}
										}}
										disabled={selected.kind !== 'ai'}
										rows={1}
										placeholder={selected.kind === 'ai' ? t('label.write-message') : t('label.messages-disabled')}
										className="max-h-32 min-h-11 flex-1 resize-none rounded-2xl border-0 bg-[#242f3d] px-4 py-3 text-sm leading-5 text-white outline-none placeholder:text-[#7f91a4] disabled:cursor-not-allowed disabled:opacity-60"
									/>
									<button
										type="button"
										disabled={selected.kind !== 'ai' || !draft.trim() || aiSending}
										onClick={() => void sendAiMessage()}
										className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2aabee] text-lg text-white transition hover:bg-[#229ed9] disabled:cursor-not-allowed disabled:opacity-40"
										aria-label={t('label.send')}
									>
										➤
									</button>
								</div>
							</footer>
						</>
					) : (
						<div className="telegram-wallpaper flex h-full items-center justify-center p-6">
							<div className="max-w-sm rounded-full bg-[#17212bd9] px-5 py-3 text-center text-sm text-[#a7b4c1] shadow-lg backdrop-blur">{t('message.select-chat')}</div>
						</div>
					)}
				</section>
			</div>
		</main>
	);
};

export default ChatPage;
