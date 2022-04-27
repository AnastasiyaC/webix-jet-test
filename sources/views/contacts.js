import {JetView} from "webix-jet";

import ContactInfo from "./contactsViews/contactInfo";
import ContactsList from "./contactsViews/contactsList";

export default class ContactsView extends JetView {
	config() {
		return {
			cols: [
				ContactsList,
				ContactInfo
			]
		};
	}
}
