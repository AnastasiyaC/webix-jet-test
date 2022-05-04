import {JetView} from "webix-jet";

import ContactForm from "./contactsViews/contactForm";

class Settings extends JetView {
	config() {
		return {
			// template: "settings"
			rows: [ContactForm]
		};
	}
}

export default Settings;
