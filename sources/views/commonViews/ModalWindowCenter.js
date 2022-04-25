import {JetView} from "webix-jet";

export default class ModalWindowViewCenter extends JetView {
	constructor(app, view, head, width) {
		super(app);
		this._view = view;
		this._head = head;
		this._width = width;
	}

	config() {
		return {
			view: "window",
			head: this._head,
			position: "center",
			width: this._width,
			modal: true,
			body: {
				rows: [
					this._view
				]
			}
		};
	}

	showWindow() {
		this.getRoot().show();
	}

	hideWindow() {
		this.getRoot().hide();
	}
}
