import {JetView} from "webix-jet";

import activitiesCollection from "../../models/activities";
import activityTypesCollection from "../../models/activityTypes";
import contactsCollection from "../../models/contacts";
import ActivitiesModalWindow from "./ActivitiesModalWindow";

export default class ActivitiesDatatable extends JetView {
	constructor(app, hiddenColumn) {
		super(app);
		this._hiddenColumn = hiddenColumn;
		this._setNameValueToForm = false;
	}

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
					css: "webix_transparent button--border",
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
					this.toggleDeleteItem(id);
				},
				"wxi-pencil": (e, id) => {
					this.toggleEditActivity(id);
				}
			}
		};

		const ui = {
			rows: this._hiddenColumn ? [
					datatable,
					toolbar,
				] :
				[
					toolbar,
					datatable
				]
		};

		return ui;
	}

	init() {
		const datatable = this.$$("activities_datatable");

		if (this._hiddenColumn) {
			datatable.hideColumn(this._hiddenColumn);
			this._setNameValueToForm = this._hiddenColumn === "ContactID";
		}

		this.windowForm = this.ui(ActivitiesModalWindow);

		webix.promise.all([
			activitiesCollection.waitData,
			activityTypesCollection.waitData,
			contactsCollection.waitData
		]).then(() => {
			const idParam = this.getParam("id");

			datatable.parse(activitiesCollection);
			if (idParam) this.filterByContactName(idParam);

			this.on(activitiesCollection.data, "onStoreUpdated", () => {
				
				datatable.filterByAll()
				if (idParam) this.filterByContactName(idParam);
			});
		});
	}

	urlChange() {
		const datatable = this.$$("activities_datatable");
		const idParam = this.getParam("id");

		datatable.filterByAll();
		if (idParam) this.filterByContactName(idParam);
	}

	toggleAddActivity() {
		this.windowForm.showWindow("", this._setNameValueToForm);
	}

	toggleEditActivity(id) {
		this.windowForm.showWindow(id, this._setNameValueToForm);
	}

	toggleDeleteItem(id) {
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

	filterByContactName(id) {
		const datatable = this.$$("activities_datatable");

		datatable.filter("#ContactID#", id, true);
	}
}
