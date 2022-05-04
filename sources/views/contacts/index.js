import {JetView} from "webix-jet";

import ContactsList from "./contactsList";

export default class ContactsView extends JetView {
	config() {
		return {
			cols: [
				ContactsList,
				{
					$subview: true
				}
			]
		};
	}

	init() {
		this.on(this.app, "openContactInfo", id => this.show(`./contacts.contactInfo?id=${id}`));
		this.on(this.app, "openAddContactForm", () => this.show("./contacts.contactForm"));
		this.on(this.app, "openEditContactForm", id => this.show(`./contacts.contactForm?id=${id}`));
	}
}
