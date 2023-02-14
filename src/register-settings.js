export function registerSettings() {
	game.settings.register('solo-toolkit', 'gmTokenVisionTokens', {
		name: 'Stored Tokens for GM Token vision',
		scope: 'client',
		config: false,
		default: [],
		type: Array,
		onChange: (tokenIds) => {
			if (game.ready) game.srpg.gmTokenVisionTokens = tokenIds;
		},
	});

	game.settings.register('solo-toolkit', 'gmTokenVision', {
		name: 'Toggle Token vision for GMs',
		scope: 'client',
		config: false,
		default: false,
		type: Boolean,
		onChange: (newState) => {
			if (game.ready) {
				game.srpg.gmTokenVision = newState;
				game.srpg.tokenVisionBrowser.toggleVision(newState);
			}
		},
	});

	game.settings.register('solo-toolkit', 'msgOutputTemplates', {
		name: 'Output templates',
		scope: 'world',
		default: [],
		type: Array,
	});
}
