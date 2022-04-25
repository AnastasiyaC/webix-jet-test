import {JetView} from "webix-jet";

import activitiesCollection from "../../models/activities";
import activityTypesCollection from "../../models/activityTypes";
import contactsCollection from "../../models/contacts";
import statusesCollection from "../../models/statuses";

export default class ActivitiesForm extends JetView {
	constructor(app, action) {
		super(app);
		this._action = action;
	}

	config() {
		return {
			view: "form",
			localId: "activities_edit-form",
			margin: 10,
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
					options: {
						body: {
							data: activityTypesCollection,
							template: "#Value#"
						}
					}
				},
				{
					view: "combo",
					label: "Contact",
					name: "ContactID",
					options: {
						body: {
							data: contactsCollection,
							template: "#FirstName# #LastName#"
						}
					}
				},
				{
					cols: [
						{
							view: "datepicker",
							label: "Date",
							name: "Date",
							format: "%d %M %Y",
							value: new Date()
						},
						{
							gravity: 0.2
						},
						{
							view: "datepicker",
							label: "Time",
							name: "Time",
							format: "%H:%i",
							type: "time",
							value: new Date()
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
							localId: "actionBtn",
							value: "Save",
							css: "webix_primary",
							width: 150,
							click: () => this.toggleUpdateOrSave()
						},
						{
							view: "button",
							value: "Cancel",
							width: 150,
							click: () => this.toggleCancel()
						}
					]
				}
			],
			rules: {
				Details: webix.rules.isNotEmpty,
				TypeID: webix.rules.isChecked,
				ContactID: webix.rules.isChecked,
				Date: webix.rules.isNotEmpty,
				Time: webix.rules.isNotEmpty
			}
		};
	}

	toggleCancel() {
		this.getParentView().hideWindow();
		const form = this.$$("activities_edit-form");

		form.clear();
	}

	toggleUpdateOrSave() {
		const form = this.$$("activities_edit-form");
		const idParam = this.getParam("id");

		if (form.validate()) {
			const values = form.getValues();

			const dateFormat = webix.Date.dateToStr("%Y-%m-%d");
			const date = dateFormat(values.Date);

			const timeFormat = webix.Date.dateToStr("%H:%i");
			const time = timeFormat(values.Time);

			const {id, Details, TypeID, ContactID, State} = values;
			const dataValues = Object.assign({}, {id, Details, TypeID, ContactID, State});
			dataValues.DueDate = `${date} ${time}`;


			idParam ?
				activitiesCollection.updateItem(id, dataValues) :
				activitiesCollection.add(dataValues);

			form.clear();
			this.getParentView().hideWindow();
		}
		else {
			webix.message("Form is incomplete. Fill the form!");
		}
	}

	urlChange() {
		this.setFormValues();
	}

	setFormValues() {
		webix.promise.all([
			activitiesCollection.waitData,
			activityTypesCollection.waitData,
			contactsCollection.waitData,
			statusesCollection.waitData
		]).then(() => {
			const idParam = this.getParam("id");
			const form = this.$$("activities_edit-form");

			if (idParam) {
				const item = activitiesCollection.getItem(idParam);
				const dateAndTime = new Date(item.DueDate);
				const itemValues = {
					...item,
					Date: dateAndTime,
					Time: dateAndTime
				};

				// this.getParentView().getHead().setHTML("Edit activity");
				form.setValues(itemValues);
			}
			else {
				// this.getParentView().getHead().setHTML("Add activity");
				form.clear();
			}
		});
	}

	clearFormValidation() {
		const form = this.$$("activities_edit-form");

		form.clearValidation();
	}
}
