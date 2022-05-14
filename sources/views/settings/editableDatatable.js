import {JetView} from "webix-jet";

import iconsCollection from "../../models/icons";

export default class EditableDatatable extends JetView {
	constructor(app, data) {
		super(app);
		this._dataCollection = data;
	}

	config() {
		const _ = this.app.getService("locale")._;

		const form = {
			view: "form",
			localId: "form_update-datatable",
			elementsConfig: {
				margin: 20,
				labelWidth: "auto",
				on: {
					onFocus: () => {
						const name = this.config.name;

						if (name) {
							this.clearFormValidation();
						}
					}
				}
			},
			cols: [
				{
					view: "text",
					label: _("Value"),
					name: "Value"
				},
				{
					gravity: 0.1
				},
				{
					view: "richselect",
					label: _("Icon"),
					options: {
						body: {
							data: iconsCollection,
							template: obj => `<span class="webix_icon mdi mdi-${obj.Icon}"></span>`
						}
					},
					name: "Icon"
				},
				{
					gravity: 0.1
				},
				{
					rows: [
						{
							view: "button",
							label: _("Add"),
							type: "icon",
							icon: "wxi-plus-square",
							css: "webix_transparent button--border",
							width: 200,
							click: () => {
								this.addToDatatable();
							}
						}
					]
				}
			],
			rules: {
				Value: webix.rules.isNotEmpty,
				Icon: webix.rules.isNotEmpty
			}
		};

		const datatable = {
			view: "datatable",
			localId: "settings_datatable",
			editable: true,
			editaction: "dblclick",
			scrollX: false,
			select: true,
			columns: [
				{
					id: "Value",
					header: _("Value"),
					editor: "text",
					width: 300
				},
				{
					id: "Icon",
					header: _("Icon"),
					editor: "richselect",
					suggest: {
						body: {
							template: obj => `<span class="webix_icon mdi mdi-${obj.Icon}"></span>`
						}
					},
					options: iconsCollection,
					template: obj => `<span class="webix_icon mdi mdi-${obj.Icon}"></span>`,
					fillspace: true
				},
				{
					id: "Delete",
					header: "",
					template: "{common.trashIcon()}",
					width: 50
				}
			],
			onClick: {
				"wxi-trash": (e, id) => {
					this.deleteDatatableItem(id);
				}
			},
			rules: {
				Value: webix.rules.isNotEmpty,
				Icon: webix.rules.isNotEmpty
			}
		};

		return {
			rows: [
				form,
				datatable
			]
		};
	}

	init() {
		const datatable = this.$$("settings_datatable");

		this._dataCollection.waitData.then(() => datatable.sync(this._dataCollection));
	}

	addToDatatable() {
		const _ = this.app.getService("locale")._;
		const form = this.$$("form_update-datatable");

		if (form.validate()) {
			const values = form.getValues();

			this._dataCollection.add(values);
			form.clear();
			webix.message(_("Datatable was updated!"));
		}
		else {
			webix.message(_("Form is incomplete. Fill the form!"));
		}
	}

	deleteDatatableItem(id) {
		const _ = this.app.getService("locale")._;

		webix.confirm({
			title: _("Delete..."),
			text: _("Do you still want delete this line?"),
			ok: _("Yes"),
			cancel: _("No")
		}).then(() => {
			this._dataCollection.remove(id);
		});
	}

	clearFormValidation() {
		const form = this.$$("form_update-datatable");

		form.clearValidation();
	}
}
