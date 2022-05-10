import {JetView} from "webix-jet";

import userIcon from "../../assets/icons/icon-user.jpg";
import contactsCollection from "../../models/contacts";

export default class ContactsList extends JetView {
	config() {
		const list = {
			view: "list",
			localId: "contacts_list",
			css: "list-contact",
			type: {
				height: 60
			},
			template: obj => `
					<img 
						src=${obj.Photo || userIcon}
						class="contact__image"
						alt="contact-image"
						height="50px"
						width="50px"
					>
					<span class="contact__name">
						<b>
							${obj.FirstName} ${obj.LastName}
						</b>
						<br>
						${obj.Company}
					</span>`,
			select: true,
			width: 300
		};

		const listAddContactButton = {
			view: "button",
			label: "Add contact",
			type: "icon",
			icon: "wxi-plus",
			css: "webix_transparent button--border",
			padding: 20,
			margin: 20,
			click: () => this.toggleOpenAddContactForm()
		};

		return {
			type: "clean",
			rows: [
				list,
				listAddContactButton
			]
		};
	}

	init() {
		const list = this.$$("contacts_list");

		contactsCollection.waitData.then(() => {
			list.sync(contactsCollection);

			const listFirstId = list.getFirstId();

			if (!listFirstId) {
				this.app.callEvent("openContactInfo");
				return;
			}

			list.select(listFirstId);
		});

		this.on(list, "onAfterSelect", (id) => {
			this.app.callEvent("openContactInfo", [id]);
		});
		this.on(this.app, "onSelectFirstContact", () => list.select(list.getFirstId()));
		this.on(this.app, "onSelectContact", id => list.select(id));
		this.on(this.app, "onUnselectContactList", () => list.unselectAll());
	}

	toggleOpenAddContactForm() {
		const list = this.$$("contacts_list");

		this.app.callEvent("openContactForm");
		list.unselectAll();
	}
}
