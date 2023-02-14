export function monkeyPatch() {
	const origIsVisionSource = Token.prototype._isVisionSource;
	Token.prototype._isVisionSource = function () {
		// const tokenIds = game.settings.get('solo-toolkit', 'gmTokenVisionTokens');
		// const gmTokenVision = game.settings.get('solo-toolkit', 'gmTokenVision');
		const gmTokenVision = game.srpg.gmTokenVision;
		const gmTokenVisionTokens = game.srpg.gmTokenVisionTokens;

		if (gmTokenVision && gmTokenVisionTokens.includes(this.id)) {
			if (game.user.isGM) return true;
		}

		return origIsVisionSource.apply(this);
	};
}
