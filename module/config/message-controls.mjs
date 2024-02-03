export default function setupMessageControls() {
	Hooks.on('renderChatMessage', (message, html) => {
		html.find('header.message-header').prepend(
			`<a class="message-copy" data-tooltip="Message: ${message.id}"><i class="fas fa-passport"></i></a>`
		);

		html.find('.message-copy').on('click', async () => {
			// navigator.clipboard.writeText(message.id);
			// ui.notifications.notify(`Copied id: "${message.id}" to clipboard.`);

			const body = $(html).clone();
			body.find('a, button, .message-metadata').remove();
			const renderedHtml = await renderTemplate(
				'modules/solo-toolkit/templates/message-export.hbs',
				body.html().trim()
			);
			const prettyHtml = renderedHtml.replace(/  |\t|\r\n|\n|\r/gm, '');
			const calloutBlock = `> [!chat]- Foundry Chat Message\n> ${prettyHtml}\n`;

			navigator.clipboard.writeText(calloutBlock);
			ui.notifications.notify(`Copied message HTML to clipboard.`);
		});
	});
}
