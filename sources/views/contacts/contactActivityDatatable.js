import {JetView} from "webix-jet";

import ActivitiesDatatable from "../activitiesViews/activitiesDatatable";

export default class ContactActivityDatateble extends JetView {
	config() {
		return {
			rows: [new ActivitiesDatatable(this.app, "ContactID")]
		};
	}
}
