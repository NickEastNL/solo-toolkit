import { GetSceneControlButtons } from './getSceneControlButtons.js';
import { Init } from './init.js';
import { Ready } from './ready.js';
import { RenderChatLog } from './renderChatLog.js';
import { RenderChatMessage } from './renderChatMessage.js';

export const HooksSRPG = {
	hooks: [],

	listen() {
		const listeners = [Init, Ready, GetSceneControlButtons, RenderChatLog, RenderChatMessage];

		for (const Listener of listeners) {
			const hook = Listener.listen();
			this.hooks.push(hook);
		}
	},

	off() {
		for (const [hookName, hook] of this.hooks) {
			Hooks.off(hookName, hook);
		}
	},
};
