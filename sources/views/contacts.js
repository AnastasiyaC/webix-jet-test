import {JetView} from "webix-jet";

// import userIcon from "../assets/icons/icon-user.jpg";
// import contactsCollection from "../models/contacts";
import ContactInfo from "./contactsViews/contactInfo";
import ContactsList from "./contactsViews/contactsList";

export default class ContactsView extends JetView {
	config() {
		// const contactList = {
		// 	view: "list",
		// 	localId: "contacts_list",
		// 	css: "list-contact",
		// 	type: {
		// 		height: 60
		// 	},
		// 	template: obj => `
		// 			<img 
		// 				src=${obj.Photo || userIcon}
		// 				class="contact__image"
		// 				alt="contact-image"
		// 				height="50px"
		// 				width="50px"
		// 			>
		// 			<span class="contact__name">
		// 				<b>
		// 					${obj.FirstName} ${obj.LastName}
		// 				</b>
		// 				<br>
		// 				${obj.Company}
		// 			</span>`,
		// 	select: true,
		// 	width: 300
		// };

		// const listAddContactButton = {
		// 	view: "button",
		// 	label: "Add contact",
		// 	type: "icon",
		// 	icon: "wxi-plus",
		// 	css: "webix_transparent button--border",
		// 	padding: 20,
		// 	margin: 20,
		// 	click: () => this.addContact()
		// };

		return {
			cols: [
				ContactsList,
				ContactInfo
				// {$subview: true}
			]
		};

		// return {
		// 	cols: [
		// 		{
		// 			rows: [
		// 				contactList,
		// 				listAddContactButton
		// 			]
		// 		},
		// 		// ContactsList,
		// 		// ContactInfo
		// 		{$subview: true}
		// 	]
		// };
	}

	// init() {
	// 	const list = this.$$("contacts_list");

	// 	contactsCollection.waitData.then(() => {
	// 		list.sync(contactsCollection);

	// 		const idParam = list.getFirstId();

	// 		if (!idParam) {
	// 			this.show("/top/contacts");
	// 			return;
	// 		}

	// 		this.setParam("id", idParam, true);
	// 		list.select(idParam);
	// 	});

	// 	this.on(list, "onAfterSelect", id => this.show(`./contacts?id=${id}`));
	// }

	// urlChange() {
	// 	const idParam = this.getParam("id");
	// 	const list = this.$$("contacts_list");

	// 	if (!idParam) list.unselectAll();
	// }

	// addContact() {
	// 	const list = this.$$("contacts_list");

	// 	this.show("editor");
	// 	list.unselectAll();
	// }
}
