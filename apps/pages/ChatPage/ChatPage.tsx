import Menu from "@/components/@icons/menu";

const ChatPage = () => {
	return (
		<main>
			<div className="flex">
				{/* Left bar */}
				<div className="h-screen max-w-[30vw] border-r border-r-[#333]">
					<div className="flex items-center gap-3 p-3">
						<div className="cursor-pointer hover:bg-[#2c2c2c] p-2 rounded-full">
							<Menu fill="#999" />
						</div>
						<input type="text" placeholder="Search" className="!px-5 !py-2 !text-sm !bg-[#2c2c2c] !rounded-full" />
					</div>

					<div className="p-2 px-3 h-full overflow-y-auto custom-scrollbar">
						{Array.from({ length: 20 }).map((item, index) => (
							<div className="flex items-start cursor-pointer gap-3 hover:bg-[#333] p-2 rounded-xl">
								<img src="/logo-user.jpg" width={60} className="rounded-full" />

								<div className="max-w-[30vw] overflow-hidden">
									<p className="font-medium truncate w-full">ФРАМЕ ТАМЕР</p>
									<p className="text-sm truncate w-full">Человеческое отношение в работе - это большая редкость в наше время. Но есть и те, кто стабильно держит высокую планку - уже третий год Альфа-Банк признают лучшим работодателем по версии hh․ru.</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Right chat */}
				<div></div>
			</div>
		</main>
	)
};

export default ChatPage;
