import {JetView} from "webix-jet";

import activitiesCollection from "../../models/activities";
import activityTypesCollection from "../../models/activityTypes";
import contactsCollection from "../../models/contacts";

export default class ActivitiesForm extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			view: "form",
			localId: "activities_edit-form",
			margin: 10,
			width: 600,
			elementsConfig: {
				labelWidth: 100,
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
					label: _("Details"),
					name: "Details",
					height: 120
				},
				{
					view: "combo",
					label: _("Type"),
					name: "TypeID",
					options: activityTypesCollection
				},
				{
					view: "combo",
					localId: "contact_combo",
					label: _("Contact"),
					name: "ContactID",
					options: contactsCollection
				},
				{
					cols: [
						{
							view: "datepicker",
							label: _("Date"),
							name: "Date",
							format: "%d %M %Y"
						},
						{
							view: "datepicker",
							label: _("Time"),
							name: "Time",
							format: "%H:%i",
							type: "time",
							labelAlign: "right"
						}
					]
				},
				{
					view: "checkbox",
					label: _("Completed"),
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
							css: "webix_primary button--border",
							width: 150,
							click: () => this.toggleUpdateOrSave()
						},
						{
							view: "button",
							value: _("Cancel"),
							css: "button--border",
							width: 150,
							click: () => this.toggleCloseForm()
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
			this.on(this.app, "setFormValue", () => this.setFormValues());
		});
	}

	toggleCloseForm() {
		const form = this.$$("activities_edit-form");

		form.clear();
		form.clearValidation();
		this.app.callEvent("editor:close");
		this.showCurrentPage();
	}

	toggleUpdateOrSave() {
		const form = this.$$("activities_edit-form");
		const _ = this.app.getService("locale")._;

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

			this.toggleCloseForm();
		}
		else {
			webix.message(_("Form is incomplete. Fill the form!"));
		}
	}

	showCurrentPage() {
		const params = this.getUrl()[0].params;
		const contactId = params.contactId;

		if (contactId) {
			this.app.callEvent("contactInfo:open", [contactId]);
			return;
		}

		this.show("/top/activities");
	}

	setFormValues() {
		const params = this.getUrl()[0].params;
		const activityId = params.activityId;
		const contactId = params.contactId;
		const form = this.$$("activities_edit-form");
		const contactCombo = this.$$("contact_combo");

		if (activityId) {
			const item = activitiesCollection.getItem(activityId);
			item.Date = item.DueDate;
			item.Time = item.DueDate;

			this.setFormMode("save");
			form.setValues(item);
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
		const _ = this.app.getService("locale")._;
		const activeButtonLabel = mode === "add" ? _("Add") : _("Save");

		this._editMode = mode;
		activeButton.define("label", activeButtonLabel);
		activeButton.refresh();
	}

	clearFormValidation() {
		const form = this.$$("activities_edit-form");

		form.clearValidation();
	}
}
