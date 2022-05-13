import {JetView} from "webix-jet";

import activitiesCollection from "../../models/activities";
import activityTypesCollection from "../../models/activityTypes";
import contactsCollection from "../../models/contacts";
import activitiesFilters from "../../utils/activitiesFilters";
import ActivitiesFilterTabbar from "./activitesFilterTabbar";
import ActivitiesModalWindow from "./activitiesModalWindow";

export default class ActivitiesDatatable extends JetView {
	constructor(app, hiddenColumn) {
		super(app);
		this._hiddenColumn = hiddenColumn;
	}

	config() {
		const _ = this.app.getService("locale")._;

		const toolbar = {
			view: "toolbar",
			paddingX: 20,
			paddingY: 5,
			cols: [
				this._hiddenColumn ? { } : ActivitiesFilterTabbar,
				{
					view: "button",
					label: _("Add activity"),
					type: "icon",
					icon: "wxi-plus-square",
					css: "webix_transparent button--border",
					width: 220,
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
						_("Activity type"),
						{
							content: "selectFilter"
						}
					],
					collection: activityTypesCollection,
					sort: "text",
					fillspace: true,
					template: (obj) => {
						const activityType = activityTypesCollection.getItem(obj.TypeID);
						const activityIcon = activityType ? `<span class="webix_icon mdi mdi-${activityType.Icon}"></span>` : " ";
						const activityValue = activityType ? activityType.Value : "activity not found";

						return `${activityIcon} ${activityValue}`;
					}
				},
				{
					id: "DueDate",
					format: webix.i18n.longDateFormatStr,
					header: [
						_("Due date"),
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
					header: [
						_("Details"),
						{content: "textFilter"}
					],
					sort: "text",
					fillspace: true
				},
				{
					id: "ContactID",
					header: [
						_("Contacts"),
						{
							content: "selectFilter"
						}
					],
					collection: contactsCollection,
					fillspace: true,
					sort: "text",
					template: (obj) => {
						const contact = contactsCollection.getItem(obj.ContactID);

						return contact ? contact.value : "contact not found";
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
				toolbar
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
		}

		this.windowForm = this.ui(ActivitiesModalWindow);

		webix.promise.all([
			activitiesCollection.waitData,
			activityTypesCollection.waitData,
			contactsCollection.waitData
		]).then(() => {
			datatable.parse(activitiesCollection);
			this.filterByContactName();

			this.on(activitiesCollection.data, "onStoreUpdated", () => {
				this.filterByContactName();
				this.filterByTabFilterName(this._tabId);
			});

			this.on(this.app, "filterByTabName", (tabId) => {
				this._tabId = tabId;
				datatable.filterByAll();
			});
		});
		this.on(datatable, "onAfterFilter", () => {
			this.filterByContactName();
			this.filterByTabFilterName(this._tabId);
		});
	}

	urlChange() {
		const datatable = this.$$("activities_datatable");

		datatable.filterByAll();
		this.filterByContactName();
	}

	toggleAddActivity() {
		this.windowForm.showWindow("");
	}

	toggleEditActivity(id) {
		this.windowForm.showWindow(id);
	}

	toggleDeleteItem(id) {
		const _ = this.app.getService("locale")._;

		webix.confirm({
			title: _("Delete..."),
			text: _("Do you still want to delete this activity?"),
			ok: _("Yes"),
			cancel: _("No")
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

	filterByContactName() {
		const datatable = this.$$("activities_datatable");
		const contactId = this.getParam("contactId");

		if (contactId) datatable.filter("#ContactID#", contactId, true);
	}

	filterByTabFilterName(tabId) {
		const datatable = this.$$("activities_datatable");

		if (this._hiddenColumn) return;
		datatable.filter(activitiesFilters[tabId], null, true);
	}
}
