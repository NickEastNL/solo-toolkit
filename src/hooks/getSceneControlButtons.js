export const GetSceneControlButtons = {
	listen: () => {
		const hookName = 'getSceneControlButtons';
		const hook = Hooks.on(hookName, (controls) => {
			if (!game.user.isGM) return null;

			const tokenTools = controls.find((c) => c.name === 'token')?.tools;

			const tokenVisionIcon = (active = game.settings.get('solo-toolkit', 'gmTokenVision')) =>
				active ? 'fa-solid fa-lightbulb-cfl-on' : 'fa-solid fa-lightbulb-cfl';

			tokenTools?.push({
				name: 'gmSelectTokens',
				title: 'Select Tokens for GM Token Vision',
				icon: 'fa-solid fa-bullseye-pointer',
				button: true,
				onClick: () => {
					if (game.srpg.tokenVisionBrowser.rendered) {
						game.srpg.tokenVisionBrowser.close({ force: true });
					} else {
						game.srpg.tokenVisionBrowser.render(true);
					}
				},
			});

			tokenTools?.push({
				name: 'gmTokenVision',
				title: 'GM Token Vision',
				icon: tokenVisionIcon(),
				toggle: true,
				active: game.srpg.gmTokenVision,
				onClick: () => {
					const newStatus = !game.srpg.gmTokenVision;
					game.settings.set('solo-toolkit', 'gmTokenVision', newStatus);
					const toggle = ui.controls.control?.tools.find((t) => t.name === 'gmTokenVision');
					if (toggle) {
						toggle.active = newStatus;
						toggle.icon = tokenVisionIcon(newStatus);
						ui.controls.render();
					}
				},
			});
		});
		return [hookName, hook];
	},
};
