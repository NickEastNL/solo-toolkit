import './templates/**/*.pug';

export class TemplatePreloader {
	static async preloadHandlebarsTemplates() {
		const templatePaths = ['__ALL_TEMPLATES__'];
		return loadTemplates(templatePaths);
	}
}
