import {JetView} from "webix-jet";

import userIcon from "../../assets/icons/icon-user.jpg";
import contactsCollection from "../../models/contacts";
import statusesCollection from "../../models/statuses";

export default class ContactInfo extends JetView {
	config() {
		const settingsButtons = {
			margin: 20,
			padding: 10,
			cols: [
				{
					view: "button",
					label: "Delete",
					type: "icon",
					icon: "wxi-trash",
					css: "webix_transparent button-contact-toolbar",
					width: 110
				},
				{
					view: "button",
					label: "Edit",
					type: "icon",
					icon: "wxi-pencil",
					css: "webix_transparent button-contact-toolbar",
					width: 110
				}
			]
		};

		const contactInfoTemplate = {
			template: (obj) => {
				const info = {
					Email: "email",
					Skype: "skype",
					Job: "tag",
					Company: "briefcase-variant",
					Birthday: "calendar-month",
					Address: "map-marker-outline"
				};
				const defaultValue = "<dfn style=\"opacity: 0.5\">empty data</dfn>";
				const defaultUsersPhoto = userIcon;
				const name = `
					<span class="contact-info__name">
						${obj.value || defaultValue}
					</span>`;
				const photo = `
					<div class="contact-info__photo">
						<img 
							src=${obj.Photo || defaultUsersPhoto}
							class="contact-info__image"
							alt="contact-image">
					</div>`;
				const statusValue = statusesCollection.getItem(obj.StatusID) ?
					statusesCollection.getItem(obj.StatusID).Value : defaultValue;
				const status = `
					<span class="contact-info__status">
						${statusValue || ""}
					</span>`;
				const infoTotal = Object.keys(info).map(el => `
					<div class="details__item">
						<span class="webix_icon mdi mdi-${info[el]}"></span>
						<span>
							${obj[el] || defaultValue}
						</span>
					</div>`);

				const infoDetails = infoTotal.join("");

				if (Object.keys(obj).length === 0) return "Contact is not selected...";

				return `
					<div class="contact-info">
						${name}
						${photo}
						${status} 
						<div class="contact-info__details">
							${infoDetails}
						</div>
					</div>`;
			},
			localId: "template_contact-info",
			css: "template--grid_contact-info"
		};

		// const EmptyTemplate = {
		// 	template: "contact is not selected"
		// };

		const ui = {
			type: "clean",
			cols: [
				contactInfoTemplate,
				{
					type: "clean",
					rows: [
						settingsButtons,
						{ }
					]
				}
			]
		};

		return ui;
	}

	urlChange() {
		this.setContactInfo();
	}

	setContactInfo() {
		const id = this.getParam("id");
		const info = this.$$("template_contact-info");

		webix.promise.all([
			contactsCollection.waitData,
			statusesCollection.waitData
		]).then(() => {
			if (id) {
				const item = contactsCollection.getItem(id);
				info.setValues(item);
			}
			else info.setValues({});
		});
	}
}
