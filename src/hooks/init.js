import { registerKeybindings } from '../register-keybindings.js';
import { registerSettings } from '../register-settings.js';

export const Init = {
	listen: () => {
		const hookName = 'init';
		const hook = Hooks.once(hookName, () => {
			console.debug(`Solo RPG Tools | Running build mode: ${__BUILD_MODE__}`);

			registerSettings();
			registerKeybindings();

			game.srpg = {
				gmTokenVision: false,
				gmTokenVisionTokens: [],
				msgDefaultTemplate: '{{content}}',
			};
		});
		return [hookName, hook];
	},
};
