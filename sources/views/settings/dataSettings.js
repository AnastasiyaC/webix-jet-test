import {JetView} from "webix-jet";

import activityTypesCollection from "../../models/activityTypes";
import statusesCollection from "../../models/statuses";
import EditableDatatable from "./editableDatatable";

export default class DataSettings extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			rows: [
				{
					view: "tabbar",
					value: "Activities",
					multiview: true,
					options: [
						{
							id: "Activities",
							value: _("Activity types")
						},
						{
							id: "Statuses",
							value: _("Contact statuses")
						}
					]
				},
				{
					cells: [
						{
							id: "Activities",
							rows: [
								new EditableDatatable(this.app, activityTypesCollection)
							]
						},
						{
							id: "Statuses",
							rows: [
								new EditableDatatable(this.app, statusesCollection)
							]
						}
					]
				}
			]
		};
	}
}
