import {JetView} from "webix-jet";

import filesCollection from "../../models/files";

export default class ContactFiliesDatatable extends JetView {
	config() {
		const filiesDataTable = {
			view: "datatable",
			localId: "files_datatable",
			editable: true,
			select: true,
			scrollX: false,
			columns: [
				{
					id: "Name",
					header: "Name",
					sort: "text",
					fillspace: true
				},
				{
					id: "ChangeDate",
					format: webix.i18n.longDateFormatStr,
					header: "Change date",
					sort: "date",
					width: 200
				},
				{
					id: "SizeText",
					header: "Size",
					sort: this.sortFileSizes,
					width: 100
				},
				{
					id: "delete",
					header: "",
					template: "{common.trashIcon()}",
					width: 50
				}
			],
			onClick: {
				"wxi-trash": (e, id) => this.toggleDeleteFile(id)
			}
		};

		const updoadButton = {
			view: "uploader",
			label: "Upload file",
			type: "icon",
			icon: "mdi mdi-cloud-upload",
			css: "webix_transparent button--border",
			inputWidth: 250,
			align: "center",
			autosend: false,
			on: {
				onAfterFileAdd: obj => this.saveFile(obj)
			}
		};

		return {
			rows: [
				filiesDataTable,
				updoadButton
			]
		};
	}

	init() {
		const datatable = this.$$("files_datatable");
		const contactId = this.getParam("cid");

		datatable.sync(filesCollection);
		this.filterByContactName(contactId);
	}

	urlChange() {
		const contactId = this.getParam("cid");

		this.filterByContactName(contactId);
	}

	filterByContactName(id) {
		const datatable = this.$$("files_datatable");

		datatable.filter("#ContactID#", id, true);
	}

	toggleDeleteFile(id) {
		webix.confirm({
			title: "Delete...",
			text: "Do you still want to delete this file?",
			ok: "Yes",
			cancel: "No"
		}).then(() => {
			filesCollection.remove(id);
		});
	}

	sortFileSizes(a, b) {
		a = a.Size;
		b = b.Size;

		return a >= b ? 1 : -1;
	}

	saveFile(obj) {
		const contactId = this.getParam("cid");
		const dateFormat = webix.Date.dateToStr("%Y-%m-%d %H:%i");

		const savedFile = {
			ContactID: contactId,
			Name: obj.file.name,
			ChangeDate: obj.file.lastModifiedDate,
			Size: obj.file.size,
			SizeText: obj.sizetext
		};

		savedFile.ChangeDate = dateFormat(savedFile.ChangeDate);
		filesCollection.add(savedFile);
	}
}
