import { HooksSRPG } from './hooks/index.js';
import { monkeyPatch } from './monkey-patch.js';

import './style.scss';
import { TemplatePreloader } from './template-preloader.js';

monkeyPatch();

HooksSRPG.listen();

if (__BUILD_MODE__ === 'development' && module.hot) {
	module.hot.accept();

	if (module.hot.status() === 'apply') {
		HooksSRPG.off();

		for (const template in _templateCache) {
			delete _templateCache[template];
		}

		TemplatePreloader.preloadHandlebarsTemplates().then(() => {
			for (const appId in ui.windows) {
				ui.windows[Number(appId)].render(true);
			}
		});
	}
}
