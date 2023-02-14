export const RenderChatMessage = {
	listen: () => {
		const hookName = 'renderChatMessage';
		const hook = Hooks.on(hookName, (message, html) => {
			html.find('header.message-header').prepend(
				`<a class="message-copy" data-tooltip="Message: ${message.id}"><i class="fas fa-passport"></i></a>`
			);

			html.find('.message-copy').on('click', () => {
				navigator.clipboard.writeText(message.id);
				ui.notifications.notify(`Copied id: "${message.id}" to clipboard.`);
			});
		});
		return [hookName, hook];
	},
};
