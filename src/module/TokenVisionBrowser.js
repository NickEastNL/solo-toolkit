export class TokenVisionBrowser extends Application {
	constructor(options = {}) {
		super(options);
	}

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			id: 'token-vision-browser',
			height: 300,
			width: 250,
			left: 120,
			template: 'modules/solo-toolkit/templates/token-vision-browser.hbs',
			title: 'Token Vision Browser',
		});
	}

	getData() {
		const selectedTokens = game.srpg.gmTokenVisionTokens;
		const tokenData = [];

		if (selectedTokens.length === 0) return {};

		for (const tokenId of selectedTokens) {
			const token = game.canvas.tokens.get(tokenId);

			if (!token) continue;

			tokenData.push({
				name: token.name,
				img: token.document.texture.src,
			});
		}

		tokenData.sort((a, b) => {
			if (a.name < b.name) return -1;
			if (a.name > b.name) return 1;
			return 0;
		});

		return {
			tokenData,
		};
	}

	activateListeners(html) {
		html.find('.assign-btn').on('click', (ev) => {
			ev.preventDefault();

			this.setVisionFromSelection();
		});
	}

	setVisionFromSelection() {
		const selectedTokens = canvas.tokens.controlled;

		const tokenIds = [];
		for (const token of selectedTokens) {
			tokenIds.push(token.id);
		}

		this.updateSelectedTokens(tokenIds);
	}

	updateSelectedTokens(tokenIds) {
		game.settings.set('solo-toolkit', 'gmTokenVisionTokens', tokenIds);

		if (game.srpg.tokenVisionBrowser.rendered) game.srpg.tokenVisionBrowser.render(true);

		this._updateVision();
	}

	toggleVision() {
		const tokenIds = game.srpg.gmTokenVisionTokens;

		if (!tokenIds.length === 0) return;

		this._updateVision();
	}

	_updateVision() {
		for (const token of canvas.tokens.placeables) {
			token.updateVisionSource({ defer: true });
		}

		canvas.perception.update({ refreshVision: true, refreshLighting: true }, true);
	}
}
