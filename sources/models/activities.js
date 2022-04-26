const activitiesCollection = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init(obj) {
			// obj.DueDate = webix.i18n.longDateFormatStr(obj.DueDate);
			obj.dateObj = new Date(obj.DueDate);
		}
	}
});

export default activitiesCollection;
