export default function setupSceneControls() {
	Hooks.on('getSceneControlButtons', (controls) => {
		if (!game.user.isGM) return null;

		const gmTokenVision = game.settings.get(SYSTEM.id, 'gmTokenVision');

		const tokenTools = controls.find((c) => c.name === 'token')?.tools;

		const tokenVisionIcon = (active = game.settings.get(SYSTEM.id, 'gmTokenVision')) =>
			active ? 'fa-solid fa-lightbulb-cfl-on' : 'fa-solid fa-lightbulb-cfl';

		tokenTools?.push({
			name: 'gmSelectTokens',
			title: 'Select Tokens for GM Token Vision',
			icon: 'fa-solid fa-bullseye-pointer',
			button: true,
			onClick: () => {
				if (game.system.tokenVisionConfig.rendered) {
					game.system.tokenVisionConfig.close({ force: true });
				} else {
					game.system.tokenVisionConfig.render(true);
				}
			},
		});

		tokenTools?.push({
			name: 'gmTokenVision',
			title: 'GM Token Vision',
			icon: tokenVisionIcon(),
			toggle: true,
			active: gmTokenVision,
			onClick: () => {
				const newStatus = !game.settings.get(SYSTEM.id, 'gmTokenVision');
				game.settings.set(SYSTEM.id, 'gmTokenVision', newStatus);
				const toggle = ui.controls.control?.tools.find((t) => t.name === 'gmTokenVision');
				if (toggle) {
					toggle.active = newStatus;
					toggle.icon = tokenVisionIcon(newStatus);
					ui.controls.render();
				}
			},
		});
	});
}
