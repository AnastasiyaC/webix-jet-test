import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const header = {
			type: "header",
			localId: "page_header",
			template: obj => `<span class="template-header">${obj.name}</span>`,
			css: "webix_header app_header"
		};

		const menu = {
			view: "menu",
			id: "top:menu",
			localId: "page_menu",
			css: "app_menu",
			width: 200,
			layout: "y",
			select: true,
			template: "<span class='webix_icon #icon#'></span> #value# ",
			data: [
				{
					icon: "wxi-user",
					value: _("Contacts"),
					id: "contacts"
				},
				{
					icon: "wxi-calendar",
					value: _("Activities"),
					id: "activities"
				},
				{
					icon: "wxi-columns",
					value: _("Settings"),
					id: "settings"}
			]
		};

		const ui = {
			css: "app_layout",
			rows: [
				header,
				{
					cols: [
						menu,
						{
							$subview: true
						}
					]
				}
			]
		};

		return ui;
	}

	init() {
		this.use(plugins.Menu, "top:menu");

		const header = this.$$("page_header");
		const menu = this.$$("page_menu");

		this.on(menu, "onAfterSelect", () => {
			const name = menu.getSelectedItem().value;
			header.setValues({name});
		});
	}
}
