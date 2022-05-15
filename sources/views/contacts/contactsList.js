import {JetView} from "webix-jet";

import userIcon from "../../assets/icons/icon-user.jpg";
import contactsCollection from "../../models/contacts";
import statusesCollection from "../../models/statuses";

export default class ContactsList extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

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

		const listFilter = {
			view: "text",
			localId: "contact_filter",
			placeholder: _("Type to find matching contacts"),
			height: 60
		};

		const listAddContactButton = {
			view: "button",
			label: _("Add contact"),
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
				listFilter,
				list,
				listAddContactButton
			]
		};
	}

	init() {
		const list = this.$$("contacts_list");
		const listFilter = this.$$("contact_filter");

		contactsCollection.waitData.then(() => {
			list.sync(contactsCollection);

			const listFirstId = list.getFirstId();

			if (!listFirstId) {
				this.app.callEvent("contactInfo:open");
				return;
			}

			list.select(listFirstId);
		});

		this.on(list, "onAfterSelect", (id) => {
			this.app.callEvent("contactInfo:open", [id]);
			listFilter.enable();
		});
		this.on(contactsCollection.data, "onAfterDelete", () => list.select(list.getFirstId()));
		this.on(listFilter, "onTimedKeyPress", () => {
			this.filterList();
			if (!list.getFirstId()) this.show("./contacts.contactInfo");
			list.select(list.getFirstId());
		});
		this.on(this.app, "contactInfo:open", () => list.unselectAll());
		this.on(this.app, "contactForm:open", () => listFilter.disable());
		this.on(this.app, "contactForm:close", (id) => {
			if (list.isSelected(id)) this.app.callEvent("contactInfo:open", [id]);
			else list.select(id || list.getFirstId());
			this.filterList();
			listFilter.enable();
		});
	}

	toggleOpenAddContactForm() {
		const list = this.$$("contacts_list");

		this.app.callEvent("contactForm:open");
		list.unselectAll();
	}

	filterList() {
		const listFilter = this.$$("contact_filter");
		const list = this.$$("contacts_list");
		const value = listFilter.getValue().toLowerCase();
		const firstChar = value[0];

		if (!value) {
			list.filter();
			return;
		}
		list.filter((obj) => {
			const status = statusesCollection.getItem(obj.StatusID);
			const statusValue = status ? status.Value : "";
			const filteringFields = [
				obj.value, obj.Job, obj.Company, obj.Address, obj.Email, obj.Skype, statusValue
			];
			let filter = filteringFields.join("|");

			if (firstChar === "=" || firstChar === ">" || firstChar === "<") {
				const seachYearValue = value.slice(1);
				const startDate = obj.StartDate.getFullYear();
				const birthday = obj.Birthday.getFullYear();

				if (Number(seachYearValue)) {
					const textLength = seachYearValue.length;
					const startDateString = String(startDate).slice(0, textLength);
					const birthdayString = String(birthday).slice(0, textLength);

					if (firstChar === "=") {
						return startDateString === seachYearValue || birthdayString === seachYearValue;
					}
					if (firstChar === ">") {
						return startDateString > seachYearValue || birthdayString > seachYearValue;
					}
					if (firstChar === "<") {
						return startDateString < seachYearValue || birthdayString < seachYearValue;
					}
				}
				else {
					return false;
				}
				return true;
			}

			filter = filter.toString().toLowerCase();
			return (filter.indexOf(value) !== -1);
		});
	}
}
