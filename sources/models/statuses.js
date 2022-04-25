const statuses = [
	{id: 1, Value: "In Progress", Icon: "cogs"},
	{id: 2, Value: "Active", Icon: "user"},
	{id: 3, Value: "Waiting", Icon: "pencil"},
	{id: 4, Value: "Closed", Icon: "plus"}
];

const statusesCollection = new webix.DataCollection({
	data: statuses
});

// const statusesCollection = new webix.DataCollection({
// 	url: "http://localhost:8096/api/v1/statuses/",
// 	// save: "rest->http://localhost:8096/api/v1/statuses/"
// });

export default statusesCollection;
