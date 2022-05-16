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
		this.on(this.app, "contactInfo:open", (id) => {
			if (id) this.show(`./contacts.contactInfo?contactId=${id}`);
			else this.show("./contacts.contactInfo");
		});
		this.on(this.app, "contactForm:open", (id) => {
			if (id) this.show(`./contacts.contactForm?contactId=${id}`);
			else this.show("./contacts.contactForm");
		});
	}
}
