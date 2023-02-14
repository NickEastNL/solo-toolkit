export const RenderChatLog = {
	listen: () => {
		const hookName = 'renderChatLog';
		const hook = Hooks.on(hookName, async () => {
			if (game.ready) game.srpg.messageBrowser.injectBrowserButton();
		});
		return [hookName, hook];
	},
};
