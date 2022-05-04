import {JetView} from "webix-jet";

import userIcon from "../../assets/icons/icon-user.jpg";
import contactsCollection from "../../models/contacts";
import statusesCollection from "../../models/statuses";

export default class ContactForm extends JetView {
	config() {
		const formLabel = {
			view: "label",
			label: "Edit contact",
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
				width: 150
			},
			{
				view: "button",
				label: "Save",
				css: "webix_primary button--border",
				width: 150,
				click: () => this.toggleSaveContact()
			}
		];

		return {
			view: "form",
			localId: "contact_form",
			elementsConfig: {
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
				Birthday: webix.rules.isNotEmpty
			}
		};
	}

	toggleSaveContact() {
		const form = this.$$("contact_form");

		if (form.validate()) {
			const values = form.getValues();
			const usersPhoto = this.$$("users_photo");

			values.Photo = usersPhoto.getValues().Photo;

			contactsCollection.add(values);
			webix.message("Added new contact!");
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
