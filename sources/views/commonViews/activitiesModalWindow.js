import {JetView} from "webix-jet";

import ActivitiesForm from "./activitiesForm";

export default class ActivitiesModalWindow extends JetView {
	config() {
		return {
			view: "window",
			localId: "window-center",
			head: " ",
			position: "center",
			modal: true,
			body: {
				rows: [
					ActivitiesForm
				]
			}
		};
	}

	init() {
		this.on(this.app, "editor:close", () => {
			this.hideWindow();
		});
	}

	showWindow(id) {
		const popupWindow = this.getRoot();

		popupWindow.getHead().setHTML(id ? "Edit activity" : "Add activity");

		if (id) {
			this.setParam("activityId", id, true);
		}
		this.app.callEvent("setFormValue");
		popupWindow.show();
	}

	hideWindow() {
		this.getRoot().hide();
	}
}
