import {JetView} from "webix-jet";

import userIcon from "../../assets/icons/icon-user.jpg";
import contactsCollection from "../../models/contacts";
import statusesCollection from "../../models/statuses";

export default class ContactForm extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const formLabel = {
			view: "label",
			localId: "contact-form_label",
			css: "label__form-label"
		};

		const formFirstColumn = {
			margin: 10,
			rows: [
				{
					...this.formTextElement(_("First name"), "FirstName"),
					required: true
				},
				{
					...this.formTextElement(_("Last name"), "LastName"),
					required: true
				},
				{
					view: "datepicker",
					label: _("Joining date"),
					name: "StartDate"
				},
				{
					view: "combo",
					label: _("Status"),
					options: statusesCollection,
					name: "StatusID",
					required: true
				},
				{
					...this.formTextElement(_("Job"), "Job"),
					required: true
				},
				{
					...this.formTextElement(_("Company"), "Company"),
					required: true
				},
				{
					...this.formTextElement(_("Website"), "Website")
				},
				{
					...this.formTextElement(_("Address"), "Address"),
					required: true,
					height: 65
				}
			]
		};

		const formSecondColumn = {
			margin: 10,
			rows: [
				{
					...this.formTextElement(_("Email"), "Email"),
					required: true
				},
				{
					...this.formTextElement(_("Skype"), "Skype"),
					required: true
				},
				{
					...this.formTextElement(_("Phone"), "Phone")
				},
				{
					view: "datepicker",
					label: _("Birthday"),
					name: "Birthday",
					required: true
				},
				{
					cols: [
						{
							template: (obj) => {
								const defaultUsersPhoto = userIcon;

								return `
								<div class="contact-form__photo">
									<img 
										src=${obj.Photo || defaultUsersPhoto}
										class="contact-form__image"
										alt="contact-image">
								</div>`;
							},
							localId: "users_photo",
							css: "template__form-photo",
							borderless: true
						},
						{
							type: "clean",
							margin: 10,
							rows: [
								{ },
								{
									view: "uploader",
									label: _("Change photo"),
									css: "webix_transparent button--border",
									autosend: false,
									accept: "image/png, image/jpeg",
									on: {
										onBeforeFileAdd: obj => this.toggleLoadUsersPhoto(obj)
									}
								},
								{
									view: "button",
									label: _("Delete photo"),
									css: "webix_transparent button--border",
									click: () => this.toggleDeleteUsersPhoto()
								}
							]
						}
					]
				}
			]
		};

		const formActionButtons = [
			{
				view: "button",
				label: _("Cancel"),
				css: "button--border",
				width: 150,
				click: () => this.toggleCancel()
			},
			{
				view: "button",
				localId: "form_button-save",
				css: "webix_primary button--border",
				width: 150,
				click: () => this.toggleUpdateOrSaveContact()
			}
		];

		return {
			view: "form",
			localId: "contact_form",
			elementsConfig: {
				labelWidth: 130,
				on: {
					onFocus: () => {
						const name = this.config.name;

						if (name) {
							this.clearFormValidation();
						}
					}
				}
			},
			rows: [
				formLabel,
				{
					gravity: 0.1
				},
				{
					cols: [
						formFirstColumn,
						{
							gravity: 0.1
						},
						formSecondColumn
					]
				},
				{ },
				{
					margin: 20,
					cols: [
						{ },
						...formActionButtons
					]
				}
			],
			rules: {
				FirstName: webix.rules.isNotEmpty,
				LastName: webix.rules.isNotEmpty,
				StatusID: webix.rules.isNotEmpty,
				Email: webix.rules.isEmail,
				Company: webix.rules.isNotEmpty,
				Address: webix.rules.isNotEmpty,
				Birthday: webix.rules.isNotEmpty
			}
		};
	}

	init() {
		return webix.promise.all([
			contactsCollection.waitData,
			statusesCollection.waitData
		]);
	}

	urlChange() {
		this.setFormValues();
	}

	setFormValues() {
		const contactId = this.getParam("contactId");
		const form = this.$$("contact_form");

		if (contactId) {
			const item = contactsCollection.getItem(contactId);
			const usersPhoto = this.$$("users_photo");

			this.setFormMode("save");
			form.setValues(item);
			usersPhoto.setValues({Photo: item.Photo});
		}
		else {
			form.clear();
			this.toggleDeleteUsersPhoto();
			this.setFormMode("add");
		}
	}

	setFormMode(mode) {
		const _ = this.app.getService("locale")._;
		const activeButton = this.$$("form_button-save");
		const activeButtonLabel = mode === "add" ? _("Add") : _("Save");
		const formLabel = this.$$("contact-form_label");
		const formLabelValue = mode === "add" ? _("Add new contact") : _("Edit contact");

		this._editMode = mode;
		activeButton.define("label", activeButtonLabel);
		activeButton.refresh();
		formLabel.define("label", formLabelValue);
		formLabel.refresh();
	}

	toggleUpdateOrSaveContact() {
		const form = this.$$("contact_form");
		const _ = this.app.getService("locale")._;

		if (form.validate()) {
			const values = form.getValues();
			const usersPhoto = this.$$("users_photo");
			const dateFormat = webix.Date.dateToStr("%Y-%m-%d %H:%i");

			values.Photo = usersPhoto.getValues().Photo;
			values.Birthday = dateFormat(values.Birthday);
			values.StartDate = values.StartDate ? dateFormat(values.StartDate) : dateFormat(new Date());

			if (this._editMode === "add") {
				contactsCollection.waitSave(() => contactsCollection.add(values))
					.then((obj) => {
						this.app.callEvent("contactForm:close", [obj.id]);
					});
				webix.message(_("Added new contact!"));
			}
			else {
				contactsCollection.updateItem(values.id, values);
				webix.message(_("Contact was updated!"));
				this.app.callEvent("contactForm:close", [values.id]);
			}

			form.clear();
		}
	}

	toggleLoadUsersPhoto(obj) {
		const reader = new FileReader();
		const usersPhoto = this.$$("users_photo");

		reader.readAsDataURL(obj.file);
		reader.onloadend = () => {
			usersPhoto.setValues({Photo: reader.result});
		};
	}

	toggleDeleteUsersPhoto() {
		const usersPhoto = this.$$("users_photo");

		usersPhoto.setValues({Photo: ""});
	}

	toggleCancel() {
		const form = this.$$("contact_form");
		const contactId = this.getParam("contactId");

		form.clear();
		if (contactId) this.app.callEvent("contactForm:close", [contactId]);
		else this.app.callEvent("contactForm:close");
	}

	clearFormValidation() {
		const form = this.$$("contact_form");

		form.clearValidation();
	}

	formTextElement(label, name) {
		return {
			view: "text",
			label,
			name
		};
	}
}
