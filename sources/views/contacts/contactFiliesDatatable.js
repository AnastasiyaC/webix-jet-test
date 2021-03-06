import {JetView} from "webix-jet";

import filesCollection from "../../models/files";

export default class ContactFiliesDatatable extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const filiesDataTable = {
			view: "datatable",
			localId: "files_datatable",
			editable: true,
			select: true,
			scrollX: false,
			columns: [
				{
					id: "Name",
					header: _("Name"),
					sort: "text",
					fillspace: true
				},
				{
					id: "ChangeDate",
					format: webix.i18n.longDateFormatStr,
					header: _("Change date"),
					sort: "date",
					width: 200
				},
				{
					id: "SizeText",
					header: _("Size"),
					sort: this.sortByFileSizes,
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
			label: _("Upload file"),
			type: "icon",
			icon: "mdi mdi-cloud-upload",
			css: "webix_transparent button--border",
			inputWidth: 250,
			align: "center",
			autosend: false,
			on: {
				onAfterFileAdd: obj => this.saveFile(obj),
				onFileUploadError: () => this.showErrorMessage()
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
		const contactId = this.getParam("contactId");

		datatable.sync(filesCollection);
		this.filterByContactName(contactId);
	}

	urlChange() {
		const contactId = this.getParam("contactId");

		this.filterByContactName(contactId);
	}

	filterByContactName(id) {
		filesCollection.filter(obj => obj.ContactID === id);
	}

	toggleDeleteFile(id) {
		const _ = this.app.getService("locale")._;

		webix.confirm({
			title: _("Delete..."),
			text: _("Do you still want to delete this file?"),
			ok: _("Yes"),
			cancel: _("No")
		}).then(() => {
			filesCollection.remove(id);
		});
	}

	sortByFileSizes(a, b) {
		a = a.Size;
		b = b.Size;

		return a >= b ? 1 : -1;
	}

	saveFile(obj) {
		const contactId = this.getParam("contactId");

		const savedFile = {
			ContactID: contactId,
			Name: obj.file.name,
			ChangeDate: obj.file.lastModifiedDate,
			Size: obj.file.size,
			SizeText: obj.sizetext
		};

		filesCollection.add(savedFile);
	}

	showErrorMessage() {
		const _ = this.app.getService("locale")._;

		webix.message(_("Error during file upload..."));
	}
}
