import {JetView} from "webix-jet";

import activitiesCollection from "../../models/activities";
import activityTypesCollection from "../../models/activityTypes";
import contactsCollection from "../../models/contacts";

export default class ActivitiesForm extends JetView {
	constructor(app) {
		super(app);
		this._editMode = "add";
	}

	config() {
		return {
			view: "form",
			localId: "activities_edit-form",
			margin: 10,
			width: 600,
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
			elements: [
				{
					view: "textarea",
					label: "Details",
					name: "Details",
					height: 120
				},
				{
					view: "combo",
					label: "Type",
					name: "TypeID",
					options: activityTypesCollection
				},
				{
					view: "combo",
					localId: "contact_combo",
					label: "Contact",
					name: "ContactID",
					options: contactsCollection
				},
				{
					cols: [
						{
							view: "datepicker",
							label: "Date",
							name: "Date",
							format: "%d %M %Y"
						},
						{
							gravity: 0.2
						},
						{
							view: "datepicker",
							label: "Time",
							name: "Time",
							format: "%H:%i",
							type: "time"
						}
					]
				},
				{
					view: "checkbox",
					label: "Completed",
					name: "State",
					checkValue: "Close",
					uncheckValue: "Open"
				},
				{
					margin: 20,
					cols: [
						{ },
						{
							view: "button",
							localId: "form_button-save",
							value: this._editMode === "add" ? "Add" : "Save",
							css: "webix_primary button--border",
							width: 150,
							click: () => this.toggleUpdateOrSave()
						},
						{
							view: "button",
							value: "Cancel",
							css: "button--border",
							width: 150,
							click: () => this.toggleCancel()
						}
					]
				}
			],
			rules: {
				Details: webix.rules.isNotEmpty,
				TypeID: webix.rules.isNotEmpty,
				ContactID: webix.rules.isNotEmpty,
				Date: webix.rules.isNotEmpty,
				Time: webix.rules.isNotEmpty
			}
		};
	}

	init() {
		webix.promise.all([
			activitiesCollection.waitData,
			activityTypesCollection.waitData,
			contactsCollection.waitData
		]).then(() => {
			this.setFormValues();
		});
	}

	urlChange() {
		this.setFormValues();
	}

	toggleCancel() {
		const form = this.$$("activities_edit-form");

		form.clear();
		form.clearValidation();
		this.app.callEvent("editor:close", []);
		this.showCurrentPage();
	}

	toggleUpdateOrSave() {
		const form = this.$$("activities_edit-form");

		if (form.validate()) {
			const values = form.getValues();

			const dateFormat = webix.Date.dateToStr("%Y-%m-%d");
			const date = dateFormat(values.Date);

			const timeFormat = webix.Date.dateToStr("%H:%i");
			const time = timeFormat(values.Time);

			const {id, Details, TypeID, ContactID, State} = values;
			const dataValues = Object.assign({}, {id, Details, TypeID, ContactID, State});
			dataValues.DueDate = `${date} ${time}`;


			if (this._editMode === "add") {
				activitiesCollection.add(dataValues);
				webix.message("Added new activity!");
			}
			else {
				activitiesCollection.updateItem(id, dataValues);
				webix.message("Activity was updated!");
			}

			form.clear();
			this.app.callEvent("editor:close", []);
			this.showCurrentPage();
		}
		else {
			webix.message("Form is incomplete. Fill the form!");
		}
	}

	showCurrentPage() {
		const contactId = this.getParam("contactId");

		if (contactId) {
			this.app.callEvent("openContactInfo", [contactId]);
			return;
		}

		this.show("/top/activities");
	}

	setFormValues() {
		const activityId = this.getParam("activityId");
		const contactId = this.getParam("contactId");
		const form = this.$$("activities_edit-form");
		const contactCombo = this.$$("contact_combo");

		if (activityId) {
			const item = activitiesCollection.getItem(activityId);
			const dateAndTime = new Date(item.DueDate);
			const itemValues = {
				...item,
				Date: dateAndTime,
				Time: dateAndTime
			};

			this.setFormMode("save");
			form.setValues(itemValues);
			if (contactId) contactCombo.disable();
		}

		else {
			form.clear();
			if (contactId) {
				contactCombo.setValue(contactId);
				contactCombo.disable();
			}
			this.setFormMode("add");
		}
	}

	setFormMode(mode) {
		const activeButton = this.$$("form_button-save");
		const activeButtonLabel = mode === "add" ? "Add" : "Save";

		this._editMode = mode;
		activeButton.define("label", activeButtonLabel);
		activeButton.refresh();
	}

	clearFormValidation() {
		const form = this.$$("activities_edit-form");

		form.clearValidation();
	}
}
