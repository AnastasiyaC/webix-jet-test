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

	showWindow(id, setName) {
		const popupWindow = this.getRoot();

		popupWindow.show();
		popupWindow.getHead().setHTML(id ? "Edit activity" : "Add activity");

		this.setParam("id", id, true);
		if (setName) this.setParam("mode", "name", true);
	}

	hideWindow() {
		this.getRoot().hide();
	}
}
