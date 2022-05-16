import {JetView} from "webix-jet";

export default class ActivitiesFilterTabbar extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const filterTabbar = {
			view: "tabbar",
			localId: "activities_tabbar",
			value: "All",
			options: [
				{
					id: "All",
					value: _("All")
				},
				{
					id: "Overdue",
					value: _("Overdue")
				},
				{
					id: "Completed",
					value: _("Completed")
				},
				{
					id: "Today",
					value: _("Today")
				},
				{
					id: "Tomorrow",
					value: _("Tomorrow")
				},
				{
					id: "ThisWeek",
					value: _("This week")
				},
				{
					id: "ThisMonth",
					value: _("This month")
				}
			]
		};

		return filterTabbar;
	}

	init() {
		const tabbar = this.$$("activities_tabbar");

		this.on(tabbar, "onAfterTabClick", tabId => this.app.callEvent("filterByTabName", [tabId]));
	}
}
