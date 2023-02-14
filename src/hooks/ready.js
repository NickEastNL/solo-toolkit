import { MessageBrowser } from '@module/MessageBrowser.js';
import { TokenVisionBrowser } from '@module/TokenVisionBrowser.js';

export const Ready = {
	listen: () => {
		const hookName = 'ready';
		const hook = Hooks.once(hookName, () => {
			game.srpg.messageBrowser = new MessageBrowser();
			game.srpg.tokenVisionBrowser = new TokenVisionBrowser();
			game.srpg.gmTokenVision = game.settings.get('solo-toolkit', 'gmTokenVision');
			game.srpg.gmTokenVisionTokens = game.settings.get('solo-toolkit', 'gmTokenVisionTokens');
		});
		return [hookName, hook];
	},
};
