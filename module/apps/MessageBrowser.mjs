export class MessageBrowser extends Application {
	constructor(options = {}) {
		super(options);

		this.injectBrowserButton();

		this._message = null;
		this._outputTemplate = game.srpg.msgDefaultTemplate;
		this._selectedTemplate = 'default';
	}

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			id: 'message-browser',
			width: 300,
			height: 400,
			template: 'modules/solo-toolkit/templates/message-browser.hbs',
			title: 'Message Browser',
		});
	}

	get _renderedMessage() {
		const output = $('#message-browser').find('.example-renderer').text();
		return output;
	}

	get _canRenderMessage() {
		return this._message !== null;
	}

	activateListeners(html) {
		this._toggleButton();
		this._updatePreview();

		html.find('.view-data').on('click', (event) => {
			this._onViewData(event);
		});

		html.find('input[name="search"]').on('input', (event) => {
			this._onSearch(event);
		});

		const templateOptions = html.find('select[name="template-options"]');
		templateOptions.val(this._selectedTemplate);

		const templateInput = html.find('input[name="template"]');
		templateInput.val(this._outputTemplate);

		templateInput.on('input', (event) => {
			this._onTemplateInput(event);
		});

		templateOptions.on('change', (event) => {
			this._selectedTemplate = event.currentTarget.value;

			switch (this._selectedTemplate) {
				case 'custom':
					this._outputTemplate = '';
					break;
				case 'default':
					this._outputTemplate = game.srpg.msgDefaultTemplate;
					break;
				default:
					break;
			}

			templateInput.val(this._outputTemplate).trigger('input');
		});

		html.find('.copy-btn').on('click', (event) => {
			event.preventDefault();

			if (this._canRenderMessage) {
				navigator.clipboard.writeText(this._renderedMessage);
				ui.notifications.notify('Copied rendered message to clipboard.');
			}
		});
	}

	_toggleButton() {
		$('#message-browser').find('.copy-btn').prop('disabled', !this._canRenderMessage);
	}

	_onSearch(event) {
		const $html = $('#message-browser');
		const message = game.messages.get(event.currentTarget.value);
		if (message) {
			this._message = message;
			let messageHtml = $('#chat-log')
				.find(`[data-message-id="${message.id}"]`)
				.children('.message-content')
				.clone();

			messageHtml.find('.dice-tooltip').addClass('expanded');

			messageHtml = $('<div>', { class: 'chat-message' }).append(messageHtml);

			$html.find('.chat-renderer').empty().append(messageHtml);
		} else {
			this._message = null;
			$html.find('.chat-renderer').empty();
		}

		this._toggleButton();
		this._updatePreview();
	}

	_onTemplateInput(event) {
		this._outputTemplate = event.currentTarget.value;
		this._updatePreview();
	}

	_updatePreview() {
		let output = '&nbsp;';
		if (this._message && this._outputTemplate !== '') {
			let result;
			try {
				result = this._processTemplateString();
			} catch {
				result = null;
			} finally {
				if (result) output = result;
			}
		}

		$('#message-browser').find('.example-renderer').empty().append(output);
	}

	_processTemplateString() {
		const template = Handlebars.compile(this._outputTemplate);
		return template(this._message, {
			allowProtoMethodsByDefault: true,
			allowProtoPropertiesByDefault: true,
		});
	}

	async _onViewData(event) {
		event.preventDefault();
		event.stopPropagation();

		if (!this._message) return;

		console.log(this._message);
	}

	injectBrowserButton() {
		if (__BUILD_MODE__ === 'production') return;

		const $html = ui.chat.element;
		if ($html.find('#chat-buttons').length > 0) return;

		const messageBrowserButton = $(
			`<div id="chat-buttons" class="flexrow">
				<button class="message-browser-btn">
					<i class="fas fa-fire"></i>
					Message Browser
				</button>
			</div>`
		);

		$html.find('#chat-log').after(messageBrowserButton);

		messageBrowserButton.on('click', (ev) => {
			ev.preventDefault();

			this._render(true);
		});
	}
}
