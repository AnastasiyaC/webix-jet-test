import {JetView} from "webix-jet";

import ContactActivityDatateble from "./contactActivityDatatable";
import ContactFiliesDatatable from "./contactFiliesDatatable";

export default class ContactData extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		return {
			type: "clean",
			rows: [
				{
					view: "tabbar",
					localId: "contact_tabbar",
					value: "activities",
					multiview: true,
					options: [
						{
							id: "activities",
							value: _("Activities")
						},
						{
							id: "filies",
							value: _("Filies")
						}
					]
				},
				{
					cells: [
						{
							id: "activities",
							rows: [
								{
									$subview: ContactActivityDatateble
								}
							]
						},
						{
							id: "filies",
							rows: [
								{
									$subview: ContactFiliesDatatable
								}
							]
						}
					]
				}
			]
		};
	}
}
