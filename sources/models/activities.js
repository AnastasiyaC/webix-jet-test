const activitiesCollection = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$init(obj) {
			obj.date = obj.DueDate;
			obj.DueDate = new Date(obj.DueDate);
		},
		$save: (obj) => {
			const dueDateFormat = webix.Date.dateToStr("%Y-%m-%d %H:%i");

			obj.DueDate = dueDateFormat(obj.DueDate);
		}
	}
});

export default activitiesCollection;
