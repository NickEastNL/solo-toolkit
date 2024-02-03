import { SYSTEM } from './module/config/system.mjs';
globalThis.SYSTEM = SYSTEM;

import * as apps from './module/apps/_module.mjs';
import * as config from './module/config/_module.mjs';

import patchToken from './module/patch-token.mjs';
import registerKeybindings from './module/register-keybindings.mjs';
import registerSettings from './module/register-settings.mjs';

patchToken();

Hooks.once('init', () => {
	console.log('Solo RPG Toolkit | Initializing module');

	registerSettings();
	registerKeybindings();

	config.setupSceneControls();
	config.setupMessageControls();
});

Hooks.once('setup', () => {
	game.system.tokenVisionConfig = new apps.TokenVisionConfig();
});
