import {JetView} from "webix-jet";

import ContactInfo from "./contactInfo";
import ContactsList from "./contactsList";

export default class ContactsView extends JetView {
	config() {
		return {
			cols: [
				ContactsList,
				ContactInfo
				// {$subview: true}
			]
		};
	}

	init() {
		// this.on(this.app, "openContactInfo", () => this.show("./contactsInfo"));
		this.on(this.app, "openContactForm", () => this.show("./contactForm"));
	}
}
