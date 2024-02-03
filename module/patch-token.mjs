/*
 * Patches the core Token class to read the module's Token Vision settings.
 */
export default function patchToken() {
	const origIsVisionSource = Token.prototype._isVisionSource;
	Token.prototype._isVisionSource = function () {
		const gmTokenVision = game.settings.get(SYSTEM.id, 'gmTokenVision');
		const gmTokenVisionTokens = game.settings.get(SYSTEM.id, 'gmTokenVisionTokens');
		// const gmTokenVision = game.srpg.gmTokenVision;
		// const gmTokenVisionTokens = game.srpg.gmTokenVisionTokens;

		if (gmTokenVision && gmTokenVisionTokens.includes(this.id)) {
			if (game.user.isGM) return true;
		}

		return origIsVisionSource.apply(this);
	};
}
