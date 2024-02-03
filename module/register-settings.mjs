export default function registerSettings() {
	game.settings.register(SYSTEM.id, 'gmTokenVisionTokens', {
		name: 'Stored Tokens for GM Token vision',
		scope: 'client',
		config: false,
		default: [],
		type: Array,
	});

	game.settings.register(SYSTEM.id, 'gmTokenVision', {
		name: 'Toggle Token vision for GMs',
		scope: 'client',
		config: false,
		default: false,
		type: Boolean,
		onChange: (newState) => {
			if (game.ready) {
				game.system.tokenVisionConfig.toggleVision(newState);
			}
		},
	});
}
