import {JetView} from "webix-jet";

import userIcon from "../../assets/icons/icon-user.jpg";
import contactsCollection from "../../models/contacts";
import statusesCollection from "../../models/statuses";

export default class ContactForm extends JetView {
	constructor(app) {
		super(app);
		this._editMode = "add";
	}

	config() {
		const formLabel = {
			view: "label",
			localId: "contact-form_label",
			label: this._editMode === "add" ? "Add new contact" : "Edit contact",
			css: "label__form-label"
		};

		const formElements = {
			colOne: [
				{
					...this.formTextElement("First name", "FirstName"),
					required: true
				},
				{
					...this.formTextElement("Last name", "LastName"),
					required: true
				},
				{
					view: "datepicker",
					label: "Joining date",
					name: "StartDate"
				},
				{
					view: "combo",
					label: "Status",
					options: statusesCollection,
					name: "StatusID",
					required: true
				},
				{
					...this.formTextElement("Job", "Job"),
					required: true
				},
				{
					...this.formTextElement("Company", "Company"),
					required: true
				},
				{
					...this.formTextElement("Website", "Website")
				},
				{
					...this.formTextElement("Address", "Address"),
					required: true,
					height: 65
				}
			],
			colTwo: [
				{
					...this.formTextElement("Email", "Email"),
					required: true
				},
				{
					...this.formTextElement("Skype", "Skype"),
					required: true
				},
				{
					...this.formTextElement("Phone", "Phone")
				},
				{
					view: "datepicker",
					label: "Birthday",
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
									label: "Change photo",
									css: "webix_transparent button--border",
									autosend: false,
									accept: "image/png, image/jpeg",
									on: {
										onBeforeFileAdd: obj => this.toggleLoadUsersPhoto(obj)
									}
								},
								{
									view: "button",
									label: "Delete photo",
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
				label: "Cancel",
				css: "button--border",
				width: 150,
				click: () => this.toggleCancel()
			},
			{
				view: "button",
				localId: "form_button-save",
				label: this._editMode === "add" ? "Add" : "Save",
				css: "webix_primary button--border",
				width: 150,
				click: () => this.toggleUpdateOrSaveContact()
			}
		];

		return {
			view: "form",
			localId: "contact_form",
			elementsConfig: {
				labelWidth: 90,
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
						{
							margin: 10,
							rows: [...formElements.colOne]
						},
						{
							gravity: 0.1
						},
						{
							margin: 10,
							rows: [...formElements.colTwo]
						}
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

	urlChange() {
		this.setFormValues();
	}

	setFormValues() {
		webix.promise.all([
			contactsCollection.waitData,
			statusesCollection.waitData
		]).then(() => {
			const contactId = this.getParam("cid");
			const form = this.$$("contact_form");

			if (contactId) {
				const item = contactsCollection.getItem(contactId);
				const usersPhoto = this.$$("users_photo");

				this.setFormMode("save");
				form.setValues(item);
				usersPhoto.setValues({Photo: item.Photo});
			}
			else {
				this.setFormMode("add");
			}
		});
	}

	setFormMode(mode) {
		const activeButton = this.$$("form_button-save");
		const activeButtonLabel = mode === "add" ? "Add" : "Save";
		const formLabel = this.$$("contact-form_label");
		const formLabelValue = mode === "add" ? "Add new contact" : "Edit contact";

		this._editMode = mode;
		activeButton.define("label", activeButtonLabel);
		activeButton.refresh();
		formLabel.define("label", formLabelValue);
		formLabel.refresh();
	}

	toggleUpdateOrSaveContact() {
		const form = this.$$("contact_form");

		if (form.validate()) {
			const values = form.getValues();
			const usersPhoto = this.$$("users_photo");
			const dateFormat = webix.Date.dateToStr("%Y-%m-%d %H:%i");

			values.Photo = usersPhoto.getValues().Photo;
			values.Birthday = dateFormat(values.Birthday);
			values.StartDate = dateFormat(values.StartDate);

			if (this._editMode === "add") {
				contactsCollection.add(values);
				webix.message("Added new contact!");
				this.app.callEvent("onSelectFirstContact");
			}
			else {
				contactsCollection.updateItem(values.id, values);
				webix.message("Contact was updated!");
				this.app.callEvent("openContactInfo", [values.id]);
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
		const contactId = this.getParam("cid");

		form.clear();
		if (contactId) this.app.callEvent("openContactInfo", [contactId]);
		else this.app.callEvent("onSelectFirstContact");
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
