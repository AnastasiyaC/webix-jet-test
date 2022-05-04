const contactsCollection = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$init(obj) {
			// const dateFormat = webix.Date.dateToStr("%Y-%m-%d");

			obj.value = `${obj.FirstName} ${obj.LastName}`;
			obj.Birthday = webix.i18n.longDateFormatStr(new Date(obj.Birthday));
			obj.StartDate = webix.i18n.longDateFormatStr(new Date(obj.StartDate));
			// obj.Birthday = new Date(obj.Birthday);
			// obj.StartDate = new Date(obj.StartDate);

			// obj.Birthday = dateFormat(obj.Birthday);
			// obj.StartDate = dateFormat(obj.StartDate);
		},
		$save(obj) {
			const dateFormat = webix.Date.dateToStr("%Y-%m-%d %H:%i");

			obj.StartDate = dateFormat(obj.StartDate);
			obj.Birthday = dateFormat(obj.Birthday);
		}
	}
});

export default contactsCollection;
