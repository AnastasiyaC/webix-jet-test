import {JetView} from "webix-jet";

import ContactActivityDatateble from "./contactActivityDatatable";
import ContactFiliesDatatable from "./contactFiliesDatatable";

export default class ContactData extends JetView {
	config() {
		return {
			type: "clean",
			rows: [
				{
					view: "tabbar",
					value: "activities",
					multiview: true,
					options: [
						{
							id: "activities",
							value: "Activities"
						},
						{
							id: "filies",
							value: "Filies"
						}
					]
				},
				{
					cells: [
						{
							id: "activities",
							rows: [
								ContactActivityDatateble
							]
						},
						{
							id: "filies",
							rows: [
								ContactFiliesDatatable
							]
						}
					]
				}
			]
		};
	}
}
