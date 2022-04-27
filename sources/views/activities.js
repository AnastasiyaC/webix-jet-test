import {JetView} from "webix-jet";

import ActivitiesDatatable from "./activitiesViews/activitiesDatatable";

export default class ActivitiesView extends JetView {
	config() {
		return {
			rows: [
				ActivitiesDatatable
			]
		};
	}
}
