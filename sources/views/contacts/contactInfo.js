import {JetView} from "webix-jet";

import userIcon from "../../assets/icons/icon-user.jpg";
import activitiesCollection from "../../models/activities";
import contactsCollection from "../../models/contacts";
import filesCollection from "../../models/files";
import statusesCollection from "../../models/statuses";
import ContactData from "./contactData";

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
					css: "webix_transparent button--border",
					width: 110,
					click: () => this.toggleDeleteContact()
				},
				{
					view: "button",
					label: "Edit",
					type: "icon",
					icon: "wxi-pencil",
					css: "webix_transparent button--border",
					width: 110,
					click: () => this.toggleOpenEditContactForm()
				}
			]
		};

		const toolbar = {
			type: "clean",
			cols: [
				{
					template: (obj) => {
						if (Object.keys(obj).length === 0) return "";

						return `
							<span class="contact-name">
								${obj.value || "<dfn style=\"opacity: 0.5\">empty data</dfn>"}
							</span>`;
					},
					localId: "template_contact-name",
					css: "template__contact-name",
					gravity: 2
				},
				settingsButtons
			]
		};

		const contactInfoTemplate = {
			template: (obj) => {
				const info = {
					Email: "email",
					Skype: "skype",
					Job: "tag",
					Company: "briefcase-variant",
					BirthdayDate: "calendar-month",
					Address: "map-marker-outline"
				};
				const defaultValue = "<dfn style=\"opacity: 0.5\">empty data</dfn>";
				const defaultUsersPhoto = userIcon;
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
						${photo}
						${status} 
						<div class="contact-info__details">
							${infoDetails}
						</div>
					</div>`;
			},
			localId: "template_contact-info",
			css: "template--grid_contact-info",
			height: 250
		};

		const contactInfo = {
			type: "clean",
			localId: "contact-info",
			rows: [
				toolbar,
				contactInfoTemplate,
				ContactData
			]
		};

		const empty = {
			template: "Contact is not selected..."
		};

		const ui = {
			cells: [
				{
					id: "contact-info",
					rows: [
						contactInfo
					]
				},
				{
					id: "empty-info",
					rows: [
						empty
					]
				}
			],
			animate: false
		};

		return ui;
	}

	init() {
		webix.promise.all([
			contactsCollection.waitData,
			statusesCollection.waitData
		]).then(() => {
			this.setContactInfo();
		});
	}

	urlChange() {
		this.setContactInfo();
	}

	setContactInfo() {
		const contactId = this.getParam("contactId");
		const contactName = this.$$("template_contact-name");
		const contactInfo = this.$$("template_contact-info");

		if (contactId) {
			const item = contactsCollection.getItem(contactId);

			contactName.setValues(item);
			contactInfo.setValues(item);
			this.$$("contact-info").show();
		}
		else {
			this.app.callEvent("onUnselectContactList");
			this.$$("empty-info").show();
		}
	}

	toggleOpenEditContactForm() {
		const contactId = this.getParam("contactId");

		this.app.callEvent("openContactForm", [contactId]);
	}

	toggleDeleteContact() {
		const contactId = this.getParam("contactId");

		webix.confirm({
			title: "Delete...",
			text: "Do you still want to delete this contact?",
			ok: "Yes",
			cancel: "No"
		}).then(() => {
			if (contactId) {
				const contactActivities = [];
				const contactFiles = [];

				activitiesCollection.data.each((el) => {
					if (String(el.ContactID) === String(contactId)) {
						contactActivities.push(el.id);
					}
				});

				filesCollection.data.each((el) => {
					if (String(el.ContactID) === String(contactId)) {
						contactFiles.push(el.id);
					}
				});

				if (contactActivities.length) activitiesCollection.remove(contactActivities);
				if (contactFiles.length) filesCollection.remove(contactFiles);

				contactsCollection.remove(contactId);
				this.app.callEvent("onSelectFirstContact");
			}
		});
	}
}
