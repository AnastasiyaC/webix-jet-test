const activities = [
	{id: 1, Details: "Discuss the product", TypeID: 9, State: "Open", ContactID: 1, DueDate: "2019-01-23 00:00"},
	{id: 2, Details: "Charity lunch", TypeID: 13, State: "Open", ContactID: 1, DueDate: "2019-01-15 00:00"},
	{id: 3, Details: "About the pills", TypeID: 15, State: "Open", ContactID: 1, DueDate: "2019-01-08 00:00"},
	{id: 4, Details: "Discuss the next prototype", TypeID: 9, State: "Open", ContactID: 2, DueDate: "2019-01-25 00:00"},
	{id: 5, Details: "Discuss the human race anihilation", TypeID: 9, State: "Close", ContactID: 2, DueDate: "2019-01-08 00:00"},
	{id: 6, Details: "Product reclamations", TypeID: 15, State: "Open", ContactID: 3, DueDate: "2019-01-25 00:00"},
	{id: 7, Details: "Product reclamation - one more runt", TypeID: 15, State: "Open", ContactID: 3, DueDate: "2019-01-30 00:00"}
];

const activitiesCollection = new webix.DataCollection({
	data: activities
});

// const activityTypeCollection = new webix.DataCollection({
// 	url: "http://localhost:8096/api/v1/activities/ ",
// 	// save: "rest->http://localhost:8096/api/v1/activities/ "
// });

export default activitiesCollection;
