import {JetView} from "webix-jet";

export default class LanguageSettings extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const lang = this.app.getService("locale").getLang();

		return {
			view: "segmented",
			localId: "language_settings",
			value: lang,
			label: _("Language"),
			options: [
				{
					id: "en",
					value: _("English")
				},
				{
					id: "ru",
					value: _("Russian")
				}
			],
			click: () => this.toggleChangeLanguage()
		};
	}

	toggleChangeLanguage() {
		const langs = this.app.getService("locale");
		const value = this.$$("language_settings").getValue();

		langs.setLang(value);
	}
}
