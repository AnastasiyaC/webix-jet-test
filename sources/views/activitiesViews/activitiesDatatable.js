import {JetView} from "webix-jet";

import activitiesCollection from "../../models/activities";
import activityTypesCollection from "../../models/activityTypes";
import contactsCollection from "../../models/contacts";
import ActivitiesModalWindow from "./ActivitiesModalWindow";

export default class ActivitiesDatatable extends JetView {
	config() {
		const toolbar = {
			view: "toolbar",
			paddingX: 20,
			paddingY: 5,
			cols: [
				{ },
				{
					view: "button",
					label: "Add activity",
					type: "icon",
					icon: "wxi-plus-square",
					css: "webix_transparent button-contact-toolbar",
					width: 150,
					click: () => {
						this.toggleAddActivity();
					}
				}
			]
		};

		const datatable = {
			view: "datatable",
			localId: "activities_datatable",
			editable: true,
			select: true,
			scrollX: false,
			columns: [
				{
					id: "State",
					header: "",
					template: "{common.checkbox()}",
					width: 50,
					checkValue: "Close",
					uncheckValue: "Open"
				},
				{
					id: "TypeID",
					header: [
						"Activity type",
						{
							content: "selectFilter"
						}
					],
					collection: activityTypesCollection,
					sort: "text",
					fillspace: true,
					template: (obj) => {
						const activityType = activityTypesCollection.getItem(obj.TypeID);

						return activityType?.Value || "activity not found";
					}
				},
				{
					id: "DueDate",
					format: webix.i18n.longDateFormatStr,
					header: [
						"Due date",
						{
							content: "datepickerFilter",
							compare: this.compareDates
						}
					],
					fillspace: true,
					sort: "date"
				},
				{
					id: "Details",
					header: ["Details", {content: "textFilter"}],
					sort: "text",
					fillspace: true
				},
				{
					id: "ContactID",
					header: [
						"Contacts",
						{
							content: "selectFilter"
						}
					],
					collection: contactsCollection,
					fillspace: true,
					sort: "text",
					template: (obj) => {
						const contact = contactsCollection.getItem(obj.ContactID);

						return contact?.value || "activity not found";
					}
				},
				{
					id: "edit",
					header: "",
					template: "{common.editIcon()}",
					width: 50
				},
				{
					id: "delete",
					header: "",
					template: "{common.trashIcon()}",
					width: 50
				}
			],
			onClick: {
				"wxi-trash": (e, id) => {
					this.toggledeleteItem(id);
				},
				"wxi-pencil": (e, id) => {
					this.toggleEditActivity(id);
				}
			}
		};

		const ui = {
			rows: [
				toolbar,
				datatable
			]
		};

		return ui;
	}

	init() {
		const datatable = this.$$("activities_datatable");
		this.windowForm = this.ui(ActivitiesModalWindow);

		webix.promise.all([
			activitiesCollection.waitData,
			activityTypesCollection.waitData,
			contactsCollection.waitData
		]).then(() => {
			datatable.parse(activitiesCollection);
			this.on(activitiesCollection.data, "onStoreUpdated", () => datatable.filterByAll());
		});
	}

	toggleAddActivity() {
		this.windowForm.showWindow("");
	}

	toggleEditActivity(id) {
		this.windowForm.showWindow(id);
	}

	toggledeleteItem(id) {
		webix.confirm({
			title: "Delete...",
			text: "Do you still want to delete this activity?",
			ok: "Yes",
			cancel: "No"
		}).then(() => {
			activitiesCollection.remove(id);
		});
	}

	compareDates(value, filter) {
		const date = new Date(value);

		date.setHours(0);
		date.setMinutes(0);
		return webix.Date.equal(date, filter);
	}
}
