const type = [
	{id: 7, Value: "Meeting", Icon: "flag"},
	{id: 9, Value: "Chat", Icon: "comment"},
	{id: 13, Value: "Lunch", Icon: "clock"},
	{id: 15, Value: "Phone call", Icon: "phone"}
];

const activityTypesCollection = new webix.DataCollection({
	data: type
});

// const activityTypeCollection = new webix.DataCollection({
// 	url: "http://localhost:8096/api/v1/activitytypes/",
// 	// save: "rest->http://localhost:8096/api/v1/activitytypes/"
// });

export default activityTypesCollection;

