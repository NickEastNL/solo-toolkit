export default function registerKeybindings() {
	game.keybindings.register('solo-toolkit', 'gmTokenVision', {
		name: 'Toggle Token vision for GMs',
		editable: [{ key: 'KeyG', modifiers: ['Control'] }],
		restricted: true,
		onDown: (context) => {
			context.event.preventDefault();
			return true;
		},
		onUp: () => {
			if (ui.controls.control?.name === 'token') {
				const toggle = ui.controls.control.tools.find((t) => t.name === 'gmTokenVision');
				toggle?.onClick?.();
			} else {
				game.settings.set(SYSTEM.id, 'gmTokenVision', !game.settings.get(SYSTEM.id, 'gmTokenVision'));
			}
			return true;
		},
	});
}
