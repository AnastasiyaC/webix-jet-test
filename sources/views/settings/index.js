import {JetView} from "webix-jet";

import DataSettings from "./dataSettings";
import LanguageSettings from "./languageSettings";

export default class SettingsView extends JetView {
	config() {
		return {
			rows: [
				LanguageSettings,
				{
					gravity: 0.1
				},
				DataSettings
			]
		};
	}
}
