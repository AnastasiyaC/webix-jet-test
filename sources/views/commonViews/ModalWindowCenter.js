import {JetView} from "webix-jet";

export default class ModalWindowViewCenter extends JetView {
	constructor(app, view, headName, options) {
		super(app);
		this._view = view;
		this._headName = headName;
		this._options = options;
	}

	config() {
		return {
			view: "window",
			localId: "window-center",
			head: this._headName,
			position: "center",
			width: this._options.width,
			modal: true,
			body: {
				rows: [
					this._view
				]
			}
		};
	}

	init() {
		this.on(this.app, "editor:close", () => {
			this.hideWindow();
		});
	}

	showWindow(id, headValue) {
		const popupWindow = this.getRoot();

		popupWindow.show();
		popupWindow.getHead().setHTML(headValue);
		if (id) {
			this.setParam("id", id, true);
		}
	}

	hideWindow() {
		this.getRoot().hide();
	}
}
